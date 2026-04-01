import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Lightbulb, TrendingDown, TrendingUp } from 'lucide-react';

export default function Insights() {
  const { transactions } = useStore();

  const insights = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    
    // Highest spending category
    const categoryTotals = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

    const highestCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

    // Largest single expense
    const largestExpense = [...expenses].sort((a, b) => b.amount - a.amount)[0];

    return [
      {
        id: 1,
        title: "Top Spending Area",
        description: highestCategory ? `${highestCategory[0]} is your highest spending category at $${highestCategory[1].toLocaleString()}` : "Not enough data",
        icon: TrendingDown,
        color: "text-destructive"
      },
      {
        id: 2,
        title: "Largest Single Expense",
        description: largestExpense ? `You spent $${largestExpense.amount} on ${largestExpense.description}` : "Not enough data",
        icon: Lightbulb,
        color: "text-yellow-500"
      },
      {
        id: 3,
        title: "Income vs Expense",
        description: "Your total income is higher than your total expenses this period.",
        icon: TrendingUp,
        color: "text-green-500"
      }
    ];
  }, [transactions]);

  return (
    <Card className="col-span-1 md:col-span-3">
      <CardHeader>
        <CardTitle>Financial Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {insights.map((insight) => {
            const Icon = insight.icon;
            return (
              <div key={insight.id} className="flex items-start gap-4 rounded-lg border p-4 transition-all hover:bg-muted/50">
                <div className={`mt-0.5 rounded-full bg-background p-2 shadow-sm ${insight.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
