import { cn } from "@/lib/utils";

interface BotStatusProps {
  status: string;
}

export function BotStatus({ status }: BotStatusProps) {
  return (
    <span
      className={cn(
        "text-sm font-medium",
        status === "running" ? "text-green-500" : "text-yellow-500"
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}