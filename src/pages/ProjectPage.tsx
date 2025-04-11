
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { UserRole, ProjectSummary } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ProjectOverview from "@/components/project/ProjectOverview";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ProjectPage() {
  const [role] = useState<UserRole>("main_admin");
  const [projectName] = useState("Downtown Food Delivery");
  const isMobile = useIsMobile();
  
  // Create a mock projectSummary that matches the expected ProjectSummary type
  const projectSummary: ProjectSummary = {
    project: {
      id: "project-1",
      name: projectName,
      code: "ABC123",
      ownerId: "user-1",
      createdAt: new Date("2025-01-15").toISOString(),
      lastActive: new Date().toISOString(),
    },
    stats: {
      totalOrders: 1250,
      pendingDeliveries: 24,
      totalIncome: 125000,
      totalExpenditure: 45000,
      balance: 80000
    }
  };

  // Mock function for the onBack prop
  const handleBack = () => {
    console.log("Back button clicked");
  };

  return (
    <Layout role={role} projectName={projectName}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Project Settings</h1>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-gray-100 dark:bg-gray-800 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team Members</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
                <CardDescription>
                  View and manage your project details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectOverview 
                  projectSummary={projectSummary}
                  onBack={handleBack}
                  userRole={role}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="team">
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  Manage users who have access to this project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div>
                      <p className="font-medium">Admin Access Code</p>
                      <p className="text-sm text-muted-foreground">Share this code to invite admin team members</p>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center gap-2">
                      <div className="bg-white dark:bg-gray-900 px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 font-mono">
                        ABC123-ADMIN
                      </div>
                      <Button variant="outline" size="sm">Copy</Button>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div>
                      <p className="font-medium">User Access Code</p>
                      <p className="text-sm text-muted-foreground">Share this code to invite regular team members</p>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center gap-2">
                      <div className="bg-white dark:bg-gray-900 px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 font-mono">
                        ABC123-USER
                      </div>
                      <Button variant="outline" size="sm">Copy</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between border-t border-gray-200 dark:border-gray-800 pt-4">
                <div className="text-sm text-muted-foreground">
                  Total team members: 5 (1 main admin, 2 admins, 2 users)
                </div>
                <Button>Manage Team</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="api">
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage API keys for external integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div>
                      <p className="font-medium">Live API Key</p>
                      <p className="text-sm text-muted-foreground">Use for production environments</p>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center gap-2">
                      <div className="bg-white dark:bg-gray-900 px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 font-mono">
                        ●●●●●●●●●●●●●●●●
                      </div>
                      <Button variant="outline" size="sm">Show</Button>
                      <Button variant="outline" size="sm">Copy</Button>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div>
                      <p className="font-medium">Test API Key</p>
                      <p className="text-sm text-muted-foreground">Use for development and testing</p>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center gap-2">
                      <div className="bg-white dark:bg-gray-900 px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 font-mono">
                        ●●●●●●●●●●●●●●●●
                      </div>
                      <Button variant="outline" size="sm">Show</Button>
                      <Button variant="outline" size="sm">Copy</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t border-gray-200 dark:border-gray-800 pt-4">
                <Button variant="outline">
                  Regenerate Keys
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="billing">
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>
                  Manage your subscription and payment methods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium">Current Plan</h3>
                      <span className="bg-primary text-white text-xs font-medium px-2.5 py-1 rounded">Active</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                      <div>
                        <p className="text-2xl font-bold">Business Plan</p>
                        <p className="text-sm text-muted-foreground">$49/month • Renews on May 10, 2025</p>
                      </div>
                      <Button variant="outline">Change Plan</Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Payment Method</h3>
                    <div className="flex justify-between items-center p-3 border rounded-lg bg-white dark:bg-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 10/26</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-800 pt-4">
                <Button variant="outline" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20">
                  Cancel Subscription
                </Button>
                <Button>Download Invoices</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
