import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function BotTraining() {
  const [output, setOutput] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const { toast } = useToast();

  const simulateBacktest = async () => {
    if (isSimulating) return;
    
    setIsSimulating(true);
    setOutput([]);
    
    const commands = [
      "Initializing backtesting environment...",
      "Loading historical data for EUR/USD...",
      "Setting up bot configuration...",
      "Starting simulation with $800 stake...",
    ];

    // Simulate initial commands
    for (const cmd of commands) {
      setOutput(prev => [...prev, cmd]);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Simulate trades
    const trades = [];
    let balance = 800;
    const numTrades = 10;
    
    for (let i = 0; i < numTrades; i++) {
      const profit = (Math.random() * 40) - 20; // Random profit/loss between -20 and 20
      balance += profit;
      const trade = {
        id: i + 1,
        type: Math.random() > 0.5 ? "BUY" : "SELL",
        profit: profit.toFixed(2),
        balance: balance.toFixed(2)
      };
      trades.push(trade);
      
      setOutput(prev => [...prev, 
        `Trade #${trade.id}: ${trade.type} EUR/USD`,
        `Profit/Loss: $${trade.profit}`,
        `Current Balance: $${trade.balance}`,
        "---"
      ]);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Calculate final results
    const winningTrades = trades.filter(t => parseFloat(t.profit) > 0).length;
    const winRate = (winningTrades / numTrades) * 100;
    const totalProfit = balance - 800;

    const finalOutput = [
      "Simulation completed!",
      `Total trades: ${numTrades}`,
      `Win rate: ${winRate.toFixed(2)}%`,
      `Final balance: $${balance.toFixed(2)}`,
      `Total profit/loss: $${totalProfit.toFixed(2)}`
    ];

    setOutput(prev => [...prev, ...finalOutput]);

    // Save results to database
    try {
      const { error } = await supabase.from('bot_training_results').insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        bot_name: "EUR/USD Backtest Bot",
        trading_pair: "EUR/USD",
        stake_amount: 800,
        start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end_date: new Date(),
        total_trades: numTrades,
        win_rate: winRate,
        profit_loss: totalProfit,
        training_logs: trades
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Training results have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving results:', error);
      toast({
        title: "Error",
        description: "Failed to save training results.",
        variant: "destructive",
      });
    }

    setIsSimulating(false);
  };

  useEffect(() => {
    simulateBacktest();
  }, []);

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bot Training Results</h1>
          <p className="text-muted-foreground">
            Watch your trading bot perform backtesting simulations
          </p>
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
                {line.startsWith('---') ? (
                  <hr className="border-green-800 my-2" />
                ) : (
                  <span>$ {line}</span>
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