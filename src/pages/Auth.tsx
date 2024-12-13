import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowUpRight, LineChart, Lock, Wallet } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const features = [
    {
      icon: LineChart,
      title: "Advanced Trading Algorithms",
      description: "Leverage sophisticated algorithms for optimal trading performance"
    },
    {
      icon: Lock,
      title: "Secure & Reliable",
      description: "Enterprise-grade security to protect your assets and data"
    },
    {
      icon: Wallet,
      title: "Multi-Exchange Support",
      description: "Connect and trade across multiple cryptocurrency exchanges"
    }
  ];

  const marketData = [
    { symbol: "BTC/USDT", price: "43,562.80", change: "+2.34%" },
    { symbol: "ETH/USDT", price: "2,284.15", change: "+1.56%" },
    { symbol: "SOL/USDT", price: "98.45", change: "-0.78%" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-8">
        <nav className="flex items-center justify-between mb-16">
          <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            MuraFx
          </div>
          <div className="flex items-center gap-4">
            <a href="#auth" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Login
            </a>
            <a 
              href="#auth" 
              className="text-sm px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Sign Up
            </a>
          </div>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 items-center pb-16">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Automated Trading
              <span className="block text-primary">Made Simple</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Experience the power of algorithmic trading with our advanced bot platform. 
              Start trading smarter, not harder.
            </p>
            <a 
              href="#auth" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Market Overview */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Market Overview</h3>
              <a href="#" className="text-sm text-primary inline-flex items-center gap-1 hover:underline">
                View All <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
            <div className="space-y-3">
              {marketData.map((item) => (
                <div key={item.symbol} className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                  <div className="font-medium">{item.symbol}</div>
                  <div className="text-right">
                    <div className="font-semibold">${item.price}</div>
                    <div className={item.change.startsWith("+") ? "text-trading-profit text-sm" : "text-trading-loss text-sm"}>
                      {item.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {features.map((feature) => (
            <div key={feature.title} className="glass-card p-6 space-y-4">
              <feature.icon className="w-12 h-12 text-primary" />
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Auth Section */}
      <div id="auth" className="container mx-auto px-4 pb-16">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="dark"
              providers={[]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}