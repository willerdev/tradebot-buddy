import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Play, Power, Settings, TrendingUp } from "lucide-react";
import { useBotManagement } from "@/hooks/use-bot-management";

export default function Bots() {
  const { startBot, stopBot } = useBotManagement();

  const bots = [
    {
      id: "bot-1",
      name: "Trend Follower",
      status: "running",
      strategy: "Moving Average Crossover",
      performance: "+5.2%",
      lastTrade: "2024-03-20 14:30:00",
    },
    {
      id: "bot-2",
      name: "Scalping Bot",
      status: "stopped",
      strategy: "RSI Divergence",
      performance: "+2.8%",
      lastTrade: "2024-03-20 12:15:00",
    },
    {
      id: "bot-3",
      name: "Grid Trader",
      status: "running",
      strategy: "Grid Trading",
      performance: "+3.7%",
      lastTrade: "2024-03-20 14:25:00",
    },
    {
      id: "bot-4",
      name: "Mean Reversion",
      status: "stopped",
      strategy: "Bollinger Bands",
      performance: "+1.9%",
      lastTrade: "2024-03-19 23:45:00",
    },
  ];

  const handleStartBot = async (botId: string) => {
    try {
      await startBot(botId);
      console.log("Bot started:", botId);
    } catch (error) {
      console.error("Error starting bot:", error);
    }
  };

  const handleStopBot = async (botId: string) => {
    try {
      await stopBot(botId);
      console.log("Bot stopped:", botId);
    } catch (error) {
      console.error("Error stopping bot:", error);
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
        <Button>
          <Bot className="mr-2 h-4 w-4" />
          Create New Bot
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {bots.map((bot) => (
          <Card key={bot.id} className="trading-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">{bot.name}</CardTitle>
              <div className="flex items-center gap-2">
                {bot.status === "running" ? (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleStopBot(bot.id)}
                  >
                    <Power className="h-4 w-4 text-red-500" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleStartBot(bot.id)}
                  >
                    <Play className="h-4 w-4 text-green-500" />
                  </Button>
                )}
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Strategy</span>
                <span className="text-sm font-medium">{bot.strategy}</span>
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
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Performance</span>
                <span className="text-sm font-medium flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  {bot.performance}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Trade</span>
                <span className="text-sm font-medium">{bot.lastTrade}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}