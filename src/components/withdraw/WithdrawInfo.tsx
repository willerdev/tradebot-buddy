import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export function WithdrawInfo() {
  return (
    <div className="space-y-4">
      <div className="grid gap-2 text-sm">
        <div className="flex justify-between py-2 border-b">
          <span className="text-muted-foreground">Withdraw Unlocked</span>
          <span>20 confirmations</span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span className="text-muted-foreground">Network</span>
          <span>TRC20</span>
        </div>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Important Notice</AlertTitle>
        <AlertDescription className="mt-2 text-sm">
          Please ensure you are withdrawing to a valid TRC20 wallet address. Withdrawals to incorrect addresses or different networks cannot be recovered. The minimum withdrawal amount is 1 USDT.
        </AlertDescription>
      </Alert>
    </div>
  );
}