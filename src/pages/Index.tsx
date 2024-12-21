import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TransactionHistory } from "@/components/dashboard/TransactionHistory";
import { SystemInfoDisplay } from "@/components/dashboard/SystemInfoDisplay";
import { StatsDisplay } from "@/components/dashboard/StatsDisplay";

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: isAdmin } = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data } = await supabase
        .from("admins")
        .select("*")
        .eq("user_id", user.user.id)
        .maybeSingle();

      return !!data;
    },
  });

  const { data: tradingStats } = useQuery({
    queryKey: ["trading-stats"],
    queryFn: async () => {
      console.log("Fetching trading stats...");
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const [tradingVolume, activeBots, brokerConnections, performance, contracts, accounts] = await Promise.all([
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
        supabase
          .from("contracts")
          .select("capital, profit")
          .eq("user_id", user.user.id)
          .eq("status", "active"),
        supabase
          .from("trading_accounts")
          .select("balance")
          .eq("user_id", user.user.id)
      ]);

      const volume = tradingVolume.data?.reduce((acc, trade) => 
        acc + (Number(trade.entry_price) * Number(trade.quantity)), 0) || 0;

      const monthlyPnl = performance.data?.reduce((acc, trade) => 
        acc + (Number(trade.pnl) || 0), 0) || 0;

      const totalCapital = contracts.data?.reduce((acc, contract) => 
        acc + Number(contract.capital), 0) || 0;

      const totalProfit = contracts.data?.reduce((acc, contract) => 
        acc + Number(contract.profit), 0) || 0;

      const totalBalance = accounts.data?.reduce((acc, account) => 
        acc + Number(account.balance), 0) || 0;

      return {
        volume,
        activeBots: activeBots.data?.length || 0,
        brokerConnections: brokerConnections.data?.length || 0,
        monthlyReturn: monthlyPnl,
        totalCapital,
        totalProfit,
        totalBalance
      };
    },
  });
  
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

  return (
    <div className="container mx-auto py-6 space-y-8 animate-fade-up px-4 md:px-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            {isAdmin 
              ? "Admin dashboard - Monitor system performance and manage users"
              : "Welcome to your trading dashboard. Monitor your performance and manage your trading bots."}
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <StatsDisplay tradingStats={tradingStats} />
      
      {!isAdmin && <SystemInfoDisplay />}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <TransactionHistory />
      </div>
    </div>
  );
}