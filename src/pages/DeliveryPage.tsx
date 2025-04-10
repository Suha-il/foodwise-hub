
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/types";
import { CheckCircle, Clock, MapPin, Radio, Truck, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface DeliveryDriverProps {
  id: string;
  name: string;
  status: "available" | "delivering" | "offline";
  activeOrders: number;
  location: string;
  lastUpdate: string;
}

const drivers: DeliveryDriverProps[] = [
  {
    id: "D001",
    name: "John Smith",
    status: "delivering",
    activeOrders: 2,
    location: "Downtown",
    lastUpdate: "5 mins ago"
  },
  {
    id: "D002",
    name: "Maria Garcia",
    status: "available",
    activeOrders: 0,
    location: "North District",
    lastUpdate: "Just now"
  },
  {
    id: "D003",
    name: "Tanaka Yui",
    status: "available",
    activeOrders: 0,
    location: "West Side",
    lastUpdate: "3 mins ago"
  },
  {
    id: "D004",
    name: "Alex Johnson",
    status: "offline",
    activeOrders: 0,
    location: "East District",
    lastUpdate: "2 hours ago"
  },
  {
    id: "D005",
    name: "Sarah Miller",
    status: "delivering",
    activeOrders: 1,
    location: "South Area",
    lastUpdate: "10 mins ago"
  }
];

interface DeliveryProps {
  id: string;
  orderId: string;
  customer: string;
  status: "assigned" | "picked" | "in_transit" | "delivered" | "failed";
  address: string;
  driverId: string;
  estimatedTime: string;
}

const deliveries: DeliveryProps[] = [
  {
    id: "DEL-3921",
    orderId: "ORD-5932",
    customer: "Alice Johnson",
    status: "assigned",
    address: "123 Main St, Apt 4B",
    driverId: "D001",
    estimatedTime: "15-20 min"
  },
  {
    id: "DEL-3920",
    orderId: "ORD-5931",
    customer: "Bob Smith",
    status: "picked",
    address: "456 Oak Ave",
    driverId: "D001",
    estimatedTime: "10-15 min"
  },
  {
    id: "DEL-3919",
    orderId: "ORD-5930",
    customer: "Carol White",
    status: "in_transit",
    address: "789 Pine Blvd, Suite 3",
    driverId: "D005",
    estimatedTime: "5-10 min"
  },
  {
    id: "DEL-3918",
    orderId: "ORD-5928",
    customer: "Eva Green",
    status: "delivered",
    address: "202 Maple Rd",
    driverId: "D003",
    estimatedTime: "0 min"
  },
  {
    id: "DEL-3917",
    orderId: "ORD-5927",
    customer: "Frank Miller",
    status: "failed",
    address: "303 Cedar Ln",
    driverId: "D004",
    estimatedTime: "0 min"
  }
];

const DeliveryCard = ({ delivery }: { delivery: DeliveryProps }) => {
  const getStatusInfo = (status: DeliveryProps["status"]) => {
    switch (status) {
      case "assigned":
        return { 
          color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
          icon: <Clock className="h-3.5 w-3.5 mr-1" />,
          text: "Assigned" 
        };
      case "picked":
        return { 
          color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
          icon: <Truck className="h-3.5 w-3.5 mr-1" />,
          text: "Picked Up" 
        };
      case "in_transit":
        return { 
          color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
          icon: <Radio className="h-3.5 w-3.5 mr-1" />,
          text: "In Transit" 
        };
      case "delivered":
        return { 
          color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
          icon: <CheckCircle className="h-3.5 w-3.5 mr-1" />,
          text: "Delivered" 
        };
      case "failed":
        return { 
          color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
          icon: <Clock className="h-3.5 w-3.5 mr-1" />,
          text: "Failed" 
        };
      default:
        return { 
          color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300",
          icon: null,
          text: status 
        };
    }
  };
  
  const statusInfo = getStatusInfo(delivery.status);
  const driver = drivers.find(d => d.id === delivery.driverId);
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="text-sm font-medium">{delivery.id}</div>
          <div className="font-semibold">{delivery.customer}</div>
        </div>
        <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
          {statusInfo.icon}
          {statusInfo.text}
        </div>
      </div>
      
      <div className="mt-3 text-sm">
        <div className="flex items-start mb-1.5">
          <MapPin className="h-3.5 w-3.5 mr-1.5 mt-0.5 text-muted-foreground" />
          <span className="text-muted-foreground">{delivery.address}</span>
        </div>
        <div className="flex items-center mb-1.5">
          <User className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
          <span>{driver?.name || 'Unassigned'}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
          <span>ETA: {delivery.estimatedTime}</span>
        </div>
      </div>
      
      <div className="flex justify-between mt-4">
        <Button size="sm" variant="outline">View Order</Button>
        <Button size="sm">Track</Button>
      </div>
    </div>
  );
};

const DriverCard = ({ driver }: { driver: DeliveryDriverProps }) => {
  const getStatusColor = (status: DeliveryDriverProps["status"]) => {
    switch (status) {
      case "available": 
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "delivering": 
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "offline": 
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
      default: 
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-sm font-medium">{driver.id}</div>
          <div className="font-semibold">{driver.name}</div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(driver.status)}`}>
          {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
        </div>
      </div>
      
      <div className="text-sm">
        <div className="flex justify-between mb-1">
          <span className="text-muted-foreground">Location:</span>
          <span>{driver.location}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-muted-foreground">Active orders:</span>
          <span>{driver.activeOrders}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Last update:</span>
          <span>{driver.lastUpdate}</span>
        </div>
      </div>
      
      <div className="flex justify-between mt-4">
        <Button size="sm" variant="outline">Contact</Button>
        <Button size="sm">Assign Order</Button>
      </div>
    </div>
  );
};

export default function DeliveryPage() {
  const [role] = useState<UserRole>("admin");
  const isMobile = useIsMobile();
  
  return (
    <Layout role={role}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Delivery Management</h1>
          <Button>Create Manual Delivery</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">12</CardTitle>
              <CardDescription>Active Deliveries</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">3/5</CardTitle>
              <CardDescription>Drivers Online</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">24 min</CardTitle>
              <CardDescription>Avg Delivery Time</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">98%</CardTitle>
              <CardDescription>On-time Rate</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="deliveries" className="w-full">
          <TabsList className="bg-gray-100 dark:bg-gray-800 mb-4">
            <TabsTrigger value="deliveries">Active Deliveries</TabsTrigger>
            <TabsTrigger value="drivers">Drivers</TabsTrigger>
            <TabsTrigger value="history">Delivery History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deliveries" className="mt-0">
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Active Deliveries</CardTitle>
                <CardDescription>
                  Currently active deliveries that need to be fulfilled
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {deliveries
                    .filter(d => ["assigned", "picked", "in_transit"].includes(d.status))
                    .map(delivery => (
                      <DeliveryCard key={delivery.id} delivery={delivery} />
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="drivers" className="mt-0">
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Delivery Drivers</CardTitle>
                <CardDescription>
                  Manage your delivery drivers and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {drivers.map(driver => (
                    <DriverCard key={driver.id} driver={driver} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="mt-0">
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Delivery History</CardTitle>
                <CardDescription>
                  Past deliveries and their completion status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {deliveries
                    .filter(d => ["delivered", "failed"].includes(d.status))
                    .map(delivery => (
                      <DeliveryCard key={delivery.id} delivery={delivery} />
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
