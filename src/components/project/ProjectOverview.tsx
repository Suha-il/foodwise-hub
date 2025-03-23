
import { useState } from "react";
import { ProjectSummary, UserRole, Order, Expenditure } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";
import { 
  ArrowLeft, 
  Package, 
  Clock, 
  DollarSign, 
  CreditCard, 
  PieChart,
  BarChart,
  FileText,
  RefreshCw,
  Plus
} from "lucide-react";
import { PieChart as RechartPieChart, Pie, Cell, ResponsiveContainer, BarChart as RechartBarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface ProjectOverviewProps {
  projectSummary: ProjectSummary;
  onBack: () => void;
  userRole: UserRole;
}

export default function ProjectOverview({ projectSummary, onBack, userRole }: ProjectOverviewProps) {
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState<Order[]>(generateMockOrders(projectSummary.project.id));
  const [recentExpenditures, setRecentExpenditures] = useState<Expenditure[]>(generateMockExpenditures(projectSummary.project.id));
  
  function generateMockOrders(projectId: string): Order[] {
    return Array.from({ length: 5 }, (_, i) => ({
      id: `order-${i + 1}`,
      serialNumber: `SN-${1000 + i}`,
      date: new Date(2023, 7, 20 - i).toISOString(),
      houseNumber: `H-${100 + i}`,
      name: `Customer ${i + 1}`,
      numberOfPeople: Math.floor(Math.random() * 5) + 1,
      amount: Math.floor(Math.random() * 5000) + 1000,
      status: i % 3 === 0 ? "delivered" : "pending",
      projectId,
      createdAt: new Date(2023, 7, 20 - i).toISOString(),
      updatedAt: new Date(2023, 7, 20 - i).toISOString(),
    }));
  }

  function generateMockExpenditures(projectId: string): Expenditure[] {
    const categories = ["Transport", "Packaging", "Salaries", "Utilities", "Misc"];
    return Array.from({ length: 5 }, (_, i) => ({
      id: `expense-${i + 1}`,
      category: categories[i % categories.length],
      amount: Math.floor(Math.random() * 3000) + 500,
      date: new Date(2023, 7, 20 - i).toISOString(),
      description: `${categories[i % categories.length]} expense ${i + 1}`,
      projectId,
      createdAt: new Date(2023, 7, 20 - i).toISOString(),
    }));
  }

  const handleNavigateToOrders = () => {
    navigate("/orders");
  };

  const handleNavigateToFinance = () => {
    navigate("/finance");
  };

  const handleNavigateToDelivery = () => {
    navigate("/delivery");
  };

  const handleExportData = () => {
    alert("Export functionality would be implemented here with actual data");
  };

  const handleRegenerateCode = () => {
    alert("Code regeneration would update the project code in the database");
  };

  // Data for the pie chart
  const pieData = [
    { name: "Delivered", value: projectSummary.stats.totalOrders - projectSummary.stats.pendingDeliveries, color: "#10b981" },
    { name: "Pending", value: projectSummary.stats.pendingDeliveries, color: "#f59e0b" }
  ];

  // Data for the bar chart - simulating weekly data
  const barData = [
    { name: "Week 1", income: 15000, expense: 5000 },
    { name: "Week 2", income: 18000, expense: 6000 },
    { name: "Week 3", income: 22000, expense: 7000 },
    { name: "Week 4", income: 20000, expense: 7000 }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{projectSummary.project.name}</h1>
        </div>
        <div className="flex gap-2">
          {userRole === "main_admin" && (
            <Button variant="outline" size="sm" onClick={handleRegenerateCode}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate Code
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <FileText className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Package className="h-4 w-4 mr-2 text-primary" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectSummary.stats.totalOrders}</div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 p-0 h-auto text-primary"
              onClick={handleNavigateToOrders}
            >
              View Orders
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-amber-500" />
              Pending Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectSummary.stats.pendingDeliveries}</div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 p-0 h-auto text-primary"
              onClick={handleNavigateToDelivery}
            >
              Update Deliveries
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-green-500" />
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(projectSummary.stats.totalIncome)}</div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 p-0 h-auto text-primary"
              onClick={handleNavigateToFinance}
            >
              View Finances
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CreditCard className="h-4 w-4 mr-2 text-red-500" />
              Total Expenditure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(projectSummary.stats.totalExpenditure)}</div>
            <p className="text-sm text-muted-foreground">
              Balance: <span className="font-medium">{formatCurrency(projectSummary.stats.balance)}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RechartPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <BarChart className="h-5 w-5 mr-2" />
              Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RechartBarChart
                data={barData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#10b981" />
                <Bar dataKey="expense" name="Expense" fill="#ef4444" />
              </RechartBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Updates Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            <Button size="sm" variant="outline" onClick={handleNavigateToOrders}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-2 text-left font-medium">Name</th>
                    <th className="px-4 py-2 text-left font-medium">House No.</th>
                    <th className="px-4 py-2 text-left font-medium">Amount</th>
                    <th className="px-4 py-2 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-t hover:bg-muted/30 transition-colors cursor-pointer">
                      <td className="px-4 py-2 font-medium">{order.name}</td>
                      <td className="px-4 py-2">{order.houseNumber}</td>
                      <td className="px-4 py-2">{formatCurrency(order.amount)}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-block w-2 h-2 rounded-full mr-1 ${
                            order.status === "delivered" ? "bg-green-500" : "bg-amber-500"
                          }`}
                        ></span>
                        {order.status === "delivered" ? "Delivered" : "Pending"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Expenses</CardTitle>
            <Button size="sm" variant="outline" onClick={handleNavigateToFinance}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-2 text-left font-medium">Category</th>
                    <th className="px-4 py-2 text-left font-medium">Date</th>
                    <th className="px-4 py-2 text-left font-medium">Amount</th>
                    <th className="px-4 py-2 text-left font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {recentExpenditures.map((expense) => (
                    <tr key={expense.id} className="border-t hover:bg-muted/30 transition-colors cursor-pointer">
                      <td className="px-4 py-2 font-medium">{expense.category}</td>
                      <td className="px-4 py-2">{formatDate(expense.date)}</td>
                      <td className="px-4 py-2">{formatCurrency(expense.amount)}</td>
                      <td className="px-4 py-2 truncate max-w-[150px]">{expense.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-between mt-6">
        <div className="flex gap-3">
          <Button onClick={handleNavigateToOrders}>
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
          {(userRole === "main_admin" || userRole === "admin") && (
            <Button variant="outline" onClick={handleNavigateToFinance}>
              <Plus className="h-4 w-4 mr-2" />
              New Expense
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
