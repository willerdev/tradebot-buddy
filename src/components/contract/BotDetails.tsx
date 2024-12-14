interface BotDetailsProps {
  tradingPair: string;
  minProfitPercentage: number;
  lastError: string | null;
}

export function BotDetails({ tradingPair, minProfitPercentage, lastError }: BotDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Trading Pair</span>
        <span className="text-sm font-medium">{tradingPair}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Min Profit</span>
        <span className="text-sm font-medium">{minProfitPercentage}%</span>
      </div>
      {lastError && (
        <div className="text-sm text-red-500">
          Last Error: {lastError}
        </div>
      )}
    </div>
  );
}