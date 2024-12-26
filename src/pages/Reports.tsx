import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Reports() {
  const { data: copyTraderReports } = useQuery({
    queryKey: ["copytrader-reports"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("copytrader_reports")
        .select("*")
        .order('report_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">
          View your copytrading performance reports
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trading Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            {copyTraderReports && copyTraderReports.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Investment</th>
                    <th className="p-2 text-left">Profit</th>
                    <th className="p-2 text-left">Rate %</th>
                  </tr>
                </thead>
                <tbody>
                  {copyTraderReports.map((report) => (
                    <tr key={report.id} className="border-b">
                      <td className="p-2">{new Date(report.report_date).toLocaleDateString()}</td>
                      <td className="p-2">${report.investment_amount.toLocaleString()}</td>
                      <td className="p-2">${report.profit_amount.toLocaleString()}</td>
                      <td className="p-2">{report.profit_percentage.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="p-4 text-center text-muted-foreground">No reports available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}