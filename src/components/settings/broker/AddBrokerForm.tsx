import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BrokerFormSchema, brokerFormSchema } from "./types";

interface AddBrokerFormProps {
  onSubmit: (values: BrokerFormSchema) => Promise<void>;
  isLoading: boolean;
}

export function AddBrokerForm({ onSubmit, isLoading }: AddBrokerFormProps) {
  const form = useForm<BrokerFormSchema>({
    resolver: zodResolver(brokerFormSchema),
    defaultValues: {
      broker_name: "",
      website: "",
      api_key: "",
      api_secret: "",
    },
  });

  return (
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
  );
}