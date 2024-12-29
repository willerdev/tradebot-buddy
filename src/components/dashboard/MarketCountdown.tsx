import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export function MarketCountdown() {
  const [countdown, setCountdown] = useState<string>("");
  const [isMarketOpen, setIsMarketOpen] = useState<boolean>(false);

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const dayOfWeek = now.getUTCDay(); // 0 = Sunday, 1 = Monday, 5 = Friday
      const hours = now.getUTCHours();
      const minutes = now.getUTCMinutes();
      const seconds = now.getUTCSeconds();

      // Market is open from Monday 00:00 to Friday 22:00 UTC
      if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday to Friday
        if (dayOfWeek === 5 && hours >= 22) { // Friday after 22:00
          setIsMarketOpen(false);
          // Calculate time until Monday
          const hoursToMonday = ((24 - hours) + (2 * 24) + 0) - 1;
          const minsToNext = 60 - minutes;
          setCountdown(`${hoursToMonday}h ${minsToNext}m until market opens`);
        } else {
          setIsMarketOpen(true);
          if (dayOfWeek === 5) { // Friday before 22:00
            const hoursLeft = 21 - hours;
            const minsLeft = 60 - minutes;
            setCountdown(`${hoursLeft}h ${minsLeft}m until market closes`);
          } else {
            setCountdown("Market is open");
          }
        }
      } else { // Weekend
        setIsMarketOpen(false);
        const daysToMonday = dayOfWeek === 0 ? 1 : 2;
        const hoursToMonday = ((24 - hours) + ((daysToMonday - 1) * 24) + 0);
        const minsToNext = 60 - minutes;
        setCountdown(`${hoursToMonday}h ${minsToNext}m until market opens`);
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={isMarketOpen ? "bg-green-50 dark:bg-green-900/10" : "bg-yellow-50 dark:bg-yellow-900/10"}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Market Status</CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isMarketOpen ? "Open" : "Closed"}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {countdown}
        </p>
      </CardContent>
    </Card>
  );
}