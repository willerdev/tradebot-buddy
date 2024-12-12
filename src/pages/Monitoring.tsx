import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { SystemEvent, SystemMonitoring } from "@/types/database";
import { format } from "date-fns";

export default function Monitoring() {
  const { data: monitoring } = useQuery({
    queryKey: ["system-monitoring"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_monitoring")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as SystemMonitoring[];
    },
  });

  const { data: events } = useQuery({
    queryKey: ["system-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_events")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as SystemEvent[];
    },
  });

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
                {Object.entries(item.metrics as Record<string, number>).map(
                  ([key, value]) => (
                    <div key={key} className="flex justify-between mt-1">
                      <span>{key}:</span>
                      <span>{value}</span>
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
          <Alert key={event.id}>
            <AlertDescription>
              {event.event_description}
              <div className="text-xs text-muted-foreground mt-1">
                {format(new Date(event.created_at), "PPpp")}
              </div>
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
}