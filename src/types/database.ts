import { Json } from "@/integrations/supabase/types";

export interface SystemMonitoring {
  id: string;
  user_id: string | null;
  component_name: string;
  status: string;
  created_at: string;
  metrics: Json;
}

export interface SystemEvent {
  id: string;
  user_id: string | null;
  event_type: string;
  event_description: string;
  created_at: string;
}

export interface TradingStrategy {
  id: string;
  user_id: string | null;
  name: string;
  description: string | null;
  type: string;
  configuration: Json | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface EstimationParameters {
  id: string;
  base_amount: number;
  target_amount: number;
  days_period: number;
  created_at: string;
  updated_at: string;
}