import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { WithdrawForm } from "@/components/withdraw/WithdrawForm";
import { WithdrawInfo } from "@/components/withdraw/WithdrawInfo";

export default function Withdraw() {
  const [walletAddress, setWalletAddress] = useState("");
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
        .maybeSingle();

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
        .maybeSingle();

      return data;
    },
  });

  useEffect(() => {
    if (isAdmin && botSettings?.withdraw_wallet) {
      setWalletAddress(botSettings.withdraw_wallet);
    }
  }, [botSettings, isAdmin]);

  const handleWithdraw = async (amount: string, withdrawalAddress: string) => {
    try {
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

      // First check if trading account exists, if not create it
      const { data: accounts } = await supabase
        .from('trading_accounts')
        .select('balance')
        .eq('user_id', user.id)
        .eq('account_type', 'live')
        .maybeSingle();

      if (!accounts) {
        // Create live trading account if it doesn't exist
        const { error: createError } = await supabase
          .from('trading_accounts')
          .insert({
            user_id: user.id,
            account_type: 'live',
            balance: 0
          });

        if (createError) throw createError;
        
        toast({
          title: "Insufficient Balance",
          description: "You don't have enough balance for this withdrawal.",
          variant: "destructive",
        });
        return;
      }

      if (accounts.balance < Number(amount)) {
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
        wallet_address: withdrawalAddress,
        status: "pending"
      });

      if (error) throw error;

      toast({
        title: "Withdrawal Requested",
        description: "Your withdrawal request has been submitted and is being processed.",
      });
    } catch (error) {
      console.error("Withdrawal error:", error);
      throw error;
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
          <WithdrawForm
            isAdmin={!!isAdmin}
            walletAddress={walletAddress}
            systemFunds={systemFunds}
            onSubmit={handleWithdraw}
          />
          <WithdrawInfo />
        </CardContent>
      </Card>
    </div>
  );
}