import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddCopytraderDialog } from "@/components/copytrader/AddCopytraderDialog";
import { CopytraderCard } from "@/components/copytrader/CopytraderCard";

export default function Copytraders() {
  const { data: copytraders, refetch } = useQuery({
    queryKey: ["copytraders"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("copytraders")
        .select("*")
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Copytraders</h1>
          <p className="text-muted-foreground">
            Follow and copy successful traders' strategies
          </p>
        </div>
        <AddCopytraderDialog onCopytraderAdded={refetch} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {copytraders?.map((trader) => (
          <CopytraderCard
            key={trader.id}
            trader={trader}
            onSettingsUpdated={refetch}
          />
        ))}
        {(!copytraders || copytraders.length === 0) && (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>No Copytraders</CardTitle>
              <CardDescription>
                You haven't added any copytraders yet. Click the "Add Copytrader" button to get started.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}