import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, DollarSign, TrendingUp, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } else {
      navigate("/auth");
    }
  };

  const { data: tradingStats } = useQuery({
    queryKey: ["trading-stats"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const [tradingVolume, activeBots, brokerConnections, performance] = await Promise.all([
        supabase
          .from("bot_trades")
          .select("entry_price, quantity")
          .eq("user_id", user.user.id)
          .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        supabase
          .from("trading_bots")
          .select("*")
          .eq("user_id", user.user.id)
          .eq("status", "running"),
        supabase
          .from("broker_connections")
          .select("*")
          .eq("user_id", user.user.id)
          .eq("is_active", true),
        supabase
          .from("bot_trades")
          .select("pnl")
          .eq("user_id", user.user.id)
          .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      ]);

      const volume = tradingVolume.data?.reduce((acc, trade) => 
        acc + (Number(trade.entry_price) * Number(trade.quantity)), 0) || 0;

      const monthlyPnl = performance.data?.reduce((acc, trade) => 
        acc + (Number(trade.pnl) || 0), 0) || 0;

      const initialBalance = 10000;
      const monthlyReturn = initialBalance > 0 ? (monthlyPnl / initialBalance) * 100 : 0;

      return {
        volume,
        activeBots: activeBots.data?.length || 0,
        brokerConnections: brokerConnections.data?.length || 0,
        monthlyReturn,
      };
    },
  });

  const stats = [
    {
      title: "Total Trading Volume",
      value: tradingStats ? `$${tradingStats.volume.toLocaleString()}` : "$0",
      description: "Last 30 days",
      icon: DollarSign,
    },
    {
      title: "Active Bots",
      value: tradingStats?.activeBots.toString() || "0",
      description: "Currently running",
      icon: Activity,
    },
    {
      title: "Connected Brokers",
      value: tradingStats?.brokerConnections.toString() || "0",
      description: "API integrations",
      icon: Users,
    },
    {
      title: "Performance",
      value: tradingStats ? `${tradingStats.monthlyReturn.toFixed(2)}%` : "0%",
      description: "Monthly return",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-8 animate-fade-up">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your trading dashboard. Monitor your performance and manage your trading bots.
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
            <CardDescription>Your last 5 trading activities</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No recent trades</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Strategies</CardTitle>
            <CardDescription>Currently running trading strategies</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No active strategies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Balance</CardTitle>
            <CardDescription>Your current trading balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$10,000.00</div>
            <p className="text-xs text-muted-foreground mt-1">Demo Account</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}