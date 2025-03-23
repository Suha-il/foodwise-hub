
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { UserRole, Order, Expenditure, FinancialSummary } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  PlusCircle, 
  DollarSign, 
  ArrowUpFromLine, 
  ArrowDownToLine,
  TrendingUp,
  Filter,
  Calendar,
  Wallet
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const FinancePage = () => {
  const [userRole, setUserRole] = useState<UserRole>("main_admin");
  const [projectName, setProjectName] = useState("Food Delivery");
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpenditure: 0,
    balance: 0,
  });
  
  // In a real app, fetch this from localStorage or a state management solution
  useEffect(() => {
    const storedRole = localStorage.getItem("user_role") as UserRole | null;
    const storedName = localStorage.getItem("project_name");
    
    if (storedRole) {
      setUserRole(storedRole);
    }
    
    if (storedName) {
      setProjectName(storedName);
    }
    
    // Mock data for demonstration
    const mockOrders: Order[] = Array.from({ length: 30 }, (_, i) => ({
      id: `order-${i + 1}`,
      serialNumber: `SN-${1000 + i}`,
      date: new Date(2023, 7, 20 - i % 10).toISOString(),
      houseNumber: `H-${100 + i}`,
      name: `Customer ${i + 1}`,
      numberOfPeople: Math.floor(Math.random() * 5) + 1,
      amount: Math.floor(Math.random() * 3000) + 1000,
      status: i % 3 === 0 ? "delivered" : "pending",
      projectId: "project-1",
      createdAt: new Date(2023, 7, 20 - i % 10).toISOString(),
      updatedAt: new Date(2023, 7, 20 - i % 10).toISOString(),
    }));
    
    const mockExpenditures: Expenditure[] = [
      {
        id: "exp-1",
        category: "Transport",
        amount: 5000,
        date: new Date(2023, 7, 19).toISOString(),
        description: "Fuel for delivery vehicles",
        projectId: "project-1",
        createdAt: new Date(2023, 7, 19).toISOString(),
      },
      {
        id: "exp-2",
        category: "Packaging",
        amount: 3500,
        date: new Date(2023, 7, 18).toISOString(),
        description: "Food containers and bags",
        projectId: "project-1",
        createdAt: new Date(2023, 7, 18).toISOString(),
      },
      {
        id: "exp-3",
        category: "Staff",
        amount: 12000,
        date: new Date(2023, 7, 17).toISOString(),
        description: "Delivery staff salaries",
        projectId: "project-1",
        createdAt: new Date(2023, 7, 17).toISOString(),
      },
      {
        id: "exp-4",
        category: "Maintenance",
        amount: 2000,
        date: new Date(2023, 7, 16).toISOString(),
        description: "Vehicle maintenance",
        projectId: "project-1",
        createdAt: new Date(2023, 7, 16).toISOString(),
      },
    ];
    
    setOrders(mockOrders);
    setExpenditures(mockExpenditures);
    
    // Calculate financial summary
    const totalIncome = mockOrders.reduce((sum, order) => sum + order.amount, 0);
    const totalExpenditure = mockExpenditures.reduce((sum, exp) => sum + exp.amount, 0);
    
    setFinancialSummary({
      totalIncome,
      totalExpenditure,
      balance: totalIncome - totalExpenditure,
    });
  }, []);
  
  const handleAddExpenditure = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    const formData = new FormData(e.target as HTMLFormElement);
    
    const newExpenditure: Expenditure = {
      id: `exp-${expenditures.length + 1}`,
      category: formData.get("category") as string,
      amount: parseInt(formData.get("amount") as string),
      date: (formData.get("date") as string) 
        ? new Date(formData.get("date") as string).toISOString() 
        : new Date().toISOString(),
      description: formData.get("description") as string,
      projectId: "project-1",
      createdAt: new Date().toISOString(),
    };
    
    const updatedExpenditures = [...expenditures, newExpenditure];
    setExpenditures(updatedExpenditures);
    
    // Update financial summary
    const totalExpenditure = updatedExpenditures.reduce((sum, exp) => sum + exp.amount, 0);
    setFinancialSummary({
      ...financialSummary,
      totalExpenditure,
      balance: financialSummary.totalIncome - totalExpenditure,
    });
    
    // Reset form
    (e.target as HTMLFormElement).reset();
  };
  
  // Prepare data for charts
  const pieData = [
    { name: "Income", value: financialSummary.totalIncome, color: "#4f46e5" },
    { name: "Expenditure", value: financialSummary.totalExpenditure, color: "#ef4444" },
  ];
  
  const expenditureByCategory = expenditures.reduce((acc, exp) => {
    if (!acc[exp.category]) {
      acc[exp.category] = 0;
    }
    acc[exp.category] += exp.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const expenditurePieData = Object.entries(expenditureByCategory).map(([name, value], index) => ({
    name,
    value,
    color: ["#f97316", "#10b981", "#6366f1", "#ec4899", "#f59e0b"][index % 5],
  }));
  
  // Group orders by date for the bar chart
  const ordersByDate = orders.reduce((acc, order) => {
    const date = new Date(order.date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += order.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const barChartData = Object.entries(ordersByDate)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7); // Last 7 days
  
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  return (
    <Layout role={userRole} projectName={projectName}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Financial Management</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <ArrowUpFromLine className="mr-2 h-5 w-5 text-green-500" />
                Total Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                ${financialSummary.totalIncome.toLocaleString()}
              </div>
              <p className="text-muted-foreground">
                From {orders.length} orders
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <ArrowDownToLine className="mr-2 h-5 w-5 text-red-500" />
                Total Expenditure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                ${financialSummary.totalExpenditure.toLocaleString()}
              </div>
              <p className="text-muted-foreground">
                Across {expenditures.length} entries
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Wallet className="mr-2 h-5 w-5 text-primary" />
                Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${
                financialSummary.balance >= 0 ? "text-green-600" : "text-red-600"
              }`}>
                ${financialSummary.balance.toLocaleString()}
              </div>
              <p className="text-muted-foreground">
                {financialSummary.balance >= 0 ? "Profit" : "Loss"}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Income Overview</CardTitle>
              <CardDescription>
                Last 7 days of income from orders
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip formatter={(value) => [`$${(value as number).toLocaleString()}`, "Amount"]} />
                  <Legend />
                  <Bar dataKey="amount" name="Income" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Expenditure by Category</CardTitle>
              <CardDescription>
                Breakdown of expenses by category
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenditurePieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenditurePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${(value as number).toLocaleString()}`, "Amount"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Expenditures</CardTitle>
              <CardDescription>
                Record and view financial expenditures for your project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="list">
                <TabsList className="mb-4">
                  <TabsTrigger value="list">Expenditure List</TabsTrigger>
                  <TabsTrigger value="add">Add Expenditure</TabsTrigger>
                </TabsList>
                
                <TabsContent value="list">
                  <div className="rounded-lg border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="px-4 py-3 text-left font-medium">Date</th>
                            <th className="px-4 py-3 text-left font-medium">Category</th>
                            <th className="px-4 py-3 text-left font-medium">Description</th>
                            <th className="px-4 py-3 text-left font-medium">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expenditures.map((exp) => (
                            <tr key={exp.id} className="border-t hover:bg-muted/30">
                              <td className="px-4 py-3">
                                {new Date(exp.date).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                  {exp.category}
                                </span>
                              </td>
                              <td className="px-4 py-3">{exp.description}</td>
                              <td className="px-4 py-3 text-red-600 font-medium">
                                -${exp.amount.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                          
                          {expenditures.length === 0 && (
                            <tr>
                              <td 
                                colSpan={4} 
                                className="px-4 py-6 text-center text-muted-foreground"
                              >
                                No expenditures recorded yet. Add your first expense.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="add">
                  <form id="expenditure-form" onSubmit={handleAddExpenditure}>
                    <div className="grid gap-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select name="category" required>
                            <SelectTrigger id="category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Transport">Transport</SelectItem>
                              <SelectItem value="Packaging">Packaging</SelectItem>
                              <SelectItem value="Staff">Staff</SelectItem>
                              <SelectItem value="Maintenance">Maintenance</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount ($)</Label>
                          <Input
                            id="amount"
                            name="amount"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="e.g., 1250"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date">Date</Label>
                          <Input
                            id="date"
                            name="date"
                            type="date"
                            defaultValue={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Input
                            id="description"
                            name="description"
                            placeholder="Brief description of the expenditure"
                            required
                          />
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full md:w-auto">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Expenditure
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default FinancePage;
