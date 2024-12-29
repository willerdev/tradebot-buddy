import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function MarketCountdown() {
  const [countdown, setCountdown] = useState<string>("");
  const [isMarketOpen, setIsMarketOpen] = useState<boolean>(false);

  const { data: marketHours } = useQuery({
    queryKey: ["market-hours-settings"],
    queryFn: async () => {
      console.log("Fetching market hours settings...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // First try to get existing settings
      const { data: existingSettings, error: fetchError } = await supabase
        .from("market_hours_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching market hours:", fetchError);
        throw fetchError;
      }

      // If no settings exist, create default settings
      if (!existingSettings) {
        console.log("No market hours settings found, creating default settings");
        const defaultSettings = {
          user_id: user.id,
          market_open_day: 1,
          market_open_hour: 0,
          market_close_day: 5,
          market_close_hour: 22
        };

        const { data: newSettings, error: insertError } = await supabase
          .from("market_hours_settings")
          .insert([defaultSettings])
          .select()
          .maybeSingle();

        if (insertError) {
          console.error("Error creating market hours settings:", insertError);
          throw insertError;
        }

        if (!newSettings) {
          console.error("Failed to create market hours settings");
          throw new Error("Failed to create market hours settings");
        }

        return newSettings;
      }

      return existingSettings;
    }
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const dayOfWeek = now.getUTCDay(); // 0 = Sunday, 1 = Monday, 5 = Friday
      const hours = now.getUTCHours();
      const minutes = now.getUTCMinutes();

      if (!marketHours) return;

      const openDay = marketHours.market_open_day;
      const openHour = marketHours.market_open_hour;
      const closeDay = marketHours.market_close_day;
      const closeHour = marketHours.market_close_hour;

      // Market is open from configured open day/hour to close day/hour
      if (dayOfWeek >= openDay && dayOfWeek <= closeDay) {
        if (dayOfWeek === closeDay && hours >= closeHour) {
          setIsMarketOpen(false);
          // Calculate time until next open day
          const daysUntilOpen = ((7 + openDay - dayOfWeek) % 7);
          const hoursToOpen = ((24 - hours) + (daysUntilOpen * 24) + openHour);
          const minsToNext = 60 - minutes;
          setCountdown(`${hoursToOpen}h ${minsToNext}m until market opens`);
        } else if (dayOfWeek === openDay && hours < openHour) {
          setIsMarketOpen(false);
          const hoursToOpen = openHour - hours - 1;
          const minsToNext = 60 - minutes;
          setCountdown(`${hoursToOpen}h ${minsToNext}m until market opens`);
        } else {
          setIsMarketOpen(true);
          if (dayOfWeek === closeDay) {
            const hoursLeft = closeHour - hours - 1;
            const minsLeft = 60 - minutes;
            setCountdown(`${hoursLeft}h ${minsLeft}m until market closes`);
          } else {
            setCountdown("Market is open");
          }
        }
      } else {
        setIsMarketOpen(false);
        // Calculate time until next open day
        const daysUntilOpen = ((7 + openDay - dayOfWeek) % 7);
        const hoursToOpen = ((24 - hours) + ((daysUntilOpen - 1) * 24) + openHour);
        const minsToNext = 60 - minutes;
        setCountdown(`${hoursToOpen}h ${minsToNext}m until market opens`);
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [marketHours]);

  return (
    <Card className="bg-transparent">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white">Market Status</CardTitle>
        <Clock className="h-4 w-4 text-white/70" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">
          {isMarketOpen ? "Open" : "Closed"}
        </div>
        <p className="text-lg font-bold text-white mt-1">
          {countdown}
        </p>
      </CardContent>
    </Card>
  );
}