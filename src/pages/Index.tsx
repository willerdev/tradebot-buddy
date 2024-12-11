import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, DollarSign, TrendingUp, Users } from "lucide-react";

export default function Index() {
  const stats = [
    {
      title: "Total Trading Volume",
      value: "$1.2M",
      description: "Last 30 days",
      icon: DollarSign,
    },
    {
      title: "Active Bots",
      value: "12",
      description: "Currently running",
      icon: Activity,
    },
    {
      title: "Connected Brokers",
      value: "3",
      description: "API integrations",
      icon: Users,
    },
    {
      title: "Performance",
      value: "+15.4%",
      description: "Monthly return",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-8 animate-fade-up">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your trading dashboard. Monitor your performance and manage your trading bots.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
            <CardDescription>Your last 5 trading activities</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No recent trades</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Strategies</CardTitle>
            <CardDescription>Currently running trading strategies</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No active strategies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Balance</CardTitle>
            <CardDescription>Your current trading balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$10,000.00</div>
            <p className="text-xs text-muted-foreground mt-1">Demo Account</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}