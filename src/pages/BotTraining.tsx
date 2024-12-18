import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal, StopCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const strategies = ["Moving Average", "RSI", "MACD", "Bollinger Bands"];

export default function BotTraining() {
  const [output, setOutput] = useState<Array<{ text: string; isLoss?: boolean }>>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState(strategies[0]);
  const [simulationInterval, setSimulationInterval] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const stopSimulation = useCallback(() => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
    setIsSimulating(false);
  }, [simulationInterval]);

  const simulateBacktest = useCallback(async () => {
    if (isSimulating) return;
    
    setIsSimulating(true);
    setOutput([]);
    
    const commands = [
      { text: "Initializing backtesting environment..." },
      { text: `Loading historical data for EUR/USD using ${selectedStrategy}...` },
      { text: "Setting up bot configuration..." },
      { text: "Starting simulation with $800 stake..." },
    ];

    // Simulate initial commands
    for (const cmd of commands) {
      setOutput(prev => [...prev, cmd]);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const interval = setInterval(async () => {
      const profit = (Math.random() * 40) - 20; // Random profit/loss between -20 and 20
      const trade = {
        id: Date.now(),
        type: Math.random() > 0.5 ? "BUY" : "SELL",
        profit: profit.toFixed(2),
        balance: (800 + profit).toFixed(2)
      };
      
      setOutput(prev => [...prev, 
        { text: `Trade #${trade.id}: ${trade.type} EUR/USD` },
        { text: `Profit/Loss: $${trade.profit}`, isLoss: profit < 0 },
        { text: `Current Balance: $${trade.balance}` },
        { text: "---" }
      ]);

      try {
        const { error } = await supabase.from('bot_training_results').insert([{
          bot_name: "EUR/USD Backtest Bot",
          trading_pair: "EUR/USD",
          stake_amount: 800,
          start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date().toISOString(),
          total_trades: 1,
          win_rate: profit > 0 ? 100 : 0,
          profit_loss: profit,
          training_logs: [trade]
        }]);

        if (error) throw error;
      } catch (error) {
        console.error('Error saving results:', error);
        toast({
          title: "Error",
          description: "Failed to save training results.",
          variant: "destructive",
        });
      }
    }, 2000);

    setSimulationInterval(interval);
  }, [isSimulating, selectedStrategy, toast]);

  useEffect(() => {
    return () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    };
  }, [simulationInterval]);

  if (isMobile) {
    return (
      <div className="container mx-auto py-6">
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <p className="text-yellow-800 text-center">
              Bot testing procedures are already in place. Please wait or use a desktop device for better experience.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bot Training Results</h1>
          <p className="text-muted-foreground">
            Watch your trading bot perform backtesting simulations
          </p>
        </div>
        <div className="flex gap-4">
          <select
            className="border rounded-md px-3 py-2"
            value={selectedStrategy}
            onChange={(e) => setSelectedStrategy(e.target.value)}
          >
            {strategies.map((strategy) => (
              <option key={strategy} value={strategy}>
                {strategy}
              </option>
            ))}
          </select>
          <Button
            variant="destructive"
            onClick={stopSimulation}
            disabled={!isSimulating}
            className="flex items-center gap-2"
          >
            <StopCircle className="h-4 w-4" />
            Stop Simulation
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Backtesting Terminal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-[500px] overflow-y-auto">
            {output.map((line, index) => (
              <div key={index} className="mb-1">
                {line.text.startsWith('---') ? (
                  <hr className="border-green-800 my-2" />
                ) : (
                  <span className={line.isLoss ? "text-red-500" : ""}>
                    $ {line.text}
                  </span>
                )}
              </div>
            ))}
            {isSimulating && (
              <div className="animate-pulse">$ _</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}