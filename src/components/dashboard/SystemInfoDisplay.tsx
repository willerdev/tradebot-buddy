import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function SystemInfoDisplay() {
  const { data: systemInfo } = useQuery({
    queryKey: ["system-info"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("system_info")
        .select("*")
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (!systemInfo?.length) return null;

  return (
    <div className="col-span-full lg:col-span-3 space-y-4">
      <h2 className="text-xl font-semibold">System Status</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {systemInfo.map((info) => (
          <Card key={info.id} className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {info.title}
              </CardTitle>
              {info.status === 'normal' ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{info.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}