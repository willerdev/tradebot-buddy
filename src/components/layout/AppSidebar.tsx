import { LineChart, Bot, GitCompare, Users, FileText, Settings, Wallet, DollarSign } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const adminMenuItems = [
  { title: "Dashboard", icon: LineChart, path: "/dashboard" },
  { title: "Trading Bots", icon: Bot, path: "/bots" },
  { title: "Bot Settings", icon: Settings, path: "/bot-settings" },
  { title: "Contract Bots", icon: GitCompare, path: "/contract" },
  { title: "Copy Traders", icon: Users, path: "/copytraders" },
  { title: "Reports", icon: FileText, path: "/reports" },
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

export function AppSidebar() {
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
    <Sidebar>
      <SidebarContent>
        <div className="p-6">
          <h1 className="text-xl font-bold">MuraFx</h1>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                  >
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
