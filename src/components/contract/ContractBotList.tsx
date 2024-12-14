import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContractBotCard } from "./ContractBotCard";
import { useToast } from "@/components/ui/use-toast";

export function ContractBotList() {
  const { toast } = useToast();
  
  const { data: bots, isLoading } = useQuery({
    queryKey: ["contract-bots"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("contract_bots")
        .select("*")
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch bots. Please try again.",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {bots?.map((bot) => (
        <ContractBotCard key={bot.id} bot={bot} />
      ))}
    </div>
  );
}