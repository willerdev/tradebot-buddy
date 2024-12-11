import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(2, "Strategy name must be at least 2 characters"),
  strategy: z.string().min(2, "Strategy must be specified"),
  configuration: z.string().optional(),
});

export function StrategySettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { data: strategies, refetch } = useQuery({
    queryKey: ["trading-strategies"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("trading_bots")
        .select("*")
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      strategy: "",
      configuration: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { error } = await supabase.from("trading_bots").insert({
        name: values.name,
        strategy: values.strategy,
        configuration: values.configuration,
        user_id: user.user.id
      });

      if (error) throw error;

      toast({
        title: "Strategy Added",
        description: "Your trading strategy has been added successfully.",
      });
      form.reset();
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
          Manage your trading strategies for automated trading.
        </p>
      </div>

      <div className="grid gap-4">
        {strategies?.map((strategy) => (
          <Card key={strategy.id}>
            <CardHeader>
              <CardTitle>{strategy.name}</CardTitle>
              <CardDescription>{strategy.strategy}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Configuration: {strategy.configuration || 'No configuration provided'}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Strategy</CardTitle>
          <CardDescription>Connect a new trading strategy to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Strategy Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="strategy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Strategy</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="configuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Configuration</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Strategy
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
