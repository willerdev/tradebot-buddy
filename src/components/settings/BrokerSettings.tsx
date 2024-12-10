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
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  broker_name: z.string().min(2),
  api_key: z.string().min(10),
  api_secret: z.string().min(10),
});

export function BrokerSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { data: brokerConnections, refetch } = useQuery({
    queryKey: ["broker-connections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("broker_connections")
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
      const { error } = await supabase.from("broker_connections").insert([
        {
          broker_name: values.broker_name,
          api_key: values.api_key,
          api_secret: values.api_secret,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Broker Added",
        description: "Your broker connection has been added successfully.",
      });
      form.reset();
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add broker. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Broker Connections</h3>
        <p className="text-sm text-muted-foreground">
          Manage your broker API connections for automated trading.
        </p>
      </div>

      <div className="grid gap-4">
        {brokerConnections?.map((connection) => (
          <Card key={connection.id}>
            <CardHeader>
              <CardTitle>{connection.broker_name}</CardTitle>
              <CardDescription>Added on {new Date(connection.created_at).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">API Key:</span> ••••••••
                </div>
                <div>
                  <span className="font-medium">Status:</span>{" "}
                  <span className={connection.is_active ? "text-trading-profit" : "text-trading-loss"}>
                    {connection.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Broker</CardTitle>
          <CardDescription>Connect a new trading broker to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="broker_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Broker Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="api_key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="api_secret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Secret</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                Add Broker
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}