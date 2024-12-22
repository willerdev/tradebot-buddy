import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { SystemEvent, SystemMonitoring } from "@/types/database";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export default function Monitoring() {
  const [animatedMetrics, setAnimatedMetrics] = useState<Record<string, Record<string, number>>>({});

  const { data: monitoring } = useQuery<SystemMonitoring[]>({
    queryKey: ["system-monitoring"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("system_monitoring")
        .select("*")
        .eq('user_id', user.user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: events } = useQuery<SystemEvent[]>({
    queryKey: ["system-events"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("system_events")
        .select("*")
        .eq('user_id', user.user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Function to generate random percentage change
  const generateRandomChange = (currentValue: number) => {
    const changePercentage = (Math.random() * 10) - 5; // Random change between -5% and +5%
    const change = currentValue * (changePercentage / 100);
    return Math.max(0, currentValue + change); // Ensure value doesn't go below 0
  };

  // Initialize and update animated metrics
  useEffect(() => {
    if (!monitoring) return;

    // Initialize animated metrics if not already set
    const initialMetrics: Record<string, Record<string, number>> = {};
    monitoring.forEach(item => {
      if (item.metrics && typeof item.metrics === 'object') {
        initialMetrics[item.id] = Object.entries(item.metrics).reduce((acc, [key, value]) => ({
          ...acc,
          [key]: typeof value === 'number' ? value : 0
        }), {});
      }
    });
    if (Object.keys(animatedMetrics).length === 0) {
      setAnimatedMetrics(initialMetrics);
    }

    // Set up interval for random changes
    const interval = setInterval(() => {
      setAnimatedMetrics(prev => {
        const newMetrics = { ...prev };
        Object.keys(newMetrics).forEach(itemId => {
          Object.keys(newMetrics[itemId]).forEach(metricKey => {
            newMetrics[itemId][metricKey] = generateRandomChange(newMetrics[itemId][metricKey]);
          });
        });
        return newMetrics;
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [monitoring]);

  return (
    <div className="container mx-auto py-6 space-y-8 animate-fade-up">
      <div>
        <h1 className="text-3xl font-bold">System Monitoring</h1>
        <p className="text-muted-foreground">Monitor your system's performance and events.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {monitoring?.map((item) => (
          <Card key={item.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.component_name}
              </CardTitle>
              <div
                className={`h-2 w-2 rounded-full ${
                  item.status === "healthy"
                    ? "bg-green-500"
                    : item.status === "warning"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {item.metrics && typeof item.metrics === 'object' && Object.entries(item.metrics as Record<string, number>).map(
                  ([key, value]) => (
                    <div key={key} className="flex justify-between mt-1">
                      <span>{key}:</span>
                      <span className="transition-all duration-1000 ease-in-out">
                        {animatedMetrics[item.id]?.[key]?.toFixed(2) || value}
                      </span>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Recent Events</h2>
        {events?.map((event) => (
          <div key={event.id} className="bg-gray-100 p-4 rounded-lg">
            <p>{event.event_description}</p>
            <div className="text-xs text-muted-foreground mt-1">
              {format(new Date(event.created_at), "PPpp")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}