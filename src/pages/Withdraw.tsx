import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function Withdraw() {
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { data: botSettings } = useQuery({
    queryKey: ["bot-settings"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data } = await supabase
        .from("bot_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      return data;
    },
  });

  const { data: isAdmin } = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data } = await supabase
        .from("admins")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      return !!data;
    },
  });

  const { data: systemFunds } = useQuery({
    queryKey: ["system-funds"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data } = await supabase
        .from("system_funds")
        .select("*")
        .eq("user_id", user.id)
        .single();

      return data;
    },
  });

  useEffect(() => {
    if (isAdmin && botSettings?.withdraw_wallet) {
      setWalletAddress(botSettings.withdraw_wallet);
    }
  }, [botSettings, isAdmin]);

  const handleWithdraw = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (isAdmin && systemFunds && systemFunds.system_fund < 5501) {
        toast({
          title: "Insufficient System Balance",
          description: "System funds are under the minimum operating funds ($5,500) to make withdrawals. Please top up above $5,501.",
          variant: "destructive",
        });
        return;
      }

      const { data: accounts } = await supabase
        .from('trading_accounts')
        .select('balance')
        .eq('user_id', user.id)
        .eq('account_type', 'live')
        .single();

      if (!accounts || accounts.balance < Number(amount)) {
        toast({
          title: "Insufficient Balance",
          description: "You don't have enough balance for this withdrawal.",
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

      toast({
        title: "Withdrawal Requested",
        description: "Your withdrawal request has been submitted and is being processed.",
      });

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
          Withdraw USDT from your trading account using TRC20 network
        </p>
      </div>

      {isAdmin && systemFunds && systemFunds.system_fund < 5501 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            System funds are under the minimum operating funds ($5,500) to make withdrawals. Please top up above $5,501.
          </AlertDescription>
        </Alert>
      )}

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
                readOnly={isAdmin}
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

          <div className="grid gap-2 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Withdraw Unlocked</span>
              <span>20 confirmations</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Network</span>
              <span>TRC20</span>
            </div>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important Notice</AlertTitle>
            <AlertDescription className="mt-2 text-sm">
              Please ensure you are withdrawing to a valid TRC20 wallet address. Withdrawals to incorrect addresses or different networks cannot be recovered. The minimum withdrawal amount is 1 USDT.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
