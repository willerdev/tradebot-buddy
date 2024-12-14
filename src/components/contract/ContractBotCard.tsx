import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Power, Trash } from "lucide-react";
import { useContractBotManagement } from "@/hooks/use-contract-bot-management";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  const { startBot, stopBot } = useContractBotManagement();
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
            onClick={handleDelete}
          >
            <Trash className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Trading Pair</span>
            <span className="text-sm font-medium">{bot.trading_pair}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Min Profit</span>
            <span className="text-sm font-medium">{bot.min_profit_percentage}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <span
              className={`text-sm font-medium ${
                bot.status === "running" ? "text-green-500" : "text-yellow-500"
              }`}
            >
              {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
            </span>
          </div>
          {bot.last_error && (
            <div className="text-sm text-red-500">
              Last Error: {bot.last_error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}