import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CopytraderForm } from "./CopytraderForm";

interface AddCopytraderDialogProps {
  onCopytraderAdded: () => void;
}

export function AddCopytraderDialog({ onCopytraderAdded }: AddCopytraderDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (values: any) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: values.email,
        password: values.password,
        email_confirm: true
      });

      if (authError) throw authError;

      // Then create the copytrader
      const { data: copytrader, error: copytraderError } = await supabase
        .from("copytraders")
        .insert({
          user_id: authData.user.id,
          trader_name: values.trader_name,
          description: values.description,
          email: values.email,
          phone_number: values.phone_number,
          country: values.country,
        })
        .select()
        .single();

      if (copytraderError) throw copytraderError;

      // Finally create the copytrader settings
      const { error: settingsError } = await supabase
        .from("copytrader_settings")
        .insert({
          copytrader_id: copytrader.id,
          trading_budget: values.trading_budget,
          profit_percentage: 0,
        });

      if (settingsError) throw settingsError;

      toast({
        title: "Success",
        description: "Copytrader added successfully",
      });

      setIsOpen(false);
      onCopytraderAdded();
    } catch (error) {
      console.error("Error adding copytrader:", error);
      toast({
        title: "Error",
        description: "Failed to add copytrader",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Users className="mr-2 h-4 w-4" />
          Add Copytrader
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Copytrader</DialogTitle>
          <DialogDescription>
            Enter the details of the trader you want to follow
          </DialogDescription>
        </DialogHeader>
        <CopytraderForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}