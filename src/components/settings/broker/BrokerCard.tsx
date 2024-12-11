import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Globe, Loader2, TestTube2 } from "lucide-react";
import { BrokerConnection } from "./types";

interface BrokerCardProps {
  connection: BrokerConnection;
  onTest: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isTestingConnection: string | null;
}

export function BrokerCard({ connection, onTest, onDelete, isTestingConnection }: BrokerCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{connection.broker_name}</CardTitle>
            <CardDescription>Added on {new Date(connection.created_at).toLocaleDateString()}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTest(connection.id)}
              disabled={isTestingConnection === connection.id}
            >
              {isTestingConnection === connection.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <TestTube2 className="h-4 w-4" />
              )}
              <span className="ml-2">Test Connection</span>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(connection.id)}
            >
              Remove
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <a 
              href={connection.website || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline"
            >
              {connection.website || 'No website provided'}
            </a>
          </div>
          <div>
            <span className="font-medium">API Key:</span> ••••••••
          </div>
          <div>
            <span className="font-medium">Status:</span>{" "}
            <span className={connection.is_active ? "text-green-500" : "text-red-500"}>
              {connection.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}