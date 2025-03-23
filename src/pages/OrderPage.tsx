
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole, Order } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Search, Filter, SortAsc, SortDesc } from "lucide-react";

const OrderPage = () => {
  const [userRole, setUserRole] = useState<UserRole>("user");
  const [projectName, setProjectName] = useState("Food Delivery");
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
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
    const mockOrders: Order[] = Array.from({ length: 10 }, (_, i) => ({
      id: `order-${i + 1}`,
      serialNumber: `SN-${1000 + i}`,
      date: new Date(2023, 7, 20 - i).toISOString(),
      houseNumber: `H-${100 + i}`,
      name: `Customer ${i + 1}`,
      numberOfPeople: Math.floor(Math.random() * 5) + 1,
      amount: Math.floor(Math.random() * 5000) + 1000,
      status: i % 3 === 0 ? "delivered" : "pending",
      projectId: "project-1",
      createdAt: new Date(2023, 7, 20 - i).toISOString(),
      updatedAt: new Date(2023, 7, 20 - i).toISOString(),
    }));
    
    setOrders(mockOrders);
  }, []);
  
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    const formData = new FormData(e.target as HTMLFormElement);
    const newOrder: Order = {
      id: `order-${orders.length + 1}`,
      serialNumber: `SN-${1000 + orders.length}`,
      date: new Date().toISOString(),
      houseNumber: formData.get("houseNumber") as string,
      name: formData.get("name") as string,
      numberOfPeople: parseInt(formData.get("numberOfPeople") as string),
      amount: parseInt(formData.get("amount") as string),
      status: "pending",
      projectId: "project-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setOrders([newOrder, ...orders]);
    // Reset form
    (e.target as HTMLFormElement).reset();
  };
  
  const filteredOrders = orders.filter((order) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      order.serialNumber.toLowerCase().includes(searchLower) ||
      order.houseNumber.toLowerCase().includes(searchLower) ||
      order.name.toLowerCase().includes(searchLower)
    );
  });
  
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <Layout role={userRole} projectName={projectName}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        </div>
        
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="list">Order List</TabsTrigger>
            <TabsTrigger value="create">Create Order</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search orders..."
                  className="pl-10 w-full sm:w-72"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => 
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                  }
                >
                  {sortDirection === "asc" ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium">Serial No.</th>
                      <th className="px-4 py-3 text-left font-medium">Date</th>
                      <th className="px-4 py-3 text-left font-medium">House No.</th>
                      <th className="px-4 py-3 text-left font-medium">Name</th>
                      <th className="px-4 py-3 text-left font-medium">People</th>
                      <th className="px-4 py-3 text-left font-medium">Amount</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedOrders.map((order) => (
                      <tr 
                        key={order.id} 
                        className="border-t transition-colors hover:bg-muted/30"
                      >
                        <td className="px-4 py-3 font-mono text-sm">
                          {order.serialNumber}
                        </td>
                        <td className="px-4 py-3">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">{order.houseNumber}</td>
                        <td className="px-4 py-3">{order.name}</td>
                        <td className="px-4 py-3">{order.numberOfPeople}</td>
                        <td className="px-4 py-3">
                          ${order.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
                            }`}
                          >
                            {order.status === "delivered" ? "Delivered" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                    
                    {sortedOrders.length === 0 && (
                      <tr>
                        <td 
                          colSpan={7} 
                          className="px-4 py-6 text-center text-muted-foreground"
                        >
                          No orders found. Create a new order or adjust your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Order</CardTitle>
                <CardDescription>
                  Enter the details to create a new food delivery order.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form id="order-form" onSubmit={handleCreateOrder}>
                  <div className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="house-number">House Number</Label>
                        <Input
                          id="house-number"
                          name="houseNumber"
                          placeholder="e.g., H-101"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="name">Customer Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="e.g., John Smith"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="people">Number of People</Label>
                        <Input
                          id="people"
                          name="numberOfPeople"
                          type="number"
                          min="1"
                          placeholder="e.g., 4"
                          required
                        />
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
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button form="order-form" type="submit">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Order
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default OrderPage;
