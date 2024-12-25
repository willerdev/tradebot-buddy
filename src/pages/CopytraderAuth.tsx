import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import bcrypt from "bcryptjs";

export default function CopytraderAuth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, find the copytrader account
      const { data: account, error: accountError } = await supabase
        .from("copytrader_accounts")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (accountError) {
        console.error("Account lookup error:", accountError);
        throw new Error("Error looking up account");
      }

      if (!account) {
        throw new Error("Invalid email or password");
      }

      // Verify the password using bcrypt
      const isPasswordValid = await bcrypt.compare(password, account.password_hash);
      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      // Get copytrader details
      const { data: copytrader, error: copytraderError } = await supabase
        .from("copytraders")
        .select("*")
        .eq("id", account.copytrader_id)
        .maybeSingle();

      if (copytraderError || !copytrader) {
        console.error("Copytrader lookup error:", copytraderError);
        throw new Error("Error retrieving copytrader details");
      }

      // Store copytrader info in localStorage
      localStorage.setItem("copytrader_session", JSON.stringify({
        id: account.copytrader_id,
        email: account.email,
        trader_name: copytrader.trader_name
      }));

      // Update last login timestamp
      const { error: updateError } = await supabase
        .from("copytrader_accounts")
        .update({ last_login: new Date().toISOString() })
        .eq("id", account.id);

      if (updateError) {
        console.error("Failed to update last login:", updateError);
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in to your copytrader account.",
      });

      navigate("/copytrader/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Link to="/" className="absolute top-4 left-4 text-muted-foreground hover:text-primary flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="text-2xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        MuraFx Copytrader Portal
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Copytrader Login</CardTitle>
          <CardDescription>
            Enter your copytrader credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Are you an admin?{" "}
            <Link to="/auth" className="text-primary hover:underline">
              Login here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}