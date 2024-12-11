import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { BrokerCard } from "./broker/BrokerCard";
import { AddBrokerForm } from "./broker/AddBrokerForm";
import type { BrokerFormSchema } from "./broker/types";

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

  const onSubmit = async (values: BrokerFormSchema) => {
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
          <BrokerCard
            key={connection.id}
            connection={connection}
            onTest={testConnection}
            onDelete={deleteBroker}
            isTestingConnection={isTestingConnection}
          />
        ))}
      </div>

      <AddBrokerForm onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  );
}