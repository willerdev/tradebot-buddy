import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Play, Power, Settings, TrendingUp, Plus, Trash } from "lucide-react";
import { useBotManagement } from "@/hooks/use-bot-management";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface TradingBot {
  id: string;
  name: string;
  strategy: string;
  status: string;
  trading_pair: string;
  timeframe: string;
  take_profit: number;
  stop_loss: number;
  lot_size: number;
  trade_amount: number;
  performance_metrics: {
    total_pnl?: number;
    [key: string]: any;
  };
}

export default function Bots() {
  const { startBot, stopBot } = useBotManagement();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const { data: bots, refetch } = useQuery({
    queryKey: ["trading-bots"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("trading_bots")
        .select("*")
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as TradingBot[];
    },
  });

  const handleAddBot = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { error } = await supabase.from("trading_bots").insert({
        user_id: user.user.id,
        name: `Bot ${(bots?.length || 0) + 1}`,
        strategy: "Moving Average Crossover",
        status: "stopped",
        trading_pair: "BTC/USDT", // Default trading pair
        timeframe: "1h", // Default timeframe
        take_profit: 2.0, // Default take profit percentage
        stop_loss: 1.0, // Default stop loss percentage
        lot_size: 1.0, // Default lot size
        trade_amount: 100.0 // Default trade amount
      });

      if (error) throw error;

      toast({
        title: "Bot Added",
        description: "New trading bot has been created successfully.",
      });
      refetch();
    } catch (error) {
      console.error("Error adding bot:", error);
      toast({
        title: "Error",
        description: "Failed to add bot. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBot = async (botId: string) => {
    try {
      const { error } = await supabase
        .from("trading_bots")
        .delete()
        .eq("id", botId);

      if (error) throw error;

      toast({
        title: "Bot Removed",
        description: "Trading bot has been removed successfully.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove bot. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-8 animate-fade-up">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Active Bots</h1>
          <p className="text-muted-foreground">
            Manage and monitor your trading bots
          </p>
        </div>
        <Button onClick={handleAddBot}>
          <Plus className="mr-2 h-4 w-4" />
          {!isMobile && "Create New Bot"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {bots?.map((bot) => (
          <Card key={bot.id} className="trading-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">{bot.name}</CardTitle>
              <div className="flex items-center gap-2">
                {bot.status === "running" ? (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => stopBot(bot.id)}
                  >
                    <Power className="h-4 w-4 text-red-500" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => startBot(bot.id)}
                  >
                    <Play className="h-4 w-4 text-green-500" />
                  </Button>
                )}
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleDeleteBot(bot.id)}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Strategy</span>
                  <span className="text-sm font-medium">{bot.strategy}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Trading Pair</span>
                  <span className="text-sm font-medium">{bot.trading_pair}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Timeframe</span>
                  <span className="text-sm font-medium">{bot.timeframe}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span
                    className={`text-sm font-medium ${
                      bot.status === "running"
                        ? "text-green-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
                  </span>
                </div>
                {bot.performance_metrics && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Performance</span>
                    <span className="text-sm font-medium flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      {bot.performance_metrics.total_pnl?.toFixed(2) || "0.00"}%
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}