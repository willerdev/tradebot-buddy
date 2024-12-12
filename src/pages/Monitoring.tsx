import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Monitoring() {
  const { data: systemStatus } = useQuery({
    queryKey: ["system-monitoring"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_monitoring")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: recentEvents } = useQuery({
    queryKey: ["system-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4);
      
      if (error) throw error;
      return data;
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "operational":
        return { icon: CheckCircle2, color: "text-green-500" };
      case "degraded performance":
        return { icon: AlertTriangle, color: "text-yellow-500" };
      default:
        return { icon: Activity, color: "text-red-500" };
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-8 animate-fade-up">
      <div>
        <h1 className="text-3xl font-bold">System Monitoring</h1>
        <p className="text-muted-foreground">
          Monitor your trading system's health and performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {systemStatus?.map((status) => {
          const { icon: Icon, color } = getStatusIcon(status.status);
          return (
            <Card key={status.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {status.component_name}
                </CardTitle>
                <Icon className={`h-4 w-4 ${color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-lg font-semibold ${color}`}>
                  {status.status}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Events</CardTitle>
            <CardDescription>Recent system events and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents?.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-4 text-sm border-b last:border-0 pb-2"
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{event.event_description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>System performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemStatus?.[0]?.metrics && Object.entries(systemStatus[0].metrics).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                  <span className="text-sm font-medium">
                    {typeof value === 'number' ? value.toString() : value}
                    {key.includes('usage') ? '%' : ''}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}