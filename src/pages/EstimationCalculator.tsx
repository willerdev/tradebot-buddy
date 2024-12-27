import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function EstimationCalculator() {
  const [amount, setAmount] = useState<number>(5500);
  const [estimatedRevenue, setEstimatedRevenue] = useState<number>(0);

  const { data: parameters } = useQuery({
    queryKey: ["estimation-parameters"],
    queryFn: async () => {
      const { data } = await supabase
        .from("estimation_parameters")
        .select("*")
        .single();
      return data;
    },
  });

  useEffect(() => {
    if (parameters) {
      // Calculate daily interest rate from example data
      const dailyInterestRate = (parameters.target_amount - parameters.base_amount) / 
                               (parameters.base_amount * parameters.days_period);
      
      // Calculate estimated revenue using the same daily interest rate
      const estimatedDays = 38; // Using the same period as example
      const calculatedRevenue = amount + (amount * dailyInterestRate * estimatedDays);
      setEstimatedRevenue(Math.round(calculatedRevenue));
    }
  }, [amount, parameters]);

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
              min="5500"
              max="65000"
              step="100"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>$5,500</span>
              <span>${amount.toLocaleString()}</span>
              <span>$65,000</span>
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
                  in 38 days
                </p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}