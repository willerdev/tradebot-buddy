import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export function TransactionHistory() {
  const { data: transactions } = useQuery({
    queryKey: ["transactions-history"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const [deposits, withdrawals] = await Promise.all([
        supabase
          .from("deposits")
          .select("*")
          .eq("user_id", user.user.id)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("withdrawals")
          .select("*")
          .eq("user_id", user.user.id)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      const combinedTransactions = [
        ...(deposits.data || []).map(d => ({ ...d, type: 'deposit' })),
        ...(withdrawals.data || []).map(w => ({ ...w, type: 'withdrawal' })),
      ].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ).slice(0, 5);

      return combinedTransactions;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your last 5 deposits and withdrawals</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions && transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">
                    {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(transaction.created_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                <div className={`font-medium ${
                  transaction.type === 'deposit' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No recent transactions</p>
        )}
      </CardContent>
    </Card>
  );
}