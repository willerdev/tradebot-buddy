import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const copytraderSchema = z.object({
  trader_name: z.string().min(2, "Trader name must be at least 2 characters"),
  description: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().min(10, "Phone number must be at least 10 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
});

type CopytraderFormValues = z.infer<typeof copytraderSchema>;

interface AddCopytraderDialogProps {
  onCopytraderAdded: () => void;
}

export function AddCopytraderDialog({ onCopytraderAdded }: AddCopytraderDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<CopytraderFormValues>({
    resolver: zodResolver(copytraderSchema),
    defaultValues: {
      trader_name: "",
      description: "",
      email: "",
      phone_number: "",
      country: "",
    },
  });

  const onSubmit = async (values: CopytraderFormValues) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { error } = await supabase.from("copytraders").insert({
        user_id: user.user.id,
        trader_name: values.trader_name,
        description: values.description,
        email: values.email,
        phone_number: values.phone_number,
        country: values.country,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Copytrader added successfully",
      });

      setIsOpen(false);
      form.reset();
      onCopytraderAdded();
    } catch (error) {
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="trader_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trader Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Add Copytrader
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}