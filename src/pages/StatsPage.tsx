
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { UserRole, Order, DeliveryStats } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Filter,
  Users,
  Home,
  Clock,
  Map,
  BarChart2,
  PieChart as PieChartIcon,
} from "lucide-react";

const StatsPage = () => {
  const [userRole, setUserRole] = useState<UserRole>("user");
  const [projectName, setProjectName] = useState("Food Delivery");
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DeliveryStats>({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalPeople: 0,
    pendingPeople: 0,
  });
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  
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
    
    // Generate mock data for houses
    const areas = ["North", "South", "East", "West", "Central"];
    
    // Mock data for demonstration
    const mockOrders: Order[] = Array.from({ length: 50 }, (_, i) => {
      const area = areas[i % areas.length];
      const isDelivered = i % 3 === 0;
      const numberOfPeople = Math.floor(Math.random() * 5) + 1;
      const daysAgo = i % 10;
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - daysAgo);
      
      return {
        id: `order-${i + 1}`,
        serialNumber: `SN-${1000 + i}`,
        date: orderDate.toISOString(),
        houseNumber: `${area}-${100 + i}`,
        name: `Customer ${i + 1}`,
        numberOfPeople,
        amount: numberOfPeople * (Math.floor(Math.random() * 500) + 500),
        status: isDelivered ? "delivered" : "pending",
        projectId: "project-1",
        createdAt: orderDate.toISOString(),
        updatedAt: isDelivered ? orderDate.toISOString() : "",
      };
    });
    
    setOrders(mockOrders);
    
    // Calculate statistics
    const totalOrders = mockOrders.length;
    const pendingOrders = mockOrders.filter(order => order.status === "pending").length;
    const deliveredOrders = totalOrders - pendingOrders;
    const totalPeople = mockOrders.reduce((sum, order) => sum + order.numberOfPeople, 0);
    const pendingPeople = mockOrders
      .filter(order => order.status === "pending")
      .reduce((sum, order) => sum + order.numberOfPeople, 0);
    
    setStats({
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalPeople,
      pendingPeople,
    });
  }, []);
  
  // Apply filters
  const filteredOrders = orders.filter((order) => {
    // Date filter
    if (dateFilter !== "all") {
      const orderDate = new Date(order.date);
      const today = new Date();
      
      if (dateFilter === "today") {
        const isToday = orderDate.toDateString() === today.toDateString();
        if (!isToday) return false;
      } else if (dateFilter === "yesterday") {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const isYesterday = orderDate.toDateString() === yesterday.toDateString();
        if (!isYesterday) return false;
      } else if (dateFilter === "thisWeek") {
        const weekStart = new Date();
        weekStart.setDate(today.getDate() - today.getDay());
        const isThisWeek = orderDate >= weekStart;
        if (!isThisWeek) return false;
      }
    }
    
    // Location filter
    if (locationFilter !== "all") {
      const orderLocation = order.houseNumber.split("-")[0];
      if (orderLocation !== locationFilter) return false;
    }
    
    return true;
  });
  
  // Calculate filtered statistics
  const filteredStats = {
    totalOrders: filteredOrders.length,
    pendingOrders: filteredOrders.filter(order => order.status === "pending").length,
    deliveredOrders: filteredOrders.filter(order => order.status === "delivered").length,
    totalPeople: filteredOrders.reduce((sum, order) => sum + order.numberOfPeople, 0),
    pendingPeople: filteredOrders
      .filter(order => order.status === "pending")
      .reduce((sum, order) => sum + order.numberOfPeople, 0),
  };
  
  // Prepare data for charts
  const statusPieData = [
    { name: "Pending", value: filteredStats.pendingOrders, color: "#f59e0b" },
    { name: "Delivered", value: filteredStats.deliveredOrders, color: "#10b981" },
  ];
  
  // Group by location for location distribution
  const ordersByLocation = filteredOrders.reduce((acc, order) => {
    const location = order.houseNumber.split("-")[0];
    if (!acc[location]) {
      acc[location] = 0;
    }
    acc[location]++;
    return acc;
  }, {} as Record<string, number>);
  
  const locationPieData = Object.entries(ordersByLocation).map(([name, value], index) => ({
    name,
    value,
    color: ["#f97316", "#10b981", "#6366f1", "#ec4899", "#f59e0b"][index % 5],
  }));
  
  // Group by date for trend chart
  const ordersByDate = filteredOrders.reduce((acc, order) => {
    const date = new Date(order.date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { pending: 0, delivered: 0 };
    }
    if (order.status === "pending") {
      acc[date].pending++;
    } else {
      acc[date].delivered++;
    }
    return acc;
  }, {} as Record<string, { pending: number; delivered: number }>);
  
  const trendChartData = Object.entries(ordersByDate)
    .map(([date, counts]) => ({ 
      date, 
      Pending: counts.pending, 
      Delivered: counts.delivered 
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7); // Last 7 days
  
  // Get unique areas for filter
  const areas = [...new Set(orders.map(order => order.houseNumber.split("-")[0]))];

  return (
    <Layout role={userRole} projectName={projectName}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Statistics Overview</h1>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select
                value={dateFilter}
                onValueChange={setDateFilter}
              >
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="thisWeek">This Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Map className="h-4 w-4 text-muted-foreground" />
              <Select
                value={locationFilter}
                onValueChange={setLocationFilter}
              >
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {areas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area} Area
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Home className="mr-2 h-5 w-5 text-amber-500" />
                Pending Houses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{filteredStats.pendingOrders}</div>
              <p className="text-muted-foreground">
                out of {filteredStats.totalOrders} total houses
              </p>
              <div className="mt-2">
                <Progress 
                  value={(filteredStats.pendingOrders / Math.max(1, filteredStats.totalOrders)) * 100} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Pending People
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{filteredStats.pendingPeople}</div>
              <p className="text-muted-foreground">
                out of {filteredStats.totalPeople} total people
              </p>
              <div className="mt-2">
                <Progress 
                  value={(filteredStats.pendingPeople / Math.max(1, filteredStats.totalPeople)) * 100} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Clock className="mr-2 h-5 w-5 text-green-500" />
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {filteredStats.totalOrders 
                  ? Math.round((filteredStats.deliveredOrders / filteredStats.totalOrders) * 100) 
                  : 0}%
              </div>
              <p className="text-muted-foreground">
                {filteredStats.deliveredOrders} delivered houses
              </p>
              <div className="mt-2">
                <Progress 
                  value={(filteredStats.deliveredOrders / Math.max(1, filteredStats.totalOrders)) * 100} 
                  className="h-2 bg-muted"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <div>
                <CardTitle>Delivery Status</CardTitle>
                <CardDescription>
                  Distribution of pending vs. delivered orders
                </CardDescription>
              </div>
              <PieChartIcon className="ml-auto h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, "Orders"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center">
              <div>
                <CardTitle>Delivery Trend</CardTitle>
                <CardDescription>
                  Order delivery status over time
                </CardDescription>
              </div>
              <BarChart2 className="ml-auto h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Delivered" fill="#10b981" />
                  <Bar dataKey="Pending" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Orders by Location</CardTitle>
            <CardDescription>
              Distribution of orders across different areas
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={locationPieData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
              >
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip formatter={(value) => [value, "Orders"]} />
                <Bar dataKey="value" name="Orders">
                  {locationPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StatsPage;
