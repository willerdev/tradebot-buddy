import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Server, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ServerSettingsProps {
  serverType: string;
  serverUrl: string;
  onServerTypeChange: (value: string) => void;
  onServerUrlChange: (value: string) => void;
}

export function ServerSettings({
  serverType,
  serverUrl,
  onServerTypeChange,
  onServerUrlChange,
}: ServerSettingsProps) {
  const isValidServerUrl = serverUrl?.match(/^(localhost|(\d{1,3}\.){3}\d{1,3})$/);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Server Configuration</h3>
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            Server Type
          </Label>
          <Select value={serverType} onValueChange={onServerTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select server type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="local">Local Server</SelectItem>
              <SelectItem value="online">Online Server</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {serverType === "local" && (
          <div className="space-y-2">
            <Label>Server URL</Label>
            <Input
              value={serverUrl}
              onChange={(e) => onServerUrlChange(e.target.value)}
              placeholder="localhost or IP address"
            />
            {!isValidServerUrl && serverUrl && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Server URL must be 'localhost' or a valid IP address
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
        {serverType === "online" && !isValidServerUrl && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You are currently running on an online server with no backup server configured.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}