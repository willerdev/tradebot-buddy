import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

const TRADING_PAIRS = [
  "BTC/USDT", "ETH/USDT", "BNB/USDT", "XRP/USDT", "ADA/USDT",
  "DOGE/USDT", "SOL/USDT", "DOT/USDT", "MATIC/USDT", "LINK/USDT",
  "UNI/USDT", "ATOM/USDT", "LTC/USDT", "AVAX/USDT", "FTM/USDT",
  "NEAR/USDT", "ALGO/USDT", "FIL/USDT", "VET/USDT", "SAND/USDT"
];

const PROFIT_TARGETS = [
  { value: 0.5, days: 3 },
  { value: 1, days: 5 },
  { value: 5, days: 14 },
  { value: 10, days: 30 }
];

const DEFAULT_SETTINGS = {
  min_operating_fund: 5500,
  lot_sizes: [0.01, 0.05, 0.1, 0.5, 1.0],
  selected_pairs: [] as string[],
  profit_target: 0.5,
  fund_split_percentage: 50
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
        // Create default settings for new users
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

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <Label>Minimum Bot Operating Fund (USDT)</Label>
          <Slider
            value={[settings.min_operating_fund]}
            onValueChange={([value]) => setSettings(prev => ({ ...prev, min_operating_fund: value }))}
            min={5500}
            max={100000}
            step={100}
            className="w-full"
          />
          <span className="text-sm text-muted-foreground">
            Current value: {settings.min_operating_fund} USDT
          </span>
        </div>

        <div className="space-y-4">
          <Label>Lot Sizes</Label>
          <div className="flex flex-wrap gap-2">
            {settings.lot_sizes.map((size, index) => (
              <div key={index} className="bg-secondary p-2 rounded">
                {size}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label>Trading Pairs</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRADING_PAIRS.map((pair) => (
              <div key={pair} className="flex items-center space-x-2">
                <Checkbox
                  id={pair}
                  checked={settings.selected_pairs.includes(pair)}
                  onCheckedChange={() => handlePairToggle(pair)}
                />
                <label htmlFor={pair} className="text-sm cursor-pointer">
                  {pair}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label>Profit Target</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PROFIT_TARGETS.map((target) => (
              <div
                key={target.value}
                className={`p-4 rounded-lg cursor-pointer border ${
                  settings.profit_target === target.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border'
                }`}
                onClick={() => setSettings(prev => ({ ...prev, profit_target: target.value }))}
              >
                <div className="font-medium">{target.value}%</div>
                <div className="text-sm text-muted-foreground">~{target.days} days</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label>Fund Split Percentage (Bot vs Contract)</Label>
          <Slider
            value={[settings.fund_split_percentage]}
            onValueChange={([value]) => setSettings(prev => ({ ...prev, fund_split_percentage: value }))}
            min={0}
            max={100}
            step={5}
            className="w-full"
          />
          <div className="text-sm text-muted-foreground">
            Bot: {settings.fund_split_percentage}% | Contract: {100 - settings.fund_split_percentage}%
          </div>
        </div>

        <Button
          onClick={saveSettings}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </Card>
    </div>
  );
}