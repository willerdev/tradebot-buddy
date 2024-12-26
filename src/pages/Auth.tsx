import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AuthPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkExistingSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session check error:", error);
        return;
      }
      if (session) {
        console.log("Existing session found, checking user type");
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();

        if (profile?.user_type === 'admin') {
          console.log("Admin user, redirecting to dashboard");
          navigate("/dashboard");
        } else {
          console.log("Copytrader user, redirecting to copytrader dashboard");
          navigate("/copytrader/dashboard");
        }
      }
    };

    checkExistingSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);
      
      if (event === "SIGNED_IN" && session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();

        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });

        if (profile?.user_type === 'admin') {
          navigate("/dashboard");
        } else {
          navigate("/copytrader/dashboard");
        }
      }
    });

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Link to="/" className="absolute top-4 left-4 text-muted-foreground hover:text-primary flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
      
      <div className="text-2xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        MuraFx Trading Portal
      </div>

      <Alert className="mb-6 max-w-md">
        <AlertDescription>
          Welcome to MuraFx. Please sign in to access your dashboard.
        </AlertDescription>
      </Alert>
      
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              style: {
                button: {
                  backgroundColor: undefined,
                  color: undefined,
                }
              }
            }}
            theme="dark"
            providers={[]}
          />
        </CardContent>
      </Card>
    </div>
  );
}