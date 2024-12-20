import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function TransactionSettings() {
  const [withdrawalMode, setWithdrawalMode] = useState<string>("on_success");
  const { toast } = useToast();

  const handleModeChange = async (value: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      // Here you would typically save this preference to user settings
      // For now we'll just update the state and show a toast
      setWithdrawalMode(value);
      
      toast({
        title: "Settings Updated",
        description: "Your withdrawal settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Transaction Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure how withdrawals and deposits are handled
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Preferences</CardTitle>
          <CardDescription>Choose when your balance should be updated on withdrawals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={withdrawalMode}
            onValueChange={handleModeChange}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="immediate" id="immediate" />
              <Label htmlFor="immediate">Update balance immediately on withdrawal request</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="on_success" id="on_success" />
              <Label htmlFor="on_success">Update balance only after withdrawal success (Recommended)</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}