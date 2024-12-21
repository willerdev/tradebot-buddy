import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, User, Palette, Shield, TrendingUp, Wallet, Info } from "lucide-react";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { StrategySettings } from "@/components/settings/StrategySettings";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { TransactionSettings } from "@/components/settings/TransactionSettings";
import { SystemInfoSettings } from "@/components/settings/SystemInfoSettings";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Settings() {
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto py-6 space-y-8 animate-fade-up">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and trading settings.</p>
      </div>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Contract Bots Integration</AlertTitle>
        <AlertDescription>
          Contract bots are currently integrated but not fully functional due to missing API configurations.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {!isMobile && "Account"}
          </TabsTrigger>
          <TabsTrigger value="strategies" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {!isMobile && "Strategies"}
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            {!isMobile && "Transactions"}
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            {!isMobile && "Appearance"}
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {!isMobile && "Security"}
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            {!isMobile && "System Info"}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>
        <TabsContent value="strategies">
          <StrategySettings />
        </TabsContent>
        <TabsContent value="transactions">
          <TransactionSettings />
        </TabsContent>
        <TabsContent value="appearance">
          <AppearanceSettings />
        </TabsContent>
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
        <TabsContent value="system">
          <SystemInfoSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}