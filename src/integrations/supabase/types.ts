export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      arbitrage_opportunities: {
        Row: {
          buy_broker_id: string
          buy_price: number
          contract_bot_id: string
          created_at: string
          executed_at: string | null
          id: string
          profit_percentage: number
          sell_broker_id: string
          sell_price: number
          status: string | null
          trading_pair: string
        }
        Insert: {
          buy_broker_id: string
          buy_price: number
          contract_bot_id: string
          created_at?: string
          executed_at?: string | null
          id?: string
          profit_percentage: number
          sell_broker_id: string
          sell_price: number
          status?: string | null
          trading_pair: string
        }
        Update: {
          buy_broker_id?: string
          buy_price?: number
          contract_bot_id?: string
          created_at?: string
          executed_at?: string | null
          id?: string
          profit_percentage?: number
          sell_broker_id?: string
          sell_price?: number
          status?: string | null
          trading_pair?: string
        }
        Relationships: [
          {
            foreignKeyName: "arbitrage_opportunities_buy_broker_id_fkey"
            columns: ["buy_broker_id"]
            isOneToOne: false
            referencedRelation: "broker_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arbitrage_opportunities_contract_bot_id_fkey"
            columns: ["contract_bot_id"]
            isOneToOne: false
            referencedRelation: "contract_bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arbitrage_opportunities_sell_broker_id_fkey"
            columns: ["sell_broker_id"]
            isOneToOne: false
            referencedRelation: "broker_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_trades: {
        Row: {
          bot_id: string
          closed_at: string | null
          created_at: string
          entry_price: number
          exit_price: number | null
          id: string
          metadata: Json | null
          pnl: number | null
          quantity: number
          side: string
          status: string | null
          symbol: string
          user_id: string
        }
        Insert: {
          bot_id: string
          closed_at?: string | null
          created_at?: string
          entry_price: number
          exit_price?: number | null
          id?: string
          metadata?: Json | null
          pnl?: number | null
          quantity: number
          side: string
          status?: string | null
          symbol: string
          user_id: string
        }
        Update: {
          bot_id?: string
          closed_at?: string | null
          created_at?: string
          entry_price?: number
          exit_price?: number | null
          id?: string
          metadata?: Json | null
          pnl?: number | null
          quantity?: number
          side?: string
          status?: string | null
          symbol?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bot_trades_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "trading_bots"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_training_results: {
        Row: {
          bot_name: string
          created_at: string
          end_date: string
          id: string
          profit_loss: number | null
          stake_amount: number
          start_date: string
          total_trades: number
          trading_pair: string
          training_logs: Json | null
          user_id: string | null
          win_rate: number | null
        }
        Insert: {
          bot_name: string
          created_at?: string
          end_date: string
          id?: string
          profit_loss?: number | null
          stake_amount: number
          start_date: string
          total_trades?: number
          trading_pair: string
          training_logs?: Json | null
          user_id?: string | null
          win_rate?: number | null
        }
        Update: {
          bot_name?: string
          created_at?: string
          end_date?: string
          id?: string
          profit_loss?: number | null
          stake_amount?: number
          start_date?: string
          total_trades?: number
          trading_pair?: string
          training_logs?: Json | null
          user_id?: string | null
          win_rate?: number | null
        }
        Relationships: []
      }
      broker_connections: {
        Row: {
          api_key: string
          api_secret: string
          broker_name: string
          created_at: string
          id: string
          is_active: boolean | null
          last_connected_at: string | null
          metadata: Json | null
          user_id: string
          website: string | null
        }
        Insert: {
          api_key: string
          api_secret: string
          broker_name: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_connected_at?: string | null
          metadata?: Json | null
          user_id: string
          website?: string | null
        }
        Update: {
          api_key?: string
          api_secret?: string
          broker_name?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_connected_at?: string | null
          metadata?: Json | null
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          receiver_id: string | null
          sender_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          receiver_id?: string | null
          sender_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          receiver_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_bots: {
        Row: {
          created_at: string
          id: string
          last_check_at: string | null
          last_error: string | null
          min_profit_percentage: number | null
          name: string
          status: string | null
          trading_pair: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_check_at?: string | null
          last_error?: string | null
          min_profit_percentage?: number | null
          name: string
          status?: string | null
          trading_pair: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_check_at?: string | null
          last_error?: string | null
          min_profit_percentage?: number | null
          name?: string
          status?: string | null
          trading_pair?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      copytraders: {
        Row: {
          country: string
          created_at: string
          description: string | null
          email: string
          id: string
          is_active: boolean | null
          performance_metrics: Json | null
          phone_number: string
          trader_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          country: string
          created_at?: string
          description?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          performance_metrics?: Json | null
          phone_number: string
          trader_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          country?: string
          created_at?: string
          description?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          performance_metrics?: Json | null
          phone_number?: string
          trader_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      delivery_addresses: {
        Row: {
          address: string
          created_at: string
          id: string
          is_default: boolean | null
          phone: string
          user_id: string | null
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          phone: string
          user_id?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          phone?: string
          user_id?: string | null
        }
        Relationships: []
      }
      deposits: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          status: string | null
          user_id: string | null
          wallet_address: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency: string
          id?: string
          status?: string | null
          user_id?: string | null
          wallet_address?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          status?: string | null
          user_id?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          date: string
          description: string | null
          id: string
          image_url: string | null
          location: string
          max_users: string | null
          price: number
          title: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          id?: string
          image_url?: string | null
          location: string
          max_users?: string | null
          price: number
          title: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string
          max_users?: string | null
          price?: number
          title?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_plans: {
        Row: {
          created_at: string | null
          delivery_time: string
          frequency: string
          id: string
          meal_id: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_time: string
          frequency: string
          id?: string
          meal_id?: string | null
          status: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_time?: string
          frequency?: string
          id?: string
          meal_id?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meal_plans_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          link: string | null
          message: string
          metadata: Json | null
          read: boolean | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          link?: string | null
          message: string
          metadata?: Json | null
          read?: boolean | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string
          metadata?: Json | null
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string | null
          price: number
          product_id: string | null
          quantity: number
        }
        Insert: {
          id?: string
          order_id?: string | null
          price: number
          product_id?: string | null
          quantity: number
        }
        Update: {
          id?: string
          order_id?: string | null
          price?: number
          product_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          payment_method: string | null
          payment_proof_url: string | null
          payment_status: string | null
          status: string | null
          total: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          payment_method?: string | null
          payment_proof_url?: string | null
          payment_status?: string | null
          status?: string | null
          total: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          payment_method?: string | null
          payment_proof_url?: string | null
          payment_status?: string | null
          status?: string | null
          total?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_invitations: {
        Row: {
          created_at: string | null
          event_id: string | null
          from_user_id: string | null
          id: string
          status: string | null
          ticket_id: string | null
          to_user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          from_user_id?: string | null
          id?: string
          status?: string | null
          ticket_id?: string | null
          to_user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          from_user_id?: string | null
          id?: string
          status?: string | null
          ticket_id?: string | null
          to_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_invitations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_invitations_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_invitations_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_invitations_to_user_id_fkey"
            columns: ["to_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          discount_percentage: number | null
          id: string
          images: string[] | null
          is_promoted: boolean | null
          name: string
          price: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          discount_percentage?: number | null
          id?: string
          images?: string[] | null
          is_promoted?: boolean | null
          name: string
          price: number
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          discount_percentage?: number | null
          id?: string
          images?: string[] | null
          is_promoted?: boolean | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          is_admin: boolean | null
          phone: string | null
          username: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          phone?: string | null
          username?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          phone?: string | null
          username?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          plan_type: string
          start_date: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          plan_type: string
          start_date?: string | null
          status: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          plan_type?: string
          start_date?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string | null
          email: string
          id: string
          issue: string
          name: string
          phone: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          issue: string
          name: string
          phone?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          issue?: string
          name?: string
          phone?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      system_events: {
        Row: {
          created_at: string | null
          event_description: string
          event_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_description: string
          event_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_description?: string
          event_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      system_monitoring: {
        Row: {
          component_name: string
          created_at: string | null
          id: string
          metrics: Json | null
          status: string
          user_id: string | null
        }
        Insert: {
          component_name: string
          created_at?: string | null
          id?: string
          metrics?: Json | null
          status: string
          user_id?: string | null
        }
        Update: {
          component_name?: string
          created_at?: string | null
          id?: string
          metrics?: Json | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ticket_transfers: {
        Row: {
          created_at: string
          from_user_id: string | null
          id: string
          status: string
          ticket_id: string | null
          to_user_id: string | null
        }
        Insert: {
          created_at?: string
          from_user_id?: string | null
          id?: string
          status?: string
          ticket_id?: string | null
          to_user_id?: string | null
        }
        Update: {
          created_at?: string
          from_user_id?: string | null
          id?: string
          status?: string
          ticket_id?: string | null
          to_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_transfers_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          created_at: string
          event_id: string | null
          id: string
          phone_number: string | null
          qr_code: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          phone_number?: string | null
          qr_code?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string | null
          id?: string
          phone_number?: string | null
          qr_code?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_accounts: {
        Row: {
          account_type: string
          balance: number
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          account_type: string
          balance: number
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          account_type?: string
          balance?: number
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      trading_bots: {
        Row: {
          broker_connection_id: string | null
          configuration: Json | null
          created_at: string
          id: string
          last_error: string | null
          lot_size: number
          name: string
          performance_metrics: Json | null
          status: string | null
          stop_loss: number
          strategy: string
          take_profit: number
          timeframe: string
          trade_amount: number
          trading_pair: string
          updated_at: string
          user_id: string
        }
        Insert: {
          broker_connection_id?: string | null
          configuration?: Json | null
          created_at?: string
          id?: string
          last_error?: string | null
          lot_size: number
          name: string
          performance_metrics?: Json | null
          status?: string | null
          stop_loss: number
          strategy: string
          take_profit: number
          timeframe: string
          trade_amount: number
          trading_pair: string
          updated_at?: string
          user_id: string
        }
        Update: {
          broker_connection_id?: string | null
          configuration?: Json | null
          created_at?: string
          id?: string
          last_error?: string | null
          lot_size?: number
          name?: string
          performance_metrics?: Json | null
          status?: string | null
          stop_loss?: number
          strategy?: string
          take_profit?: number
          timeframe?: string
          trade_amount?: number
          trading_pair?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trading_bots_broker_connection_id_fkey"
            columns: ["broker_connection_id"]
            isOneToOne: false
            referencedRelation: "broker_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_orders: {
        Row: {
          amount: string
          created_at: string
          id: string
          price: string
          status: string
          trading_mode: string
          type: string
          user_id: string | null
        }
        Insert: {
          amount: string
          created_at?: string
          id?: string
          price: string
          status?: string
          trading_mode: string
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: string
          created_at?: string
          id?: string
          price?: string
          status?: string
          trading_mode?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      trading_parameters: {
        Row: {
          amount: number
          created_at: string
          id: string
          leverage: number
          stop_loss: number
          take_profit: number
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          leverage: number
          stop_loss: number
          take_profit: number
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          leverage?: number
          stop_loss?: number
          take_profit?: number
          user_id?: string | null
        }
        Relationships: []
      }
      trading_strategies: {
        Row: {
          configuration: Json | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          configuration?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          configuration?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          status: string | null
          user_id: string | null
          wallet_address: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency: string
          id?: string
          status?: string | null
          user_id?: string | null
          wallet_address?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          status?: string | null
          user_id?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
