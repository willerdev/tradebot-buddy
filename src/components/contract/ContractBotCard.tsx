import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContractBotManagement } from "@/hooks/use-contract-bot-management";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BotActions } from "./BotActions";
import { BotDetails } from "./BotDetails";
import { BotStatus } from "./BotStatus";

interface ContractBotCardProps {
  bot: {
    id: string;
    name: string;
    status: string;
    trading_pair: string;
    min_profit_percentage: number;
    last_check_at: string | null;
    last_error: string | null;
  };
}

export function ContractBotCard({ bot }: ContractBotCardProps) {
  const { stopBot } = useContractBotManagement();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("contract_bots")
        .delete()
        .eq("id", bot.id);

      if (error) throw error;

      toast({
        title: "Bot Deleted",
        description: "Contract bot has been deleted successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ["contract-bots"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete bot. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{bot.name}</CardTitle>
        <BotActions
          botId={bot.id}
          status={bot.status}
          onStop={stopBot}
          onDelete={handleDelete}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <BotDetails
            tradingPair={bot.trading_pair}
            minProfitPercentage={bot.min_profit_percentage}
            lastError={bot.last_error}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <BotStatus status={bot.status} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}