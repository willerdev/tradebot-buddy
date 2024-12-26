import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function CopytraderDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) throw error;

        if (!profile || profile.user_type !== 'copytrader') {
          toast({
            title: "Access Denied",
            description: "You don't have access to this page.",
            variant: "destructive",
          });
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Profile check error:", err);
        toast({
          title: "Error",
          description: "Failed to verify access. Please try again.",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };

    checkAuth();
  }, [navigate, toast]);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Copytrader Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome to your copytrader dashboard. This page is under construction.
      </p>
    </div>
  );
}