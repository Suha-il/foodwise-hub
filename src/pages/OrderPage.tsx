
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { UserRole } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilterX, Search, Filter, Clock, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

interface OrderItem {
  id: string;
  customer: string;
  status: "new" | "preparing" | "ready" | "delivering" | "completed" | "cancelled";
  time: string;
  total: string;
  items: number;
  address: string;
}

const orders: OrderItem[] = [
  {
    id: "ORD-5932",
    customer: "Alice Johnson",
    status: "new",
    time: "10 mins ago",
    total: "$38.50",
    items: 3,
    address: "123 Main St, Apt 4B"
  },
  {
    id: "ORD-5931",
    customer: "Bob Smith",
    status: "preparing",
    time: "15 mins ago",
    total: "$24.75",
    items: 2,
    address: "456 Oak Ave"
  },
  {
    id: "ORD-5930",
    customer: "Carol White",
    status: "ready",
    time: "20 mins ago",
    total: "$52.00",
    items: 4,
    address: "789 Pine Blvd, Suite 3"
  },
  {
    id: "ORD-5929",
    customer: "David Brown",
    status: "delivering",
    time: "30 mins ago",
    total: "$18.25",
    items: 1,
    address: "101 Elm St"
  },
  {
    id: "ORD-5928",
    customer: "Eva Green",
    status: "completed",
    time: "45 mins ago",
    total: "$43.75",
    items: 3,
    address: "202 Maple Rd"
  },
  {
    id: "ORD-5927",
    customer: "Frank Miller",
    status: "cancelled",
    time: "50 mins ago",
    total: "$29.99",
    items: 2,
    address: "303 Cedar Ln"
  }
];

export default function OrderPage() {
  const [role] = useState<UserRole>("admin");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const isMobile = useIsMobile();
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query) {
      setFilteredOrders(orders);
      return;
    }
    
    const filtered = orders.filter(
      order => 
        order.id.toLowerCase().includes(query) || 
        order.customer.toLowerCase().includes(query) ||
        order.address.toLowerCase().includes(query)
    );
    
    setFilteredOrders(filtered);
  };
  
  const clearSearch = () => {
    setSearchQuery("");
    setFilteredOrders(orders);
  };
  
  const getStatusColor = (status: OrderItem["status"]) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "preparing": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "ready": return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      case "delivering": return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300";
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };
  
  const getStatusIcon = (status: OrderItem["status"]) => {
    switch (status) {
      case "new": return <Clock className="h-3 w-3" />;
      case "completed": return <Check className="h-3 w-3" />;
      case "cancelled": return <X className="h-3 w-3" />;
      default: return null;
    }
  };
  
  const OrderCard = ({ order }: { order: OrderItem }) => {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-medium text-sm">{order.id}</p>
            <p className="font-semibold">{order.customer}</p>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
          </div>
        </div>
        <div className="flex justify-between mb-2 text-sm">
          <div className="text-muted-foreground">{order.time}</div>
          <div>{order.total}</div>
        </div>
        <div className="text-xs text-muted-foreground mb-3 truncate">{order.address}</div>
        <div className="flex justify-between">
          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            {order.items} item{order.items !== 1 ? "s" : ""}
          </span>
          <Button size="sm" variant="outline">View Details</Button>
        </div>
      </div>
    );
  };

  return (
    <Layout role={role}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <Button>Create New Order</Button>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border rounded-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders by ID, customer, or address"
              className="pl-8"
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchQuery && (
              <button
                className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="sm:hidden">
            <FilterX className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-gray-100 dark:bg-gray-800 mb-4">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>
                  View and manage all customer orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredOrders.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredOrders.map(order => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground mb-2">No orders found</p>
                    {searchQuery && (
                      <Button variant="outline" onClick={clearSearch} size="sm">
                        <FilterX className="h-4 w-4 mr-2" />
                        Clear Filters
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="active" className="mt-0">
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Active Orders</CardTitle>
                <CardDescription>
                  View and manage orders that are currently being processed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOrders
                    .filter(order => ["new", "preparing", "ready", "delivering"].includes(order.status))
                    .map(order => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed" className="mt-0">
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Completed Orders</CardTitle>
                <CardDescription>
                  View orders that have been successfully delivered
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOrders
                    .filter(order => order.status === "completed")
                    .map(order => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cancelled" className="mt-0">
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Cancelled Orders</CardTitle>
                <CardDescription>
                  View orders that have been cancelled
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOrders
                    .filter(order => order.status === "cancelled")
                    .map(order => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
