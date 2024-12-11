import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader, Plus } from "lucide-react";
import { useState } from "react";

export function StrategySettings() {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddStrategy = () => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Trading Strategies</h3>
        <p className="text-sm text-muted-foreground">
          Configure and manage your automated trading strategies.
        </p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Moving Average Crossover</CardTitle>
            <CardDescription>A trend-following strategy using moving averages</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This strategy generates signals when the fast moving average crosses the slow moving average.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Configure</Button>
              <Button variant="outline" size="sm">Backtest</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>RSI Strategy</CardTitle>
            <CardDescription>Relative Strength Index based trading</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Uses RSI indicator to identify overbought and oversold conditions.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Configure</Button>
              <Button variant="outline" size="sm">Backtest</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={handleAddStrategy} disabled={isLoading}>
        {isLoading ? (
          <Loader className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Plus className="mr-2 h-4 w-4" />
        )}
        Add Strategy
      </Button>
    </div>
  );
}