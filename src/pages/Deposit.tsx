import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function Deposit() {
  const { toast } = useToast();
  const walletAddress = "TAXqvawy2SnfbGRkVHjkjccnd1E7fPnqB7";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Address Copied",
      description: "Wallet address has been copied to clipboard",
    });
  };

  return (
    <div className="mx-auto py-6 space-y-8 animate-fade-up px-0 sm:px-6">
      <div className="px-4 sm:px-0">
        <h1 className="text-3xl font-bold">Deposit USDT</h1>
        <p className="text-muted-foreground">
          Deposit USDT to your trading account using TRC20 network
        </p>
      </div>

      <Card className="mx-4 sm:mx-0">
        <CardHeader>
          <CardTitle>Deposit Information</CardTitle>
          <CardDescription>Please read carefully before making a deposit</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium">Wallet Address (TRC20)</p>
                <p className="text-xs text-muted-foreground break-all">{walletAddress}</p>
              </div>
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Deposit Arrival</span>
                <span>20 confirmations</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Withdraw Unlocked</span>
                <span>20 confirmations</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Contract Address</span>
                <span>Ending with zgjLj6t</span>
              </div>
            </div>
          </div>

          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important Notice</AlertTitle>
            <AlertDescription className="mt-2 text-sm">
              In upholding the integrity and safety of our platform's trading environment, bybit is dedicated to combating financial crime and ensuring adherence to anti-money laundering measures.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription className="mt-2 text-sm">
              Please make sure that only USDT Deposit is made via this address. Otherwise, your deposit funds will not be added to your available balance - Nor will it be refunded. For successful deposit, please make sure the wallet address is accurate. Please note that the current asset does not support deposit via the smart contract. If used, your deposit funds will not be added to your available balance - nor will it be refunded.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}