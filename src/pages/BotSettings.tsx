import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NotificationSettings } from "@/components/bot-settings/NotificationSettings";
import { ServerSettings } from "@/components/bot-settings/ServerSettings";
import { TradingSessionSettings } from "@/components/bot-settings/TradingSessionSettings";
import { LotSizeSettings } from "@/components/bot-settings/LotSizeSettings";

const DEFAULT_SETTINGS = {
  min_operating_fund: 5500,
  lot_sizes: [0.01, 0.05, 0.1, 0.5, 1.0],
  selected_pairs: [] as string[],
  profit_target: 0.5,
  fund_split_percentage: 50,
  notification_email: "",
  notification_phone: "",
  whatsapp_number: "",
  server_type: "online",
  server_url: "",
  trading_sessions: [] as string[],
  lot_size_type: "default",
  custom_lot_size: 0.01,
  risk_percentage: 1,
};

export default function BotSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      console.log("Loading settings...");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("No session found");
        return;
      }

      const { data, error } = await supabase
        .from('bot_settings')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading settings:', error);
        throw error;
      }

      if (data) {
        console.log("Settings loaded:", data);
        setSettings(data);
      } else {
        console.log("No settings found, creating default settings");
        const { error: insertError } = await supabase
          .from('bot_settings')
          .insert({
            user_id: session.user.id,
            ...DEFAULT_SETTINGS
          });

        if (insertError) {
          console.error('Error creating default settings:', insertError);
          throw insertError;
        }

        setSettings(DEFAULT_SETTINGS);
      }
    } catch (error) {
      console.error('Error in loadSettings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      console.log("Saving settings...");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No session');
      }

      const { error } = await supabase
        .from('bot_settings')
        .upsert({
          user_id: session.user.id,
          ...settings
        });

      if (error) throw error;

      console.log("Settings saved successfully");
      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePairToggle = (pair: string) => {
    setSettings(prev => ({
      ...prev,
      selected_pairs: prev.selected_pairs.includes(pair)
        ? prev.selected_pairs.filter(p => p !== pair)
        : [...prev.selected_pairs, pair]
    }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Bot Settings</h1>

      <div className="grid gap-6">
        <Card className="p-6">
          <NotificationSettings
            email={settings.notification_email}
            phone={settings.notification_phone}
            whatsapp={settings.whatsapp_number}
            onEmailChange={(value) => setSettings(prev => ({ ...prev, notification_email: value }))}
            onPhoneChange={(value) => setSettings(prev => ({ ...prev, notification_phone: value }))}
            onWhatsappChange={(value) => setSettings(prev => ({ ...prev, whatsapp_number: value }))}
          />
        </Card>

        <Card className="p-6">
          <ServerSettings
            serverType={settings.server_type}
            serverUrl={settings.server_url}
            onServerTypeChange={(value) => setSettings(prev => ({ ...prev, server_type: value }))}
            onServerUrlChange={(value) => setSettings(prev => ({ ...prev, server_url: value }))}
          />
        </Card>

        <Card className="p-6">
          <TradingSessionSettings
            selectedSessions={settings.trading_sessions}
            onSessionChange={(sessions) => setSettings(prev => ({ ...prev, trading_sessions: sessions }))}
          />
        </Card>

        <Card className="p-6">
          <LotSizeSettings
            lotSizeType={settings.lot_size_type}
            customLotSize={settings.custom_lot_size}
            riskPercentage={settings.risk_percentage}
            onLotSizeTypeChange={(value) => setSettings(prev => ({ ...prev, lot_size_type: value }))}
            onCustomLotSizeChange={(value) => setSettings(prev => ({ ...prev, custom_lot_size: value }))}
            onRiskPercentageChange={(value) => setSettings(prev => ({ ...prev, risk_percentage: value }))}
          />
        </Card>

        <Button
          onClick={saveSettings}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
