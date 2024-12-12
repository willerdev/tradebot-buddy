import { BrokerSettings } from "@/components/settings/BrokerSettings";

export default function Brokers() {
  return (
    <div className="container mx-auto py-6 space-y-8 animate-fade-up">
      <div>
        <h1 className="text-3xl font-bold">Brokers</h1>
        <p className="text-muted-foreground">
          Manage your broker API connections for automated trading.
        </p>
      </div>
      <BrokerSettings />
    </div>
  );
}