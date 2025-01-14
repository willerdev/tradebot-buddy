import { StatsDisplay } from "@/components/dashboard/StatsDisplay";
import { SystemInfoDisplay } from "@/components/dashboard/SystemInfoDisplay";
import { TransactionHistory } from "@/components/dashboard/TransactionHistory";
import { MarketCountdown } from "@/components/dashboard/MarketCountdown";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function Index() {
  const { data: userEmail } = useQuery({
    queryKey: ["user-email"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.email || "";
    },
  });

  const { data: systemFunds } = useQuery({
    queryKey: ["system-funds"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data } = await supabase
        .from("system_funds")
        .select("*")
        .eq("user_id", user.id)
        .single();

      return data;
    },
  });

  const { data: isAdmin } = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data } = await supabase
        .from("admins")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      return !!data;
    },
  });

  return (
    <div className="space-y-8 px-4 sm:px-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {userEmail && (
            <p className="text-muted-foreground">Welcome back, {userEmail}</p>
          )}
        </div>
      </div>

      {isAdmin && systemFunds && systemFunds.system_fund < 5500 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            System funds are under the minimum operating funds ($5,500) to make withdrawals. Please top up above $5,501.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <MarketCountdown />
      </div>

      <StatsDisplay tradingStats={undefined} systemFunds={systemFunds} />
      <SystemInfoDisplay />
      <TransactionHistory />
    </div>
  );
}