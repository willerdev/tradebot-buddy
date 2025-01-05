import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { EstimationParameters } from "@/types/database";

export default function EstimationCalculator() {
  const [amount, setAmount] = useState<number>(5500);
  const [estimatedRevenue, setEstimatedRevenue] = useState<number>(0);

  // Fetch system funds to get the minimum investment amount
  const { data: systemFunds } = useQuery({
    queryKey: ["system-funds"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('system_funds')
        .select('system_fund')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: parameters } = useQuery<EstimationParameters>({
    queryKey: ["estimation-parameters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("estimation_parameters")
        .select("*")
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    // Set initial amount when system funds are loaded
    if (systemFunds?.system_fund) {
      setAmount(systemFunds.system_fund);
    }
  }, [systemFunds]);

  useEffect(() => {
    if (parameters) {
      // Calculate daily interest rate based on the investment amount
      const baseInterestRate = (parameters.target_amount - parameters.base_amount) / 
                             (parameters.base_amount * parameters.days_period);
      
      // Adjust interest rate based on investment size
      const investmentFactor = amount / parameters.base_amount;
      const adjustedInterestRate = baseInterestRate * (1 + Math.log10(investmentFactor));
      
      // Calculate estimated revenue using adjusted interest rate
      const estimatedDays = parameters.days_period;
      const calculatedRevenue = amount + (amount * adjustedInterestRate * estimatedDays);
      setEstimatedRevenue(Math.round(calculatedRevenue));
    }
  }, [amount, parameters]);

  const minAmount = systemFunds?.system_fund || 5500;
  const maxAmount = 65000;

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Revenue Estimator</h1>
        <p className="text-muted-foreground">
          Calculate your estimated revenue based on investment amount
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Investment Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Investment Amount (USDT)</Label>
            <Input
              id="amount"
              type="range"
              min={minAmount}
              max={maxAmount}
              step="100"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${minAmount.toLocaleString()}</span>
              <span>${amount.toLocaleString()}</span>
              <span>${maxAmount.toLocaleString()}</span>
            </div>
          </div>

          <Card className="bg-secondary">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-medium">Estimated Revenue</h3>
                <p className="text-3xl font-bold text-primary mt-2">
                  ${estimatedRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  in {parameters?.days_period || 38} days
                </p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}