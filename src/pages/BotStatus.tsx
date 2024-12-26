import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function BotStatus() {
  const { toast } = useToast();

  const { data: copytrader, isLoading: isLoadingCopytrader } = useQuery({
    queryKey: ["copytrader"],
    queryFn: async () => {
      console.log("Fetching bot status...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data: copytraderData, error } = await supabase
        .from("copytraders")
        .select(`
          id,
          trader_name,
          copytrader_bot_status (
            status,
            investment_amount,
            current_profit,
            profit_percentage,
            last_trade_at
          )
        `)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching copytrader:", error);
        throw error;
      }

      return copytraderData;
    },
    retry: 1,
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load bot status",
        variant: "destructive",
      });
    }
  });

  if (isLoadingCopytrader) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!copytrader) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          No copytrader data found. Please set up your copytrader profile first.
        </p>
      </Card>
    );
  }

  const botStatus = copytrader.copytrader_bot_status?.[0];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bot Status</h1>
        <p className="text-muted-foreground">Monitor your trading bot's performance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <h3 className="font-semibold text-sm text-muted-foreground">Status</h3>
          <p className="mt-2 text-2xl font-bold">
            {botStatus?.status || "Inactive"}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-sm text-muted-foreground">Investment</h3>
          <p className="mt-2 text-2xl font-bold">
            ${botStatus?.investment_amount?.toFixed(2) || "0.00"}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-sm text-muted-foreground">Current Profit</h3>
          <p className="mt-2 text-2xl font-bold">
            ${botStatus?.current_profit?.toFixed(2) || "0.00"}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-sm text-muted-foreground">Profit %</h3>
          <p className="mt-2 text-2xl font-bold">
            {botStatus?.profit_percentage?.toFixed(2) || "0.00"}%
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Trading Activity</h2>
        <p className="text-muted-foreground">
          Last trade: {botStatus?.last_trade_at 
            ? new Date(botStatus.last_trade_at).toLocaleString() 
            : "No trades yet"}
        </p>
      </Card>
    </div>
  );
}