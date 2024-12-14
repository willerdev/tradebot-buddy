import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContractBotList } from "@/components/contract/ContractBotList";
import { CreateContractBotDialog } from "@/components/contract/CreateContractBotDialog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Contract() {
  return (
    <div className="container mx-auto py-6 space-y-8 animate-fade-up">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contract Bots</h1>
          <p className="text-muted-foreground">
            Manage your arbitrage contract bots
          </p>
        </div>
        <CreateContractBotDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Bot
          </Button>
        </CreateContractBotDialog>
      </div>
      <ContractBotList />
    </div>
  );
}