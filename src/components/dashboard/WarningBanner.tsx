import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useAlgorithmStore } from "@/components/settings/AlgorithmToggle";

export function WarningBanner() {
  const [showDialog, setShowDialog] = useState(false);
  const { isCompromised } = useAlgorithmStore();

  if (!isCompromised) return null;

  return (
    <>
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Critical Warning</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>
            The system algorithm has been compromised. User action required please
            consider Model Tuning or System optimization.
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDialog(true)}
          >
            Take Action
          </Button>
        </AlertDescription>
      </Alert>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>System Recalibration Required</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              System stopped. Now recalibrating...
            </p>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary animate-pulse"
                style={{ width: "60%" }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              ETA: 5 hours
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}