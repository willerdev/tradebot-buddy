import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export default function Monitoring() {
  const systemStatus = [
    {
      title: "Trading Engine",
      status: "Operational",
      icon: CheckCircle2,
      color: "text-green-500",
    },
    {
      title: "Market Data Feed",
      status: "Operational",
      icon: CheckCircle2,
      color: "text-green-500",
    },
    {
      title: "Order Processing",
      status: "Degraded Performance",
      icon: AlertTriangle,
      color: "text-yellow-500",
    },
    {
      title: "Bot Execution",
      status: "Operational",
      icon: CheckCircle2,
      color: "text-green-500",
    },
  ];

  const recentEvents = [
    {
      timestamp: "2024-03-20 14:30:00",
      event: "Bot #123 Trade Executed",
      type: "success",
    },
    {
      timestamp: "2024-03-20 14:28:00",
      event: "Market Data Latency Spike",
      type: "warning",
    },
    {
      timestamp: "2024-03-20 14:25:00",
      event: "New Strategy Deployed",
      type: "info",
    },
    {
      timestamp: "2024-03-20 14:20:00",
      event: "System Backup Completed",
      type: "success",
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-8 animate-fade-up">
      <div>
        <h1 className="text-3xl font-bold">System Monitoring</h1>
        <p className="text-muted-foreground">
          Monitor your trading system's health and performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {systemStatus.map((status) => {
          const Icon = status.icon;
          return (
            <Card key={status.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {status.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${status.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-lg font-semibold ${status.color}`}>
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
              {recentEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 text-sm border-b last:border-0 pb-2"
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{event.event}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.timestamp}
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
              <div className="flex justify-between items-center">
                <span className="text-sm">CPU Usage</span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Memory Usage</span>
                <span className="text-sm font-medium">2.4 GB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Network Latency</span>
                <span className="text-sm font-medium">124ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Connections</span>
                <span className="text-sm font-medium">47</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}