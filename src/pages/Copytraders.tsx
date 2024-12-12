import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, User, Users } from "lucide-react";

const copytraderSchema = z.object({
  trader_name: z.string().min(2, "Trader name must be at least 2 characters"),
  description: z.string().optional(),
});

type CopytraderFormValues = z.infer<typeof copytraderSchema>;

export default function Copytraders() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<CopytraderFormValues>({
    resolver: zodResolver(copytraderSchema),
    defaultValues: {
      trader_name: "",
      description: "",
    },
  });

  const { data: copytraders, refetch } = useQuery({
    queryKey: ["copytraders"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("copytraders")
        .select("*")
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
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
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Copytrader added successfully",
      });

      setIsOpen(false);
      form.reset();
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add copytrader",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Copytraders</h1>
          <p className="text-muted-foreground">
            Follow and copy successful traders' strategies
          </p>
        </div>
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
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {copytraders?.map((trader) => (
          <Card key={trader.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                {trader.trader_name}
              </CardTitle>
              <User className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription className="mt-2">
                {trader.description || "No description provided"}
              </CardDescription>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className={`text-sm ${trader.is_active ? "text-green-500" : "text-red-500"}`}>
                    {trader.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Added on</span>
                  <span className="text-sm">
                    {new Date(trader.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!copytraders || copytraders.length === 0) && (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>No Copytraders</CardTitle>
              <CardDescription>
                You haven't added any copytraders yet. Click the "Add Copytrader" button to get started.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}