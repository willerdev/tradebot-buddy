import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Activity, DollarSign, Percent, Signal } from "lucide-react";
import { BotStatusCard } from "@/components/copytrader/BotStatusCard";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BotStatus() {
  const { toast } = useToast();

  const { data: botStatus, error } = useQuery({
    queryKey: ["copytrader-bot-status"],
    queryFn: async () => {
      console.log("Fetching bot status...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // First get the copytrader id
      const { data: copytrader, error: copytraderError } = await supabase
        .from("copytraders")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (copytraderError) {
        console.error("Error fetching copytrader:", copytraderError);
        throw copytraderError;
      }

      // Then get the bot status
      const { data: status, error: statusError } = await supabase
        .from("copytrader_bot_status")
        .select("*")
        .eq("copytrader_id", copytrader.id)
        .single();

      if (statusError) {
        console.error("Error fetching bot status:", statusError);
        throw statusError;
      }

      return status;
    },
  });

  useEffect(() => {
    if (error) {
      console.error("Bot status error:", error);
      toast({
        title: "Error",
        description: "Failed to load bot status. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const stats = [
    {
      title: "Bot Status",
      value: botStatus?.status || "Inactive",
      icon: <Signal className="h-4 w-4 text-muted-foreground" />,
      description: `Last active: ${botStatus?.last_trade_at ? new Date(botStatus.last_trade_at).toLocaleString() : 'Never'}`
    },
    {
      title: "Investment Amount",
      value: `$${botStatus?.investment_amount?.toLocaleString() || '0'}`,
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Current Profit",
      value: `$${botStatus?.current_profit?.toLocaleString() || '0'}`,
      icon: <Activity className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Profit Percentage",
      value: `${botStatus?.profit_percentage?.toFixed(2) || '0'}%`,
      icon: <Percent className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Bot Status</h1>
        <p className="text-muted-foreground">
          Monitor your trading bot's performance and status
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <BotStatusCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trading Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Signal className={`h-12 w-12 mx-auto ${botStatus?.status === 'active' ? 'text-green-500' : 'text-yellow-500'}`} />
            <h3 className="mt-4 text-lg font-semibold">
              {botStatus?.status === 'active' ? 'Bot is actively trading' : 'Bot is currently inactive'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {botStatus?.status === 'active'
                ? 'Your bot is monitoring the market and executing trades based on your settings.'
                : 'Your bot is not currently trading. Check your settings or contact support if you need assistance.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}