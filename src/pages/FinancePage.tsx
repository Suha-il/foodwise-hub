
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, CreditCard, TrendingUp, ArrowUpRight, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface TransactionProps {
  id: string;
  date: string;
  amount: string;
  status: "completed" | "pending" | "failed";
  description: string;
}

const transactions: TransactionProps[] = [
  {
    id: "TX123456",
    date: "2025-04-08",
    amount: "$240.00",
    status: "completed",
    description: "Daily sales deposit"
  },
  {
    id: "TX123457",
    date: "2025-04-07",
    amount: "$354.50",
    status: "completed",
    description: "Daily sales deposit"
  },
  {
    id: "TX123458",
    date: "2025-04-07",
    amount: "$20.00",
    status: "pending",
    description: "Refund - Order #45821"
  },
  {
    id: "TX123459",
    date: "2025-04-06",
    amount: "$289.75",
    status: "completed",
    description: "Daily sales deposit"
  },
  {
    id: "TX123460",
    date: "2025-04-05",
    amount: "$15.00",
    status: "failed",
    description: "Payment processing fee"
  }
];

const TransactionRow = ({ transaction }: { transaction: TransactionProps }) => {
  const statusColor = {
    completed: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
    pending: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20",
    failed: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
  };
  
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800 last:border-0">
      <div className="flex flex-col">
        <span className="font-medium">{transaction.description}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">{transaction.id}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(transaction.date).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium">{transaction.amount}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[transaction.status]}`}>
          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
        </span>
      </div>
    </div>
  );
};

export default function FinancePage() {
  const isMobile = useIsMobile();
  
  return (
    <Layout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Finance</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Statements
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$32,840.53</div>
              <p className="text-xs text-muted-foreground">
                +10.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Payouts
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$4,120.75</div>
              <p className="text-xs text-muted-foreground">
                Processing on Apr 15
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Growth Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12.5%</div>
              <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>Trending up</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="bg-gray-100 dark:bg-gray-800 mb-4">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions">
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  View your most recent financial transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {transactions.map((transaction) => (
                    <TransactionRow key={transaction.id} transaction={transaction} />
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-800 pt-4">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <Button size="sm">View All Transactions</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="invoices">
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>
                  View and manage your invoice history
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground text-center">
                  No invoices found for the current period.<br />
                  Check back later or change the date range.
                </p>
              </CardContent>
              <CardFooter className="border-t border-gray-200 dark:border-gray-800 pt-4">
                <Button className="w-full" variant="outline">
                  Create New Invoice
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="reports">
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
                <CardDescription>
                  Access your financial performance reports
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Financial reports are generated on the 1st of each month
                  </p>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Last Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
