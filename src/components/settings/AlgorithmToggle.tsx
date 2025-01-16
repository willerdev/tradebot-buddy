import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { create } from "zustand";

interface AlgorithmStore {
  isCompromised: boolean;
  setCompromised: (value: boolean) => void;
}

export const useAlgorithmStore = create<AlgorithmStore>((set) => ({
  isCompromised: false,
  setCompromised: (value) => set({ isCompromised: value }),
}));

export function AlgorithmToggle() {
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const [showProgress, setShowProgress] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const { isCompromised, setCompromised } = useAlgorithmStore();

  const steps = [
    "System fund evaluation...",
    "Model tuning in progress...",
    "Algorithm adjustment...",
    "Performance enhancement...",
  ];

  const handlePinSubmit = () => {
    if (pin === "555000") {
      setCompromised(!isCompromised);
      setShowPinModal(false);
      setPin("");
      toast({
        title: isCompromised ? "Algorithm Protected" : "Algorithm Compromised",
        description: isCompromised 
          ? "System has been secured"
          : "Warning: System algorithm has been compromised",
        variant: isCompromised ? "default" : "destructive",
      });
    } else {
      toast({
        title: "Invalid PIN",
        description: "Please enter the correct PIN",
        variant: "destructive",
      });
    }
  };

  const handleRecalibration = () => {
    setShowProgress(true);
    let step = 0;
    const interval = setInterval(() => {
      if (step < steps.length) {
        setCurrentStep(step);
        step++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setShowProgress(false);
          setCompromised(false);
          toast({
            title: "System Recalibrated",
            description: "Algorithm has been restored to normal operation",
          });
        }, 2000);
      }
    }, 5000); // Change step every 5 seconds
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 glass-card">
        <div>
          <h3 className="text-lg font-medium">Algorithm Security</h3>
          <p className="text-sm text-muted-foreground">
            Toggle algorithm protection status
          </p>
        </div>
        <Button
          variant={isCompromised ? "destructive" : "default"}
          onClick={() => setShowPinModal(true)}
        >
          {isCompromised ? "Algorithm Compromised" : "Algorithm Protected"}
        </Button>
      </div>

      <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Security PIN</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            <Button onClick={handlePinSubmit} className="w-full">
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showProgress} onOpenChange={setShowProgress}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>System Recalibration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ 
                  width: `${((currentStep + 1) / steps.length) * 100}%` 
                }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {steps[currentStep]}
            </p>
            <p className="text-xs text-muted-foreground">
              Estimated time remaining: 5 hours
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}