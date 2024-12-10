import { Bot, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your trading bots and performance
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="trading-card">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/20">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Bots</p>
              <p className="text-2xl font-bold">4</p>
            </div>
          </div>
        </Card>

        <Card className="trading-card">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-trading-profit/20">
              <TrendingUp className="h-6 w-6 text-trading-profit" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Profit</p>
              <p className="text-2xl font-bold text-trading-profit">+$1,234.56</p>
            </div>
          </div>
        </Card>

        <Card className="trading-card">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-trading-loss/20">
              <TrendingDown className="h-6 w-6 text-trading-loss" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Loss</p>
              <p className="text-2xl font-bold text-trading-loss">-$234.56</p>
            </div>
          </div>
        </Card>

        <Card className="trading-card">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-trading-neutral/20">
              <Activity className="h-6 w-6 text-trading-neutral" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Win Rate</p>
              <p className="text-2xl font-bold">76%</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="trading-card">
          <h2 className="text-lg font-semibold mb-4">Active Trades</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-black/40">
              <div>
                <p className="font-medium">BTC/USD</p>
                <p className="text-sm text-muted-foreground">Long Position</p>
              </div>
              <div className="text-right">
                <p className="text-trading-profit">+2.34%</p>
                <p className="text-sm text-muted-foreground">$34,567.89</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-black/40">
              <div>
                <p className="font-medium">ETH/USD</p>
                <p className="text-sm text-muted-foreground">Short Position</p>
              </div>
              <div className="text-right">
                <p className="text-trading-loss">-1.23%</p>
                <p className="text-sm text-muted-foreground">$2,345.67</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="trading-card">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              {
                time: "2 mins ago",
                event: "Stop-loss triggered for ETH/USD",
                type: "loss",
              },
              {
                time: "15 mins ago",
                event: "Take-profit hit for BTC/USD",
                type: "profit",
              },
              {
                time: "1 hour ago",
                event: "New bot started trading",
                type: "neutral",
              },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-lg bg-black/40"
              >
                <p className="font-medium">{activity.event}</p>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;