import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const TRADING_PAIRS = [
  "BTC/USDT",
  "ETH/USDT",
  "BNB/USDT",
  "SOL/USDT",
  "XRP/USDT",
];

interface CreateContractBotDialogProps {
  children: React.ReactNode;
}

export function CreateContractBotDialog({ children }: CreateContractBotDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    trading_pair: "BTC/USDT",
    min_profit_percentage: 0.5,
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { error } = await supabase.from("contract_bots").insert({
        ...formData,
        user_id: user.user.id,
      });

      if (error) throw error;

      toast({
        title: "Bot Created",
        description: "New contract bot has been created successfully.",
      });

      setIsOpen(false);
      setFormData({
        name: "",
        trading_pair: "BTC/USDT",
        min_profit_percentage: 0.5,
      });
      queryClient.invalidateQueries({ queryKey: ["contract-bots"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create bot. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Contract Bot</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Bot Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter bot name"
            />
          </div>
          <div className="space-y-2">
            <Label>Trading Pair</Label>
            <Select
              value={formData.trading_pair}
              onValueChange={(value) => setFormData({ ...formData, trading_pair: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select trading pair" />
              </SelectTrigger>
              <SelectContent>
                {TRADING_PAIRS.map((pair) => (
                  <SelectItem key={pair} value={pair}>
                    {pair}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Minimum Profit Percentage</Label>
            <Input
              type="number"
              value={formData.min_profit_percentage}
              onChange={(e) => setFormData({ ...formData, min_profit_percentage: parseFloat(e.target.value) })}
              step="0.1"
            />
          </div>
          <Button className="w-full" onClick={handleSubmit}>
            Create Bot
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}