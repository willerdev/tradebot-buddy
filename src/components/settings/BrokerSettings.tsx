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
import { Loader2, Globe, TestTube2 } from "lucide-react";

const formSchema = z.object({
  broker_name: z.string().min(2, "Broker name must be at least 2 characters"),
  website: z.string().url("Please enter a valid website URL"),
  api_key: z.string().min(10, "API key must be at least 10 characters"),
  api_secret: z.string().min(10, "API secret must be at least 10 characters"),
});

export function BrokerSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState<string | null>(null);

  const { data: brokerConnections, refetch } = useQuery({
    queryKey: ["broker-connections"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("broker_connections")
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
      broker_name: "",
      website: "",
      api_key: "",
      api_secret: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { error } = await supabase.from("broker_connections").insert({
        broker_name: values.broker_name,
        website: values.website,
        api_key: values.api_key,
        api_secret: values.api_secret,
        user_id: user.user.id,
      });

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

  const testConnection = async (brokerId: string) => {
    try {
      setIsTestingConnection(brokerId);
      // Here you would typically make an API call to test the connection
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
      
      toast({
        title: "Connection Test Successful",
        description: "Successfully connected to the broker API.",
      });
    } catch (error) {
      toast({
        title: "Connection Test Failed",
        description: "Failed to connect to the broker API. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(null);
    }
  };

  const deleteBroker = async (brokerId: string) => {
    try {
      const { error } = await supabase
        .from("broker_connections")
        .delete()
        .eq("id", brokerId);

      if (error) throw error;

      toast({
        title: "Broker Removed",
        description: "The broker connection has been removed successfully.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove broker. Please try again.",
        variant: "destructive",
      });
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{connection.broker_name}</CardTitle>
                  <CardDescription>Added on {new Date(connection.created_at).toLocaleDateString()}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testConnection(connection.id)}
                    disabled={isTestingConnection === connection.id}
                  >
                    {isTestingConnection === connection.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <TestTube2 className="h-4 w-4" />
                    )}
                    <span className="ml-2">Test Connection</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteBroker(connection.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={connection.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    {connection.website}
                  </a>
                </div>
                <div>
                  <span className="font-medium">API Key:</span> ••••••••
                </div>
                <div>
                  <span className="font-medium">Status:</span>{" "}
                  <span className={connection.is_active ? "text-green-500" : "text-red-500"}>
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
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" placeholder="https://" />
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
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Broker
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}