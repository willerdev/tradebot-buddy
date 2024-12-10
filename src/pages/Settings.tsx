import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { BrokerSettings } from "@/components/settings/BrokerSettings";
import { StrategySettings } from "@/components/settings/StrategySettings";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";

export default function Settings() {
  return (
    <div className="container mx-auto py-6 space-y-8 animate-fade-up">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and trading settings.</p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="brokers">Brokers</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>
        <TabsContent value="brokers">
          <BrokerSettings />
        </TabsContent>
        <TabsContent value="strategies">
          <StrategySettings />
        </TabsContent>
        <TabsContent value="appearance">
          <AppearanceSettings />
        </TabsContent>
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}