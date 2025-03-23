
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { UserRole, Order, SearchType } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  CheckCircle, 
  PackageCheck, 
  Truck, 
  ArrowUpDown 
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DeliveryPage = () => {
  const [userRole, setUserRole] = useState<UserRole>("user");
  const [projectName, setProjectName] = useState("Food Delivery");
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("houseNumber");
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [deliveryFilter, setDeliveryFilter] = useState<"all" | "pending" | "delivered">("pending");
  
  // In a real app, fetch this from localStorage or a state management solution
  useEffect(() => {
    const storedRole = localStorage.getItem("user_role") as UserRole | null;
    const storedName = localStorage.getItem("project_name");
    const selectedProject = localStorage.getItem("selected_project");
    
    if (storedRole) {
      setUserRole(storedRole);
    }
    
    if (storedName) {
      setProjectName(storedName);
    }
    
    // Mock data for demonstration
    const mockOrders: Order[] = Array.from({ length: 20 }, (_, i) => ({
      id: `order-${i + 1}`,
      serialNumber: `SN-${1000 + i}`,
      date: new Date(2023, 7, 20 - i).toISOString(),
      houseNumber: `H-${100 + i}`,
      name: `Customer ${i + 1}`,
      numberOfPeople: Math.floor(Math.random() * 5) + 1,
      amount: Math.floor(Math.random() * 5000) + 1000,
      status: i % 3 === 0 ? "delivered" : "pending",
      projectId: selectedProject ? JSON.parse(selectedProject).project.id : "project-1",
      createdAt: new Date(2023, 7, 20 - i).toISOString(),
      updatedAt: new Date(2023, 7, 20 - i).toISOString(),
    }));
    
    setOrders(mockOrders);
  }, []);
  
  const handleSearch = () => {
    if (!searchQuery) return;
    
    setIsSearching(true);
    setCurrentOrder(null);
    
    // Simulate API call delay
    setTimeout(() => {
      let foundOrder: Order | undefined;
      
      // Search based on the selected search type
      switch (searchType) {
        case "serialNumber":
          foundOrder = orders.find(
            (order) => order.serialNumber.toLowerCase() === searchQuery.toLowerCase()
          );
          break;
        case "name":
          // Using includes for fuzzy name matching
          foundOrder = orders.find(
            (order) => order.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          break;
        case "houseNumber":
        default:
          foundOrder = orders.find(
            (order) => order.houseNumber.toLowerCase() === searchQuery.toLowerCase()
          );
          break;
      }
      
      setCurrentOrder(foundOrder || null);
      setIsSearching(false);
    }, 600);
  };
  
  const handleMarkDelivered = () => {
    if (!currentOrder) return;
    
    // In a real app, this would call an API
    const updatedOrders = orders.map((order) =>
      order.id === currentOrder.id ? { ...order, status: "delivered" as const, updatedAt: new Date().toISOString() } : order
    );
    
    setOrders(updatedOrders);
    
    // Update the current order in the state
    setCurrentOrder({ ...currentOrder, status: "delivered", updatedAt: new Date().toISOString() });
  };
  
  const filteredOrders = orders.filter((order) => {
    if (deliveryFilter === "all") return true;
    return order.status === deliveryFilter;
  });
  
  // Calculate pending and delivered counts
  const pendingCount = orders.filter((order) => order.status === "pending").length;
  const deliveredCount = orders.filter((order) => order.status === "delivered").length;
  
  // Calculate total people pending delivery
  const pendingPeople = orders
    .filter((order) => order.status === "pending")
    .reduce((acc, order) => acc + order.numberOfPeople, 0);

  // Search type options
  const searchTypeOptions = [
    { value: "serialNumber", label: "Serial Number" },
    { value: "name", label: "Customer Name" },
    { value: "houseNumber", label: "House Number" }
  ];

  // Get placeholder text based on search type
  const getPlaceholderText = () => {
    switch (searchType) {
      case "serialNumber":
        return "Enter Serial Number (e.g., SN-1001)";
      case "name":
        return "Enter Customer Name";
      case "houseNumber":
      default:
        return "Enter House Number (e.g., H-101)";
    }
  };

  return (
    <Layout role={userRole} projectName={projectName}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Delivery Status</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <PackageCheck className="mr-2 h-5 w-5 text-amber-500" />
                Pending Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingCount}</div>
              <p className="text-muted-foreground">
                {pendingPeople} people waiting
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Delivered Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{deliveredCount}</div>
              <p className="text-muted-foreground">
                {(deliveredCount / (pendingCount + deliveredCount) * 100).toFixed(0)}% completion rate
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Truck className="mr-2 h-5 w-5 text-primary" />
                Today's Deliveries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {orders.filter(
                  (order) => 
                    order.status === "delivered" && 
                    new Date(order.updatedAt).toDateString() === new Date().toDateString()
                ).length}
              </div>
              <p className="text-muted-foreground">out of {pendingCount + deliveredCount} total</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Update Delivery Status</CardTitle>
              <CardDescription>
                Search for an order by Serial Number, Customer Name, or House Number
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="search-type">Search by</Label>
                  <Select 
                    value={searchType} 
                    onValueChange={(value) => setSearchType(value as SearchType)}
                  >
                    <SelectTrigger id="search-type" className="w-full">
                      <SelectValue placeholder="Select search type" />
                    </SelectTrigger>
                    <SelectContent>
                      {searchTypeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Input
                      placeholder={getPlaceholderText()}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                  <Button onClick={handleSearch} disabled={isSearching || !searchQuery}>
                    {isSearching ? (
                      <span className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin mr-2" />
                    ) : (
                      <Search className="h-4 w-4 mr-2" />
                    )}
                    Search
                  </Button>
                </div>
                
                {currentOrder ? (
                  <div className="rounded-lg border p-4">
                    <div className="grid grid-cols-2 gap-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Serial Number</p>
                        <p className="font-medium">{currentOrder.serialNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">
                          {new Date(currentOrder.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Customer</p>
                        <p className="font-medium">{currentOrder.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">People</p>
                        <p className="font-medium">{currentOrder.numberOfPeople}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-medium">${currentOrder.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className="font-medium">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              currentOrder.status === "delivered"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
                            }`}
                          >
                            {currentOrder.status === "delivered" ? "Delivered" : "Pending"}
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button 
                        className="w-full"
                        disabled={currentOrder.status === "delivered"}
                        onClick={handleMarkDelivered}
                      >
                        {currentOrder.status === "delivered" ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Already Delivered
                          </>
                        ) : (
                          <>
                            <Truck className="h-4 w-4 mr-2" />
                            Mark as Delivered
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : isSearching ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                  </div>
                ) : searchQuery !== "" ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No orders found with {searchType === "serialNumber" ? "serial number" : 
                      searchType === "name" ? "customer name" : "house number"} "{searchQuery}"
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  View and manage recent delivery orders
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="status-filter" className="text-sm">Show:</Label>
                <select
                  id="status-filter"
                  className="text-sm border rounded px-2 py-1"
                  value={deliveryFilter}
                  onChange={(e) => setDeliveryFilter(e.target.value as any)}
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending Only</option>
                  <option value="delivered">Delivered Only</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <div className="overflow-y-auto max-h-[350px]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-2 text-left font-medium">House No.</th>
                        <th className="px-4 py-2 text-left font-medium">Customer</th>
                        <th className="px-4 py-2 text-left font-medium">Date</th>
                        <th className="px-4 py-2 text-left font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.slice(0, 10).map((order) => (
                        <tr 
                          key={order.id}
                          className={`border-t hover:bg-muted/30 transition-colors cursor-pointer ${
                            currentOrder?.id === order.id ? "bg-muted/50" : ""
                          }`}
                          onClick={() => {
                            setCurrentOrder(order);
                            setSearchQuery(
                              searchType === "serialNumber" ? order.serialNumber : 
                              searchType === "name" ? order.name : 
                              order.houseNumber
                            );
                          }}
                        >
                          <td className="px-4 py-2 font-medium">{order.houseNumber}</td>
                          <td className="px-4 py-2">{order.name}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {new Date(order.date).toLocaleDateString()}
                          </td>
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
                      
                      {filteredOrders.length === 0 && (
                        <tr>
                          <td 
                            colSpan={4} 
                            className="px-4 py-6 text-center text-muted-foreground"
                          >
                            No orders found with the selected filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DeliveryPage;
