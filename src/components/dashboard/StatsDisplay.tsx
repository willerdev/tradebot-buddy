import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, DollarSign, TrendingUp, Users, Wallet } from "lucide-react";

interface StatsDisplayProps {
  tradingStats: {
    volume: number;
    activeBots: number;
    brokerConnections: number;
    monthlyReturn: number;
    totalCapital: number;
    totalProfit: number;
    totalBalance: number;
  } | undefined;
}

export function StatsDisplay({ tradingStats }: StatsDisplayProps) {
  const stats = [
    {
      title: "System Balance",
      value: tradingStats ? `$${tradingStats.totalBalance.toLocaleString()}` : "$0",
      description: "Total balance across all accounts",
      icon: Wallet,
      className: "col-span-full md:col-span-2 bg-green-50 dark:bg-green-950",
      valueClassName: "text-3xl text-green-600 dark:text-green-400"
    },
    {
      title: "Total Trading Volume",
      value: tradingStats ? `$${tradingStats.volume.toLocaleString()}` : "$0",
      description: "Last 30 days",
      icon: DollarSign,
    },
    {
      title: "Contract Capital",
      value: tradingStats ? `$${tradingStats.totalCapital.toLocaleString()}` : "$0",
      description: "Active contracts",
      icon: Wallet,
    },
    {
      title: "Contract Profit",
      value: tradingStats ? `$${tradingStats.totalProfit.toLocaleString()}` : "$0",
      description: "Total profit",
      icon: TrendingUp,
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
  ];

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className={stat.className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.valueClassName || ''}`}>
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}