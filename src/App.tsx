import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import Bots from "./pages/Bots";
import Contract from "./pages/Contract";
import Copytraders from "./pages/Copytraders";
import Reports from "./pages/Reports";
import BotSettings from "./pages/BotSettings";
import Withdraw from "./pages/Withdraw";
import Deposit from "./pages/Deposit";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import CopytraderDashboard from "./pages/CopytraderDashboard";
import BotStatus from "./pages/BotStatus";
import CopytraderWithdraw from "./pages/CopytraderWithdraw";
import CopytraderDeposit from "./pages/CopytraderDeposit";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route element={<AppLayout><Outlet /></AppLayout>}>
            <Route path="/dashboard" element={<Index />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/bots" element={<Bots />} />
            <Route path="/bot-settings" element={<BotSettings />} />
            <Route path="/contract" element={<Contract />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/copytraders" element={<Copytraders />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/copytrader/dashboard" element={<CopytraderDashboard />} />
            <Route path="/bot-status" element={<BotStatus />} />
            <Route path="/copytrader/reports" element={<Reports />} />
            <Route path="/copytrader/deposit" element={<CopytraderDeposit />} />
            <Route path="/copytrader/withdraw" element={<CopytraderWithdraw />} />
            <Route path="/copytrader/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;