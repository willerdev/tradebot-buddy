import { z } from "zod";
import type { Json } from "@/integrations/supabase/types";

export const brokerFormSchema = z.object({
  broker_name: z.string().min(2, "Broker name must be at least 2 characters"),
  website: z.string().url("Please enter a valid website URL"),
  api_key: z.string().min(10, "API key must be at least 10 characters"),
  api_secret: z.string().min(10, "API secret must be at least 10 characters"),
});

export type BrokerFormSchema = z.infer<typeof brokerFormSchema>;

export interface BrokerConnection {
  id: string;
  user_id: string;
  broker_name: string;
  api_key: string;
  api_secret: string;
  is_active: boolean;
  created_at: string;
  last_connected_at: string | null;
  metadata: Json;
  website: string | null;
}