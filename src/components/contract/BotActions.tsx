import { Button } from "@/components/ui/button";
import { Play, Power, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BotActionsProps {
  botId: string;
  status: string;
  onStop: (botId: string) => void;
  onDelete: () => void;
}

export function BotActions({ botId, status, onStop, onDelete }: BotActionsProps) {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate(`/terminal/${botId}`);
  };

  return (
    <div className="flex items-center gap-2">
      {status === "running" ? (
        <Button
          variant="outline"
          size="icon"
          onClick={() => onStop(botId)}
        >
          <Power className="h-4 w-4 text-red-500" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon"
          onClick={handleStart}
        >
          <Play className="h-4 w-4 text-green-500" />
        </Button>
      )}
      <Button 
        variant="outline" 
        size="icon"
        onClick={onDelete}
      >
        <Trash className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
}