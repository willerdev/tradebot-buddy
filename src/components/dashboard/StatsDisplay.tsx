import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, DollarSign, TrendingUp, Users, Wallet } from "lucide-react";
import { useAlgorithmStore } from "@/components/settings/AlgorithmToggle";
import { cn } from "@/lib/utils";

interface StatsDisplayProps {
  tradingStats: {
    volume: number;
    activeBots: number;
    brokerConnections: number;
    monthlyReturn: number;
  } | undefined;
  systemFunds: {
    system_fund: number;
    contract_fund: number;
    profit: number;
    withdrawable_funds: number;
  } | undefined;
}

export function StatsDisplay({ tradingStats, systemFunds }: StatsDisplayProps) {
  const { isCompromised } = useAlgorithmStore();

  const stats = [
    {
      title: "System Fund",
      value: systemFunds ? `$${systemFunds.system_fund.toLocaleString()}` : "$0",
      description: "Total system balance",
      icon: Wallet,
    },
    {
      title: "Contract Fund",
      value: systemFunds ? `$${systemFunds.contract_fund.toLocaleString()}` : "$0",
      description: "Available for contracts",
      icon: DollarSign,
    },
    {
      title: "Total Profit",
      value: systemFunds ? `$${systemFunds.profit.toLocaleString()}` : "$0",
      description: "Accumulated profit",
      icon: TrendingUp,
    },
    {
      title: "Withdrawable Funds",
      value: systemFunds ? `$${systemFunds.withdrawable_funds.toLocaleString()}` : "$0",
      description: "Available to withdraw",
      icon: Wallet,
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
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
              <div className={cn(
                "text-2xl font-bold",
                isCompromised && "animate-[pulse_1s_ease-in-out_infinite] text-red-500"
              )}>
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