import { Link, useLocation } from "react-router-dom";
import { Activity, Bot, LineChart, Settings, Users, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const menuItems = [
  { title: "Dashboard", icon: LineChart, path: "/" },
  { title: "Bots", icon: Bot, path: "/bots" },
  { title: "Monitor", icon: Activity, path: "/monitoring" },
  { title: "Traders", icon: Users, path: "/copytraders" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

export function AppMobileNav() {
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex items-center justify-around p-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center p-2 text-xs",
              location.pathname === item.path
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="mt-1">{item.title}</span>
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center p-2 text-xs text-muted-foreground hover:text-primary"
        >
          <LogOut className="h-5 w-5" />
          <span className="mt-1">Logout</span>
        </button>
      </div>
    </nav>
  );
}