import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import Monitoring from "./pages/Monitoring";
import Bots from "./pages/Bots";
import Brokers from "./pages/Brokers";
import Copytraders from "./pages/Copytraders";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";

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
          <Route element={<AppLayout>}>
            <Route path="/dashboard" element={<Index />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/bots" element={<Bots />} />
            <Route path="/brokers" element={<Brokers />} />
            <Route path="/copytraders" element={<Copytraders />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;