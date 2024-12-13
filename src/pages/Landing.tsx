import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, ArrowUpRight, LineChart, Lock, Wallet, Mail } from "lucide-react";

export default function Landing() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const marketData = [
    { symbol: "BTC/USDT", price: "43,562.80", change: "+2.34%" },
    { symbol: "ETH/USDT", price: "2,284.15", change: "+1.56%" },
    { symbol: "SOL/USDT", price: "98.45", change: "-0.78%" },
  ];

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

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success!",
      description: "Thank you for subscribing to our newsletter!",
    });
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          MuraFx
        </div>
        <div className="flex items-center gap-4">
          <Link to="/auth" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Login
          </Link>
          <Link 
            to="/auth" 
            className="text-sm px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Automated Trading
              <span className="block text-primary">Made Simple</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Experience the power of algorithmic trading with our advanced bot platform. 
              Start trading smarter, not harder.
            </p>
            <Link 
              to="/auth" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
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
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="glass-card p-6 space-y-4">
              <feature.icon className="w-12 h-12 text-primary" />
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div className="container mx-auto px-4 py-16">
        <div className="glass-card p-8 text-center max-w-2xl mx-auto">
          <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
          <p className="text-muted-foreground mb-6">
            Subscribe to our newsletter for the latest updates on trading strategies and market insights.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border mt-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2024 MuraFx. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">Terms</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}