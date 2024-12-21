import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CopytraderSettings } from "./CopytraderSettings";

interface CopytraderCardProps {
  trader: {
    id: string;
    trader_name: string;
    description: string | null;
    email: string;
    phone_number: string;
    country: string;
    is_active: boolean | null;
    created_at: string;
  };
  onSettingsUpdated: () => void;
}

export function CopytraderCard({ trader, onSettingsUpdated }: CopytraderCardProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold">
            {trader.trader_name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="h-5 w-5" />
            </Button>
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="mt-2">
            {trader.description || "No description provided"}
          </CardDescription>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm">{trader.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Phone</span>
              <span className="text-sm">{trader.phone_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Country</span>
              <span className="text-sm">{trader.country}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className={`text-sm ${trader.is_active ? "text-green-500" : "text-red-500"}`}>
                {trader.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Added on</span>
              <span className="text-sm">
                {new Date(trader.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <CopytraderSettings
        traderId={trader.id}
        open={showSettings}
        onOpenChange={setShowSettings}
        onSettingsUpdated={onSettingsUpdated}
      />
    </>
  );
}