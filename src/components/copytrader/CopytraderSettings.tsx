import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const settingsSchema = z.object({
  profit_percentage: z.coerce.number(),
  trading_budget: z.coerce.number(),
  withdraw_wallet: z.string().min(1, "Withdraw wallet is required"),
  notification_method: z.enum(["email", "sms", "whatsapp"]),
  subscription_end_date: z.string(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface CopytraderSettingsProps {
  traderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSettingsUpdated: () => void;
}

export function CopytraderSettings({
  traderId,
  open,
  onOpenChange,
  onSettingsUpdated,
}: CopytraderSettingsProps) {
  const { toast } = useToast();
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      profit_percentage: 0,
      trading_budget: 0,
      withdraw_wallet: "",
      notification_method: "email",
      subscription_end_date: new Date().toISOString().split("T")[0],
    },
  });

  const { data: settings } = useQuery({
    queryKey: ["copytrader-settings", traderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("copytrader_settings")
        .select("*")
        .eq("copytrader_id", traderId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        profit_percentage: settings.profit_percentage,
        trading_budget: settings.trading_budget,
        withdraw_wallet: settings.withdraw_wallet || "",
        notification_method: settings.notification_method || "email",
        subscription_end_date: new Date(settings.subscription_end_date || new Date())
          .toISOString()
          .split("T")[0],
      });
    }
  }, [settings, form]);

  const onSubmit = async (values: SettingsFormValues) => {
    try {
      const { error } = await supabase
        .from("copytrader_settings")
        .upsert({
          copytrader_id: traderId,
          profit_percentage: values.profit_percentage,
          trading_budget: values.trading_budget,
          withdraw_wallet: values.withdraw_wallet,
          notification_method: values.notification_method,
          subscription_end_date: new Date(values.subscription_end_date).toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Copytrader settings updated successfully",
      });

      onOpenChange(false);
      onSettingsUpdated();
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Error",
        description: "Failed to update copytrader settings",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Copytrader Settings</DialogTitle>
          <DialogDescription>
            Configure profit sharing, budget, and notification preferences
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="profit_percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profit Percentage</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trading_budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trading Budget</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="withdraw_wallet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Withdraw Wallet Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notification_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notification Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select notification method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subscription_end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subscription End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">Save Settings</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}