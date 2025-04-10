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
import { useIsMobile } from "@/hooks/use-mobile";

const DeliveryPage = () => {
  const [userRole, setUserRole] = useState<UserRole>("user");
  const [projectName, setProjectName] = useState("Food Delivery");
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("houseNumber");
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [deliveryFilter, setDeliveryFilter] = useState<"all" | "pending" | "delivered">("pending");
  const isMobile = useIsMobile();
  
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
    
    setTimeout(() => {
      let foundOrder: Order | undefined;
      
      switch (searchType) {
        case "serialNumber":
          foundOrder = orders.find(
            (order) => order.serialNumber.toLowerCase() === searchQuery.toLowerCase()
          );
          break;
        case "name":
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
    
    const updatedOrders = orders.map((order) =>
      order.id === currentOrder.id ? { ...order, status: "delivered" as const, updatedAt: new Date().toISOString() } : order
    );
    
    setOrders(updatedOrders);
    
    setCurrentOrder({ ...currentOrder, status: "delivered", updatedAt: new Date().toISOString() });
  };
  
  const filteredOrders = orders.filter((order) => {
    if (deliveryFilter === "all") return true;
    return order.status === deliveryFilter;
  });
  
  const pendingCount = orders.filter((order) => order.status === "pending").length;
  const deliveredCount = orders.filter((order) => order.status === "delivered").length;
  
  const pendingPeople = orders
    .filter((order) => order.status === "pending")
    .reduce((acc, order) => acc + order.numberOfPeople, 0);

  const searchTypeOptions = [
    { value: "serialNumber", label: "Serial Number" },
    { value: "name", label: "Customer Name" },
    { value: "houseNumber", label: "House Number" }
  ];

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
      <div className="space-y-4 md:space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Delivery Status</h1>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <Card className="bg-white dark:bg-gray-900 shadow-sm">
            <CardHeader className="pb-2 px-4 py-3 md:px-6 md:py-4">
              <CardTitle className="text-base md:text-xl flex items-center text-gray-900 dark:text-white">
                <PackageCheck className="mr-2 h-4 w-4 md:h-5 md:w-5 text-amber-500" />
                Pending Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 md:px-6">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{orders.filter(order => order.status === "pending").length}</div>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                {orders.filter(order => order.status === "pending").reduce((acc, order) => acc + order.numberOfPeople, 0)} people waiting
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-900 shadow-sm">
            <CardHeader className="pb-2 px-4 py-3 md:px-6 md:py-4">
              <CardTitle className="text-base md:text-xl flex items-center text-gray-900 dark:text-white">
                <CheckCircle className="mr-2 h-4 w-4 md:h-5 md:w-5 text-green-500" />
                Delivered Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 md:px-6">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{orders.filter(order => order.status === "delivered").length}</div>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                {(orders.filter(order => order.status === "delivered").length / (orders.length || 1) * 100).toFixed(0)}% completion rate
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-900 shadow-sm sm:col-span-2 md:col-span-1">
            <CardHeader className="pb-2 px-4 py-3 md:px-6 md:py-4">
              <CardTitle className="text-base md:text-xl flex items-center text-gray-900 dark:text-white">
                <Truck className="mr-2 h-4 w-4 md:h-5 md:w-5 text-primary" />
                Today's Deliveries
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 md:px-6">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {orders.filter(
                  (order) => 
                    order.status === "delivered" && 
                    new Date(order.updatedAt).toDateString() === new Date().toDateString()
                ).length}
              </div>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">out of {orders.length} total</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card className="bg-white dark:bg-gray-900 shadow-sm">
            <CardHeader className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-base md:text-lg text-gray-900 dark:text-white">Update Delivery Status</CardTitle>
              <CardDescription className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                Search for an order by Serial Number, Customer Name, or House Number
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 py-4 md:px-6">
              <div className="space-y-3 md:space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="search-type" className="text-sm text-gray-900 dark:text-white">Search by</Label>
                  <Select 
                    value={searchType} 
                    onValueChange={(value) => setSearchType(value as SearchType)}
                  >
                    <SelectTrigger id="search-type" className="w-full h-9 bg-white dark:bg-gray-800">
                      <SelectValue placeholder="Select search type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800">
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
                      className="h-9 bg-white dark:bg-gray-800"
                    />
                  </div>
                  <Button onClick={handleSearch} disabled={isSearching || !searchQuery} size={isMobile ? "sm" : "default"}>
                    {isSearching ? (
                      <span className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin mr-2" />
                    ) : (
                      <Search className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                    )}
                    Search
                  </Button>
                </div>
                
                {currentOrder ? (
                  <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-3 md:p-4">
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2 md:gap-y-3">
                      <div>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Serial Number</p>
                        <p className="text-sm md:text-base font-medium text-gray-900 dark:text-white">{currentOrder.serialNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Date</p>
                        <p className="text-sm md:text-base font-medium text-gray-900 dark:text-white">
                          {new Date(currentOrder.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Customer</p>
                        <p className="text-sm md:text-base font-medium text-gray-900 dark:text-white">{currentOrder.name}</p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">People</p>
                        <p className="text-sm md:text-base font-medium text-gray-900 dark:text-white">{currentOrder.numberOfPeople}</p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Amount</p>
                        <p className="text-sm md:text-base font-medium text-gray-900 dark:text-white">${currentOrder.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Status</p>
                        <p className="text-sm md:text-base font-medium">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
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
                    
                    <div className="mt-3 md:mt-4">
                      <Button 
                        className="w-full h-9"
                        disabled={currentOrder.status === "delivered"}
                        onClick={handleMarkDelivered}
                        size={isMobile ? "sm" : "default"}
                      >
                        {currentOrder.status === "delivered" ? (
                          <>
                            <CheckCircle className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                            Already Delivered
                          </>
                        ) : (
                          <>
                            <Truck className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                            Mark as Delivered
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : isSearching ? (
                  <div className="flex items-center justify-center py-6 md:py-8">
                    <div className="h-6 w-6 md:h-8 md:w-8 rounded-full border-3 border-primary border-t-transparent animate-spin"></div>
                  </div>
                ) : searchQuery !== "" ? (
                  <div className="text-center py-6 md:py-8 text-sm md:text-base text-gray-600 dark:text-gray-400">
                    No orders found with {searchType === "serialNumber" ? "serial number" : 
                      searchType === "name" ? "customer name" : "house number"} "{searchQuery}"
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-900 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 dark:border-gray-800">
              <div>
                <CardTitle className="text-base md:text-lg text-gray-900 dark:text-white">Recent Orders</CardTitle>
                <CardDescription className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  View and manage recent delivery orders
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="status-filter" className="text-xs md:text-sm hidden xs:inline text-gray-700 dark:text-gray-300">Show:</Label>
                <select
                  id="status-filter"
                  className="text-xs md:text-sm border rounded px-1.5 py-0.5 md:px-2 md:py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
                  value={deliveryFilter}
                  onChange={(e) => setDeliveryFilter(e.target.value as any)}
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </CardHeader>
            <CardContent className="px-3 md:px-6 py-3">
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-y-auto max-h-[280px] md:max-h-[350px]">
                  <table className="w-full text-xs md:text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <th className="px-2 md:px-4 py-1.5 md:py-2 text-left font-medium text-gray-700 dark:text-gray-300">House No.</th>
                        <th className="px-2 md:px-4 py-1.5 md:py-2 text-left font-medium text-gray-700 dark:text-gray-300">Customer</th>
                        <th className="px-2 md:px-4 py-1.5 md:py-2 text-left font-medium text-gray-700 dark:text-gray-300">Date</th>
                        <th className="px-2 md:px-4 py-1.5 md:py-2 text-left font-medium text-gray-700 dark:text-gray-300">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.filter(order => {
                        if (deliveryFilter === "all") return true;
                        return order.status === deliveryFilter;
                      }).slice(0, 10).map((order) => (
                        <tr 
                          key={order.id}
                          className={`border-t hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${
                            currentOrder?.id === order.id ? "bg-gray-100 dark:bg-gray-800/70" : ""
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
                          <td className="px-2 md:px-4 py-1.5 md:py-2 font-medium text-gray-900 dark:text-white">{order.houseNumber}</td>
                          <td className="px-2 md:px-4 py-1.5 md:py-2 text-gray-700 dark:text-gray-300">{order.name}</td>
                          <td className="px-2 md:px-4 py-1.5 md:py-2 whitespace-nowrap text-gray-700 dark:text-gray-300">
                            {new Date(order.date).toLocaleDateString()}
                          </td>
                          <td className="px-2 md:px-4 py-1.5 md:py-2 text-gray-700 dark:text-gray-300">
                            <span
                              className={`inline-block w-1.5 h-1.5 md:w-2 md:h-2 rounded-full mr-1 ${
                                order.status === "delivered" ? "bg-green-500" : "bg-amber-500"
                              }`}
                            ></span>
                            {order.status === "delivered" ? "Delivered" : "Pending"}
                          </td>
                        </tr>
                      ))}
                      
                      {orders.filter(order => {
                        if (deliveryFilter === "all") return true;
                        return order.status === deliveryFilter;
                      }).length === 0 && (
                        <tr>
                          <td 
                            colSpan={4} 
                            className="px-2 md:px-4 py-4 md:py-6 text-center text-xs md:text-sm text-gray-600 dark:text-gray-400"
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
