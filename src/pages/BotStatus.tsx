import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BotStatusCard } from "@/components/copytrader/BotStatusCard";
import { useToast } from "@/components/ui/use-toast";

export default function BotStatus() {
  const { toast } = useToast();

  const { data: copytraders } = useQuery({
    queryKey: ["copytrader-status"],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data, error } = await supabase
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
          console.error("Error fetching copytrader status:", error);
          toast({
            title: "Error",
            description: "Failed to fetch bot status",
            variant: "destructive",
          });
          throw error;
        }

        return data;
      } catch (error) {
        console.error("Error in query:", error);
        throw error;
      }
    },
    meta: {
      errorMessage: "Failed to fetch bot status",
    },
  });

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Bot Status</h1>
        <p className="text-muted-foreground">
          Monitor your copytrading bot performance
        </p>
      </div>

      <div className="grid gap-4">
        {copytraders?.copytrader_bot_status?.map((status, index) => (
          <BotStatusCard
            key={index}
            traderName={copytraders.trader_name}
            status={status}
          />
        ))}
      </div>
    </div>
  );
}