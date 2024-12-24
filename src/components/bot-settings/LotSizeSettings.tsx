import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LotSizeSettingsProps {
  lotSizeType: string;
  customLotSize: number;
  riskPercentage: number;
  onLotSizeTypeChange: (value: string) => void;
  onCustomLotSizeChange: (value: number) => void;
  onRiskPercentageChange: (value: number) => void;
}

export function LotSizeSettings({
  lotSizeType,
  customLotSize,
  riskPercentage,
  onLotSizeTypeChange,
  onCustomLotSizeChange,
  onRiskPercentageChange,
}: LotSizeSettingsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Calculator className="h-4 w-4" />
        Lot Size Configuration
      </h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Lot Size Type</Label>
          <Select value={lotSizeType} onValueChange={onLotSizeTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select lot size type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default Lot Sizes</SelectItem>
              <SelectItem value="custom">Custom Lot Size</SelectItem>
              <SelectItem value="dynamic">Dynamic Lot Size</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {lotSizeType === "custom" && (
          <div className="space-y-2">
            <Label>Custom Lot Size</Label>
            <Input
              type="number"
              value={customLotSize}
              onChange={(e) => onCustomLotSizeChange(parseFloat(e.target.value))}
              min={0.01}
              step={0.01}
            />
          </div>
        )}

        {lotSizeType === "dynamic" && (
          <>
            <div className="space-y-2">
              <Label>Risk Percentage</Label>
              <Input
                type="number"
                value={riskPercentage}
                onChange={(e) => onRiskPercentageChange(parseFloat(e.target.value))}
                min={0.1}
                max={100}
                step={0.1}
              />
            </div>
            <Alert>
              <AlertDescription className="space-y-2">
                <p>Dynamic Lot Size Formula:</p>
                <pre className="bg-secondary p-2 rounded-md text-sm">
                  Lot Size = (Account Balance × Risk %) / (Stop Loss × Pip Value)
                </pre>
                <p className="text-sm text-muted-foreground">
                  This formula automatically adjusts your lot size based on your account balance and risk parameters.
                </p>
              </AlertDescription>
            </Alert>
          </>
        )}
      </div>
    </div>
  );
}