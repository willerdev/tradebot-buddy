import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Calculator, Wallet } from "lucide-react";

const TRADING_PAIRS = [
  "BTC/USDT", "ETH/USDT", "BNB/USDT", "SOL/USDT", "XRP/USDT",
  "ADA/USDT", "DOGE/USDT", "MATIC/USDT", "DOT/USDT", "SHIB/USDT",
  "AVAX/USDT", "TRX/USDT", "LTC/USDT", "UNI/USDT", "LINK/USDT",
  "ATOM/USDT", "XLM/USDT", "ALGO/USDT", "FIL/USDT", "VET/USDT"
];

const PROFIT_TARGETS = [
  { value: 0.5, days: 3 },
  { value: 1, days: 5 },
  { value: 5, days: 14 },
  { value: 10, days: 30 }
];

interface TradingParametersProps {
  operatingFund: number;
  withdrawWallet: string;
  network: string;
  selectedPairs: string[];
  profitTarget: number;
  fundSplitPercentage: number;
  onOperatingFundChange: (value: number) => void;
  onWithdrawWalletChange: (value: string) => void;
  onNetworkChange: (value: string) => void;
  onPairToggle: (pair: string) => void;
  onProfitTargetChange: (value: number) => void;
  onFundSplitChange: (value: number) => void;
}

export function TradingParameters({
  operatingFund,
  withdrawWallet,
  network,
  selectedPairs,
  profitTarget,
  fundSplitPercentage,
  onOperatingFundChange,
  onWithdrawWalletChange,
  onNetworkChange,
  onPairToggle,
  onProfitTargetChange,
  onFundSplitChange,
}: TradingParametersProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Calculator className="h-4 w-4" />
        Trading Parameters
      </h3>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Operating Fund (USDT)</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[operatingFund]}
              onValueChange={(values) => onOperatingFundChange(values[0])}
              min={5500}
              max={49000}
              step={100}
              className="flex-1"
            />
            <span className="min-w-[60px] text-right">{operatingFund}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Withdraw Wallet
          </Label>
          <Input
            value={withdrawWallet}
            onChange={(e) => onWithdrawWalletChange(e.target.value)}
            placeholder="Enter wallet address"
          />
        </div>

        <div className="space-y-2">
          <Label>Network</Label>
          <Select value={network} onValueChange={onNetworkChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select network" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TRC20">TRC20</SelectItem>
              <SelectItem value="ERC20">ERC20</SelectItem>
              <SelectItem value="BEP20">BEP20</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Trading Pairs</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {TRADING_PAIRS.map((pair) => (
              <div key={pair} className="flex items-center space-x-2">
                <Checkbox
                  id={pair}
                  checked={selectedPairs.includes(pair)}
                  onCheckedChange={() => onPairToggle(pair)}
                />
                <label htmlFor={pair} className="text-sm cursor-pointer">
                  {pair}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Profit Target</Label>
          <Select 
            value={profitTarget.toString()} 
            onValueChange={(value) => onProfitTargetChange(parseFloat(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select profit target" />
            </SelectTrigger>
            <SelectContent>
              {PROFIT_TARGETS.map((target) => (
                <SelectItem key={target.value} value={target.value.toString()}>
                  {target.value}% (≈{target.days} days)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Fund Split Percentage for Bot/Contract Operations</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[fundSplitPercentage]}
              onValueChange={(values) => onFundSplitChange(values[0])}
              min={0}
              max={100}
              step={5}
              className="flex-1"
            />
            <span className="min-w-[60px] text-right">{fundSplitPercentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}