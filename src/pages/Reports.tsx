import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/ui/data-table";

export default function Reports() {
  const [selectedTab, setSelectedTab] = useState("bots");

  const { data: botReports } = useQuery({
    queryKey: ["bot-reports"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("bot_trades")
        .select("*")
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: contractReports } = useQuery({
    queryKey: ["contract-reports"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("contracts")
        .select("*")
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: copyTraderReports } = useQuery({
    queryKey: ["copytrader-reports"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("copytraders")
        .select("*")
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">
          View detailed reports for your trading activities
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trading Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bots">Trading Bots</TabsTrigger>
              <TabsTrigger value="contracts">Contracts</TabsTrigger>
              <TabsTrigger value="copytraders">Copy Traders</TabsTrigger>
            </TabsList>
            <TabsContent value="bots" className="mt-4">
              <div className="rounded-md border">
                {botReports && botReports.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left">Symbol</th>
                        <th className="p-2 text-left">Side</th>
                        <th className="p-2 text-left">Entry Price</th>
                        <th className="p-2 text-left">Exit Price</th>
                        <th className="p-2 text-left">PnL</th>
                        <th className="p-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {botReports.map((report) => (
                        <tr key={report.id} className="border-b">
                          <td className="p-2">{report.symbol}</td>
                          <td className="p-2">{report.side}</td>
                          <td className="p-2">{report.entry_price}</td>
                          <td className="p-2">{report.exit_price || "-"}</td>
                          <td className="p-2">{report.pnl || "-"}</td>
                          <td className="p-2">{report.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="p-4 text-center text-muted-foreground">No bot reports available</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="contracts" className="mt-4">
              <div className="rounded-md border">
                {contractReports && contractReports.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left">Capital</th>
                        <th className="p-2 text-left">Profit</th>
                        <th className="p-2 text-left">Status</th>
                        <th className="p-2 text-left">Start Date</th>
                        <th className="p-2 text-left">End Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contractReports.map((report) => (
                        <tr key={report.id} className="border-b">
                          <td className="p-2">{report.capital}</td>
                          <td className="p-2">{report.profit}</td>
                          <td className="p-2">{report.status}</td>
                          <td className="p-2">{new Date(report.start_date).toLocaleDateString()}</td>
                          <td className="p-2">{report.end_date ? new Date(report.end_date).toLocaleDateString() : "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="p-4 text-center text-muted-foreground">No contract reports available</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="copytraders" className="mt-4">
              <div className="rounded-md border">
                {copyTraderReports && copyTraderReports.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left">Trader Name</th>
                        <th className="p-2 text-left">Description</th>
                        <th className="p-2 text-left">Status</th>
                        <th className="p-2 text-left">Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {copyTraderReports.map((report) => (
                        <tr key={report.id} className="border-b">
                          <td className="p-2">{report.trader_name}</td>
                          <td className="p-2">{report.description || "-"}</td>
                          <td className="p-2">{report.is_active ? "Active" : "Inactive"}</td>
                          <td className="p-2">{new Date(report.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="p-4 text-center text-muted-foreground">No copytrader reports available</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}