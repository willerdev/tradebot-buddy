import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock } from "lucide-react";

const TRADING_SESSIONS = {
  main: [
    { id: "sydney", label: "Sydney Session (22:00 - 07:00 GMT)", value: "sydney" },
    { id: "tokyo", label: "Tokyo Session (00:00 - 09:00 GMT)", value: "tokyo" },
    { id: "london", label: "London Session (08:00 - 17:00 GMT)", value: "london" },
    { id: "newyork", label: "New York Session (13:00 - 22:00 GMT)", value: "newyork" },
  ],
  overlaps: [
    { id: "sydney-tokyo", label: "Sydney-Tokyo (00:00 - 07:00 GMT)", value: "sydney-tokyo" },
    { id: "london-newyork", label: "London-New York (13:00 - 16:00 GMT)", value: "london-newyork" },
    { id: "tokyo-london", label: "Tokyo-London (08:00 - 09:00 GMT)", value: "tokyo-london" },
  ],
};

interface TradingSessionSettingsProps {
  selectedSessions: string[];
  onSessionChange: (sessions: string[]) => void;
}

export function TradingSessionSettings({
  selectedSessions,
  onSessionChange,
}: TradingSessionSettingsProps) {
  const handleSessionToggle = (session: string) => {
    const updated = selectedSessions.includes(session)
      ? selectedSessions.filter((s) => s !== session)
      : [...selectedSessions, session];
    onSessionChange(updated);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Trading Sessions
      </h3>
      <div className="space-y-6">
        <div className="space-y-4">
          <Label>Main Sessions</Label>
          <div className="grid gap-3">
            {TRADING_SESSIONS.main.map((session) => (
              <div key={session.id} className="flex items-center space-x-2">
                <Checkbox
                  id={session.id}
                  checked={selectedSessions.includes(session.value)}
                  onCheckedChange={() => handleSessionToggle(session.value)}
                />
                <label htmlFor={session.id} className="text-sm">
                  {session.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Label>Session Overlaps</Label>
          <div className="grid gap-3">
            {TRADING_SESSIONS.overlaps.map((session) => (
              <div key={session.id} className="flex items-center space-x-2">
                <Checkbox
                  id={session.id}
                  checked={selectedSessions.includes(session.value)}
                  onCheckedChange={() => handleSessionToggle(session.value)}
                />
                <label htmlFor={session.id} className="text-sm">
                  {session.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}