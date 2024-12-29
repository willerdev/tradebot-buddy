import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ChartBar, Copy, Shield, Wallet } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <div className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              MuraFx
            </div>
            <p className="text-xl text-muted-foreground mb-8">
              Professional Crypto Trading & Copy Trading Platform
            </p>
            <Link to="/auth">
              <Button size="lg">
                Start Trading Now
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Copy className="h-5 w-5" />
                  Copy Trading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>• Follow expert traders automatically</li>
                  <li>• Real-time trade copying</li>
                  <li>• Performance tracking</li>
                  <li>• Risk management tools</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartBar className="h-5 w-5" />
                  Crypto Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>• Diverse cryptocurrency selection</li>
                  <li>• Advanced trading tools</li>
                  <li>• Portfolio analytics</li>
                  <li>• Market insights</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Benefits Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-8">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <Shield className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
                <p className="text-muted-foreground">Advanced security measures to protect your assets</p>
              </div>
              <div className="flex flex-col items-center">
                <Wallet className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Easy Management</h3>
                <p className="text-muted-foreground">Intuitive portfolio and trade management tools</p>
              </div>
              <div className="flex flex-col items-center">
                <ArrowRight className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Quick Start</h3>
                <p className="text-muted-foreground">Start trading in minutes with easy onboarding</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border p-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
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