import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, Bot } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function CopytraderDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: dashboardData } = useQuery({
    queryKey: ["copytrader-dashboard"],
    queryFn: async () => {
      console.log("Fetching dashboard data...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // First try to get existing system funds
      const { data: existingFunds, error: fetchError } = await supabase
        .from('system_funds')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching system funds:", fetchError);
        throw fetchError;
      }

      // If no system funds exist, create a default record
      if (!existingFunds) {
        console.log("No system funds found, creating default record");
        const { data: newFunds, error: insertError } = await supabase
          .from('system_funds')
          .insert([
            { 
              user_id: user.id,
              system_fund: 0,
              contract_fund: 0,
              profit: 0,
              withdrawable_funds: 0
            }
          ])
          .select()
          .single();

        if (insertError) {
          console.error("Error creating system funds:", insertError);
          throw insertError;
        }

        return newFunds;
      }

      return existingFunds;
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) throw error;

        if (!profile || profile.user_type !== 'copytrader') {
          toast({
            title: "Access Denied",
            description: "You don't have access to this page.",
            variant: "destructive",
          });
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Profile check error:", err);
        toast({
          title: "Error",
          description: "Failed to verify access. Please try again.",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const stats = [
    {
      title: "Invested Amount",
      value: dashboardData ? `$${dashboardData.system_fund.toLocaleString()}` : "$0",
      icon: Wallet,
      description: "Total invested capital"
    },
    {
      title: "Total Profit",
      value: dashboardData ? `$${dashboardData.profit.toLocaleString()}` : "$0",
      icon: TrendingUp,
      description: "Accumulated profit"
    },
    {
      title: "Bot Status",
      value: "Active",
      icon: Bot,
      description: "Current trading status"
    }
  ];

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Copytrader Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your trading performance and bot status
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}