import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function Deposit() {
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
    <div className="container mx-auto py-6 space-y-8 animate-fade-up">
      <div>
        <h1 className="text-3xl font-bold">Deposit USDT</h1>
        <p className="text-muted-foreground">
          Deposit USDT to your copytrading account using TRC20 network
        </p>
      </div>

      <Card>
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

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important Notice</AlertTitle>
              <AlertDescription className="mt-2 text-sm">
                Please make sure that only USDT Deposit is made via this address. Your deposit will be reflected in your account after network confirmation.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}