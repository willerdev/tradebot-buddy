import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, DollarSign, Percent, Signal } from "lucide-react";
import { format } from "date-fns";

interface BotStatusCardProps {
  traderName: string;
  status: {
    status: string;
    investment_amount: number;
    current_profit: number;
    profit_percentage: number;
    last_trade_at: string;
  };
}

export function BotStatusCard({ traderName, status }: BotStatusCardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Trader</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{traderName}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Status: {status.status}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Investment</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${status.investment_amount.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Last trade: {status.last_trade_at ? format(new Date(status.last_trade_at), 'MMM dd, yyyy') : 'No trades yet'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Profit</CardTitle>
          <Signal className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${status.current_profit.toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Profit Rate</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{status.profit_percentage.toFixed(2)}%</div>
        </CardContent>
      </Card>
    </div>
  );
}