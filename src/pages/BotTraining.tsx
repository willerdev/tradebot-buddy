import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal, StopCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const strategies = ["Moving Average", "RSI", "MACD", "Bollinger Bands"];
const tradingPairs = ["EUR/USD", "BTC/USD", "ETH/USD", "GBP/USD"];
const durations = ["1 Day", "1 Week", "1 Month", "3 Months"];

export default function BotTraining() {
  const [output, setOutput] = useState<Array<{ text: string; isLoss?: boolean }>>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState(strategies[0]);
  const [simulationInterval, setSimulationInterval] = useState<NodeJS.Timeout | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState({
    amount: "800",
    pair: "EUR/USD",
    strategy: strategies[0],
    duration: durations[0]
  });
  
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const stopSimulation = useCallback(() => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
    setIsSimulating(false);
  }, [simulationInterval]);

  useEffect(() => {
    return () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    };
  }, [simulationInterval]);

  const saveEvent = async (title: string, description: string) => {
    try {
      const { error } = await supabase.from('events').insert([{
        title,
        description,
        date: new Date().toISOString(),
        location: 'Bot Training',
        price: 0
      }]);

      if (error) {
        console.error('Error saving event:', error);
      }
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const simulateBacktest = useCallback(async () => {
    if (isSimulating) return;
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to run simulations.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSimulating(true);
    setOutput([]);

    // Save initial event
    await saveEvent(
      'Bot Training Started',
      `Started training ${config.strategy} bot on ${config.pair} with $${config.amount}`
    );
    
    const commands = [
      { text: "Initializing backtesting environment..." },
      { text: `Loading historical data for ${config.pair} using ${config.strategy}...` },
      { text: "Setting up bot configuration..." },
      { text: `Starting simulation with $${config.amount} stake...` },
    ];

    // Simulate initial commands with delays
    for (const cmd of commands) {
      setOutput(prev => [...prev, cmd]);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const interval = setInterval(async () => {
      const profit = (Math.random() * 40) - 20;
      const trade = {
        id: Date.now(),
        type: Math.random() > 0.5 ? "BUY" : "SELL",
        profit: profit.toFixed(2),
        balance: (Number(config.amount) + profit).toFixed(2)
      };

      // Add delay before showing results
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOutput(prev => [...prev, 
        { text: `Trade #${trade.id}: ${trade.type} ${config.pair}` },
        { text: `Profit/Loss: $${trade.profit}`, isLoss: profit < 0 },
        { text: `Current Balance: $${trade.balance}` },
        { text: "---" }
      ]);

      try {
        // Save trade result event
        await saveEvent(
          'Bot Trade Executed',
          `${config.strategy} bot executed ${trade.type} trade on ${config.pair} with ${profit > 0 ? 'profit' : 'loss'} of $${Math.abs(profit).toFixed(2)}`
        );

        // Save training results with user_id
        await supabase.from('bot_training_results').insert([{
          user_id: user.id, // Add user_id here
          bot_name: `${config.strategy} Bot`,
          trading_pair: config.pair,
          stake_amount: Number(config.amount),
          start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date().toISOString(),
          total_trades: 1,
          win_rate: profit > 0 ? 100 : 0,
          profit_loss: profit,
          training_logs: [trade]
        }]);

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
  }, [isSimulating, config, toast]);

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
          <Dialog open={showConfig} onOpenChange={setShowConfig}>
            <DialogTrigger asChild>
              <Button variant="outline">Configure Bot</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configure Trading Bot</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Trading Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={config.amount}
                    onChange={(e) => setConfig(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Trading Pair</Label>
                  <Select 
                    value={config.pair} 
                    onValueChange={(value) => setConfig(prev => ({ ...prev, pair: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tradingPairs.map((pair) => (
                        <SelectItem key={pair} value={pair}>
                          {pair}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Strategy</Label>
                  <Select 
                    value={config.strategy} 
                    onValueChange={(value) => setConfig(prev => ({ ...prev, strategy: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {strategies.map((strategy) => (
                        <SelectItem key={strategy} value={strategy}>
                          {strategy}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Duration</Label>
                  <Select 
                    value={config.duration} 
                    onValueChange={(value) => setConfig(prev => ({ ...prev, duration: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map((duration) => (
                        <SelectItem key={duration} value={duration}>
                          {duration}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setShowConfig(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowConfig(false);
                    simulateBacktest();
                  }}
                >
                  Start Simulation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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