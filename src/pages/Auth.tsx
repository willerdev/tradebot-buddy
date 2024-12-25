import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const ALLOWED_EMAILS = ["willeratmit12@gmail.com", "rukundo18@gmail.com"];

export default function AuthPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);

  useEffect(() => {
    const checkExistingSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session check error:", error);
        return;
      }
      if (session) {
        console.log("Existing session found, redirecting to dashboard");
        navigate("/dashboard");
      }
    };

    checkExistingSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event);
      
      if (event === "SIGNED_IN" && session) {
        if (!ALLOWED_EMAILS.includes(session.user.email || "")) {
          toast({
            title: "Access Denied",
            description: "Only administrators are allowed to access this portal.",
            variant: "destructive",
          });
          supabase.auth.signOut();
          return;
        }
        
        console.log("Sign in successful, redirecting to dashboard");
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate("/dashboard");
      }
    });

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  // Monitor email input for validation
  const handleEmailChange = (e: any) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsValidEmail(ALLOWED_EMAILS.includes(newEmail));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Link to="/" className="absolute top-4 left-4 text-muted-foreground hover:text-primary flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
      
      <div className="text-2xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        MuraFx Admin Portal
      </div>

      <Alert className="mb-6 max-w-md">
        <AlertDescription>
          This portal is restricted to administrators only.
          {!isValidEmail && email && (
            <div className="mt-2 text-red-500">
              Only Admin can login here. If you are a copytrader, 
              <Link to="/copytrader-auth" className="ml-1 underline">click here to login</Link>
            </div>
          )}
        </AlertDescription>
      </Alert>
      
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              style: {
                button: {
                  backgroundColor: isValidEmail ? undefined : '#ccc',
                  pointerEvents: isValidEmail ? undefined : 'none',
                  opacity: isValidEmail ? undefined : '0.5'
                }
              }
            }}
            theme="dark"
            providers={[]}
            localization={{
              variables: {
                sign_in: {
                  email_label: "Admin Email",
                  email_input_placeholder: "Enter admin email",
                }
              }
            }}
          />
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Are you a copytrader?{" "}
            <Link to="/copytrader-auth" className="text-primary hover:underline">
              Login here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}