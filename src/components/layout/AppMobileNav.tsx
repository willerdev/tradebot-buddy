import { Link, useLocation } from "react-router-dom";
import { LineChart, Bot, Wallet, DollarSign, Settings, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const adminMenuItems = [
  { title: "Home", icon: LineChart, path: "/dashboard" },
  { title: "Bots", icon: Bot, path: "/bots" },
  { title: "Deposit", icon: Wallet, path: "/deposit" },
  { title: "Withdraw", icon: DollarSign, path: "/withdraw" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

const copytraderMenuItems = [
  { title: "Dashboard", icon: LineChart, path: "/copytrader/dashboard" },
  { title: "Bot Status", icon: Bot, path: "/bot-status" },
  { title: "Reports", icon: FileText, path: "/copytrader/reports" },
  { title: "Deposit", icon: Wallet, path: "/copytrader/deposit" },
  { title: "Withdraw", icon: DollarSign, path: "/copytrader/withdraw" },
  { title: "Settings", icon: Settings, path: "/copytrader/settings" },
];

export function AppMobileNav() {
  const location = useLocation();

  const { data: isAdmin } = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data } = await supabase
        .from("admins")
        .select("*")
        .eq("user_id", user.user.id)
        .maybeSingle();

      return !!data;
    },
  });

  const menuItems = isAdmin ? adminMenuItems : copytraderMenuItems;

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
      </div>
    </nav>
  );
}
