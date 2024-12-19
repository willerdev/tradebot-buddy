import { Activity, Bot, LineChart, Settings, Users, Wallet, GitCompare, Terminal, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
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

const menuItems = [
  { title: "Dashboard", icon: LineChart, path: "/dashboard" },
  { title: "Active Bots", icon: Bot, path: "/bots" },
  { title: "Contract Bots", icon: GitCompare, path: "/contract" },
  { title: "Bot Training", icon: Terminal, path: "/bot-training" },
  { title: "Monitoring", icon: Activity, path: "/monitoring" },
  { title: "Copytraders", icon: Users, path: "/copytraders" },
  { title: "Brokers", icon: Wallet, path: "/brokers" },
  { title: "Deposit", icon: ArrowDownCircle, path: "/deposit" },
  { title: "Withdraw", icon: ArrowUpCircle, path: "/withdraw" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

export function AppSidebar() {
  const location = useLocation();

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