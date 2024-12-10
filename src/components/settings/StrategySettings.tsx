import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(2),
  strategy: z.string().min(10),
  configuration: z.string().min(2),
});

export function StrategySettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { data: tradingBots, refetch } = useQuery({
    queryKey: ["trading-bots"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trading_bots")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.from("trading_bots").insert([
        {
          name: values.name,
          strategy: values.strategy,
          configuration: JSON.parse(values.configuration),
        },
      ]);

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
        description: "Failed to add strategy. Please check your configuration JSON.",
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
          Manage your automated trading strategies and configurations.
        </p>
      </div>

      <div className="grid gap-4">
        {tradingBots?.map((bot) => (
          <Card key={bot.id}>
            <CardHeader>
              <CardTitle>{bot.name}</CardTitle>
              <CardDescription>Strategy: {bot.strategy}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Status:</span>{" "}
                  <span className={bot.status === "running" ? "text-trading-profit" : "text-trading-neutral"}>
                    {bot.status}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(bot.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Strategy</CardTitle>
          <CardDescription>Create a new trading strategy configuration.</CardDescription>
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
                    <FormLabel>Strategy Type</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., MACD Crossover, RSI Strategy" />
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
                    <FormLabel>Configuration (JSON)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder='{
  "timeframe": "1h",
  "symbols": ["BTC/USDT"],
  "parameters": {
    "rsi_period": 14,
    "rsi_overbought": 70,
    "rsi_oversold": 30
  }
}'
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the strategy configuration in JSON format
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                Add Strategy
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}