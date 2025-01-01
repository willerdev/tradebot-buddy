import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function Withdraw() {
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendWithdrawalEmail = async (email: string, amount: string, walletAddress: string, status: string) => {
    try {
      const { error } = await supabase.functions.invoke("send-email", {
        body: {
          to: email,
          subject: "Withdrawal Notification",
          amount: Number(amount),
          currency: "USDT",
          walletAddress,
          status
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error sending email notification:", error);
    }
  };

  const handleWithdraw = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get user's email
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) throw new Error("Profile not found");

      const { data: systemFunds } = await supabase
        .from('system_funds')
        .select('withdrawable_funds')
        .eq('user_id', user.id)
        .single();

      if (!systemFunds || systemFunds.withdrawable_funds < Number(amount)) {
        toast({
          title: "Insufficient Balance",
          description: "You don't have enough withdrawable funds.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("withdrawals").insert({
        user_id: user.id,
        amount: Number(amount),
        currency: "USDT",
        wallet_address: walletAddress,
        status: "pending"
      });

      if (error) throw error;

      // Send email notification
      await sendWithdrawalEmail(user.email!, amount, walletAddress, "pending");

      toast({
        title: "Withdrawal Requested",
        description: "Your withdrawal request has been submitted and is being processed.",
      });

      setWalletAddress("");
      setAmount("");
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast({
        title: "Error",
        description: "Failed to process withdrawal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-8 animate-fade-up">
      <div>
        <h1 className="text-3xl font-bold">Withdraw USDT</h1>
        <p className="text-muted-foreground">
          Withdraw USDT from your copytrading account using TRC20 network
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Form</CardTitle>
          <CardDescription>Please enter your withdrawal details carefully</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet">TRC20 Wallet Address</Label>
              <Input
                id="wallet"
                placeholder="Enter your TRC20 wallet address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USDT)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount to withdraw"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <Button 
              className="w-full" 
              onClick={handleWithdraw}
              disabled={!walletAddress || !amount || isLoading}
            >
              {isLoading ? "Processing..." : "Withdraw"}
            </Button>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important Notice</AlertTitle>
            <AlertDescription className="mt-2 text-sm">
              Please ensure you are withdrawing to a valid TRC20 wallet address. Withdrawals to incorrect addresses cannot be recovered.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
});
