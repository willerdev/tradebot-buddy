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
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import CopytraderDashboard from "./pages/CopytraderDashboard";

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
            <Route path="/copytraders" element={<Copytraders />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/copytrader/dashboard" element={<CopytraderDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;