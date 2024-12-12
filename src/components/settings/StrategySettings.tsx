import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader, Plus } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function StrategySettings() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { data: strategies, refetch } = useQuery({
    queryKey: ["trading-strategies"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("trading_strategies")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleAddStrategy = async () => {
    setIsLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { error } = await supabase.from("trading_strategies").insert({
        user_id: user.user.id,
        name: `New Strategy ${(strategies?.length || 0) + 1}`,
        description: "A new trading strategy",
        type: "Technical",
      });

      if (error) throw error;

      toast({
        title: "Strategy Added",
        description: "New trading strategy has been created successfully.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add strategy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Trading Strategies</h3>
        <p className="text-sm text-muted-foreground">
          Configure and manage your automated trading strategies.
        </p>
      </div>

      <div className="grid gap-4">
        {strategies?.map((strategy) => (
          <Card key={strategy.id}>
            <CardHeader>
              <CardTitle>{strategy.name}</CardTitle>
              <CardDescription>{strategy.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Type: {strategy.type}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Configure</Button>
                <Button variant="outline" size="sm">Backtest</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={handleAddStrategy} disabled={isLoading}>
        {isLoading ? (
          <Loader className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Plus className="mr-2 h-4 w-4" />
        )}
        Add Strategy
      </Button>
    </div>
  );
}