import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WithdrawFormProps {
  isAdmin: boolean;
  walletAddress: string;
  systemFunds?: { system_fund: number } | null;
  onSubmit: (amount: string, walletAddress: string) => Promise<void>;
}

export function WithdrawForm({ isAdmin, walletAddress, systemFunds, onSubmit }: WithdrawFormProps) {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await onSubmit(amount, walletAddress);
      setAmount("");
    } catch (error) {
      console.error("Withdrawal form error:", error);
      toast({
        title: "Error",
        description: "Failed to process withdrawal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isSystemFundsLow = isAdmin && systemFunds && systemFunds.system_fund < 5501;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="wallet">TRC20 Wallet Address</Label>
        <Input
          id="wallet"
          placeholder="Enter your TRC20 wallet address"
          value={walletAddress}
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
        onClick={handleSubmit}
        disabled={!walletAddress || !amount || isLoading || isSystemFundsLow}
      >
        {isLoading ? "Processing..." : "Withdraw"}
      </Button>
    </div>
  );
}