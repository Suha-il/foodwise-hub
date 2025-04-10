
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";

// Sample data for charts
const monthlyData = [
  { name: "Jan", orders: 540, revenue: 3200, deliveries: 520 },
  { name: "Feb", orders: 620, revenue: 4100, deliveries: 600 },
  { name: "Mar", orders: 700, revenue: 5400, deliveries: 680 },
  { name: "Apr", orders: 680, revenue: 5200, deliveries: 660 },
  { name: "May", orders: 790, revenue: 6100, deliveries: 770 },
  { name: "Jun", orders: 810, revenue: 6500, deliveries: 800 },
];

const weeklyData = [
  { name: "Mon", orders: 120, revenue: 950, deliveries: 115 },
  { name: "Tue", orders: 132, revenue: 1050, deliveries: 130 },
  { name: "Wed", orders: 141, revenue: 1150, deliveries: 138 },
  { name: "Thu", orders: 130, revenue: 1000, deliveries: 125 },
  { name: "Fri", orders: 160, revenue: 1300, deliveries: 155 },
  { name: "Sat", orders: 170, revenue: 1400, deliveries: 165 },
  { name: "Sun", orders: 150, revenue: 1200, deliveries: 145 },
];

interface StatItemProps {
  title: string;
  value: string | number;
  change: number;
  changePeriod?: string;
}

const StatItem = ({ title, value, change, changePeriod = "from last period" }: StatItemProps) => {
  const isPositive = change > 0;
  const isNeutral = change === 0;
  
  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold">{value}</p>
            <div
              className={`text-xs font-medium flex items-center ${
                isPositive
                  ? "text-green-600 dark:text-green-400"
                  : isNeutral
                  ? "text-gray-500 dark:text-gray-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              <span className="mr-1">
                {isPositive ? "↑" : isNeutral ? "•" : "↓"}
              </span>
              <span>{isPositive ? "+" : ""}{change}%</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{changePeriod}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const StatsPage = () => {
  const [timePeriod, setTimePeriod] = useState("monthly");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isMobile = useIsMobile();
  
  const data = timePeriod === "monthly" ? monthlyData : weeklyData;
  
  const refreshData = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1200);
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Statistics</h1>
          <div className="flex items-center gap-2">
            <Button 
              onClick={refreshData} 
              variant="outline" 
              size="sm"
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatItem
            title="Total Orders"
            value="4,612"
            change={12.5}
          />
          <StatItem
            title="Completed Deliveries"
            value="4,480"
            change={10.2}
          />
          <StatItem
            title="Total Revenue"
            value="$32,840"
            change={8.1}
          />
          <StatItem
            title="Average Delivery Time"
            value="32 mins"
            change={-5.3}
          />
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
            </TabsList>
            
            <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-1">
              <Button
                variant={timePeriod === "weekly" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimePeriod("weekly")}
                className="text-xs h-7 px-2"
              >
                Weekly
              </Button>
              <Button
                variant={timePeriod === "monthly" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimePeriod("monthly")}
                className="text-xs h-7 px-2"
              >
                Monthly
              </Button>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <TabsContent value="orders" className="mt-0">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Order Statistics</CardTitle>
                <CardDescription>
                  Number of orders {timePeriod === "monthly" ? "per month" : "per day"}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip contentStyle={{ background: 'white', border: '1px solid #ccc' }} />
                    <Legend />
                    <Bar dataKey="orders" fill="#8884d8" name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="revenue" className="mt-0">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Revenue Statistics</CardTitle>
                <CardDescription>
                  Total revenue {timePeriod === "monthly" ? "per month" : "per day"} (USD)
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip contentStyle={{ background: 'white', border: '1px solid #ccc' }} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#82ca9d" 
                      name="Revenue" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="deliveries" className="mt-0">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Delivery Statistics</CardTitle>
                <CardDescription>
                  Number of completed deliveries {timePeriod === "monthly" ? "per month" : "per day"}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip contentStyle={{ background: 'white', border: '1px solid #ccc' }} />
                    <Legend />
                    <Bar dataKey="deliveries" fill="#ffc658" name="Deliveries" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
};

export default StatsPage;
