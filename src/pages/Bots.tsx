import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Play, Power, Settings, TrendingUp, Plus, Trash } from "lucide-react";
import { useBotManagement } from "@/hooks/use-bot-management";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

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

interface BotFormData {
  name: string;
  trading_pair: string;
  timeframe: string;
  take_profit: number;
  stop_loss: number;
  lot_size: number;
  trade_amount: number;
}

const TIMEFRAMES = [
  { value: "1h", label: "1 Hour" },
  { value: "2h", label: "2 Hours" },
  { value: "4h", label: "4 Hours" },
  { value: "1d", label: "1 Day" },
  { value: "1w", label: "1 Week" },
  { value: "1M", label: "1 Month" },
];

const TRADING_PAIRS = [
  "BTC/USDT",
  "ETH/USDT",
  "BNB/USDT",
  "SOL/USDT",
  "XRP/USDT",
];

export default function Bots() {
  const { startBot, stopBot } = useBotManagement();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<TradingBot | null>(null);
  const [formData, setFormData] = useState<BotFormData>({
    name: "",
    trading_pair: "BTC/USDT",
    timeframe: "1h",
    take_profit: 2.0,
    stop_loss: 1.0,
    lot_size: 1.0,
    trade_amount: 100.0,
  });

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

  const handleSubmit = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      if (editingBot) {
        // Update existing bot
        const { error } = await supabase
          .from("trading_bots")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingBot.id);

        if (error) throw error;

        toast({
          title: "Bot Updated",
          description: "Trading bot has been updated successfully.",
        });
      } else {
        // Create new bot
        const { error } = await supabase.from("trading_bots").insert({
          ...formData,
          user_id: user.user.id,
          strategy: "Moving Average Crossover",
          status: "stopped",
        });

        if (error) throw error;

        toast({
          title: "Bot Added",
          description: "New trading bot has been created successfully.",
        });
      }

      setIsOpen(false);
      setEditingBot(null);
      setFormData({
        name: "",
        trading_pair: "BTC/USDT",
        timeframe: "1h",
        take_profit: 2.0,
        stop_loss: 1.0,
        lot_size: 1.0,
        trade_amount: 100.0,
      });
      refetch();
    } catch (error) {
      console.error("Error managing bot:", error);
      toast({
        title: "Error",
        description: "Failed to manage bot. Please try again.",
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

  const handleEditBot = (bot: TradingBot) => {
    setEditingBot(bot);
    setFormData({
      name: bot.name,
      trading_pair: bot.trading_pair,
      timeframe: bot.timeframe,
      take_profit: bot.take_profit,
      stop_loss: bot.stop_loss,
      lot_size: bot.lot_size,
      trade_amount: bot.trade_amount,
    });
    setIsOpen(true);
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
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingBot(null);
              setFormData({
                name: "",
                trading_pair: "BTC/USDT",
                timeframe: "1h",
                take_profit: 2.0,
                stop_loss: 1.0,
                lot_size: 1.0,
                trade_amount: 100.0,
              });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              {!isMobile && "Create New Bot"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBot ? "Edit Bot" : "Create New Bot"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Bot Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter bot name"
                />
              </div>
              <div className="space-y-2">
                <Label>Trading Pair</Label>
                <Select
                  value={formData.trading_pair}
                  onValueChange={(value) => setFormData({ ...formData, trading_pair: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select trading pair" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRADING_PAIRS.map((pair) => (
                      <SelectItem key={pair} value={pair}>
                        {pair}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Timeframe</Label>
                <Select
                  value={formData.timeframe}
                  onValueChange={(value) => setFormData({ ...formData, timeframe: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEFRAMES.map((tf) => (
                      <SelectItem key={tf.value} value={tf.value}>
                        {tf.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Take Profit (%)</Label>
                <Input
                  type="number"
                  value={formData.take_profit}
                  onChange={(e) => setFormData({ ...formData, take_profit: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Stop Loss (%)</Label>
                <Input
                  type="number"
                  value={formData.stop_loss}
                  onChange={(e) => setFormData({ ...formData, stop_loss: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Lot Size</Label>
                <Input
                  type="number"
                  value={formData.lot_size}
                  onChange={(e) => setFormData({ ...formData, lot_size: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Trade Amount</Label>
                <Input
                  type="number"
                  value={formData.trade_amount}
                  onChange={(e) => setFormData({ ...formData, trade_amount: parseFloat(e.target.value) })}
                />
              </div>
              <Button className="w-full" onClick={handleSubmit}>
                {editingBot ? "Update Bot" : "Create Bot"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEditBot(bot)}
                >
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
                  <span className="text-sm text-muted-foreground">Take Profit</span>
                  <span className="text-sm font-medium">{bot.take_profit}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Stop Loss</span>
                  <span className="text-sm font-medium">{bot.stop_loss}%</span>
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