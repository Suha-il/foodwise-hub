
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { UserRole } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpRight,
  Copy,
  Download,
  RefreshCw,
  Shield,
  User,
  UserCog,
  UserPlus,
  Users,
  X,
} from "lucide-react";

const ProjectPage = () => {
  const [userRole, setUserRole] = useState<UserRole>("main_admin");
  const [projectName, setProjectName] = useState("Food Delivery");
  const [projectCode, setProjectCode] = useState("");
  const [regeneratingCode, setRegeneratingCode] = useState(false);
  const [teamMembers, setTeamMembers] = useState<Array<{
    id: string;
    name: string;
    email: string;
    role: UserRole;
    joined: string;
  }>>([]);
  
  // In a real app, fetch this from localStorage or a state management solution
  useEffect(() => {
    const storedRole = localStorage.getItem("user_role") as UserRole | null;
    const storedName = localStorage.getItem("project_name");
    const storedCode = localStorage.getItem("project_code");
    
    if (storedRole) {
      setUserRole(storedRole);
    }
    
    if (storedName) {
      setProjectName(storedName);
    }
    
    if (storedCode) {
      setProjectCode(storedCode);
    }
    
    // Mock team members
    const mockMembers = [
      {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "main_admin" as UserRole,
        joined: "2023-08-01T10:00:00.000Z",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "admin" as UserRole,
        joined: "2023-08-02T11:30:00.000Z",
      },
      {
        id: "3",
        name: "Bob Johnson",
        email: "bob.johnson@example.com",
        role: "user" as UserRole,
        joined: "2023-08-03T14:45:00.000Z",
      },
      {
        id: "4",
        name: "Alice Williams",
        email: "alice.williams@example.com",
        role: "user" as UserRole,
        joined: "2023-08-04T09:15:00.000Z",
      },
    ];
    
    setTeamMembers(mockMembers);
  }, []);
  
  const handleRegenerateCode = () => {
    setRegeneratingCode(true);
    
    // In a real app, this would call an API
    setTimeout(() => {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const codeLength = 6;
      let newCode = "";
      
      for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        newCode += characters.charAt(randomIndex);
      }
      
      setProjectCode(newCode);
      localStorage.setItem("project_code", newCode);
      setRegeneratingCode(false);
    }, 1000);
  };
  
  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(projectCode);
    // In a real app, show a toast notification
  };
  
  const handleChangeRole = (userId: string, newRole: UserRole) => {
    // In a real app, this would call an API
    const updatedMembers = teamMembers.map((member) =>
      member.id === userId ? { ...member, role: newRole } : member
    );
    
    setTeamMembers(updatedMembers);
  };
  
  const handleRemoveMember = (userId: string) => {
    // In a real app, this would call an API
    const updatedMembers = teamMembers.filter((member) => member.id !== userId);
    setTeamMembers(updatedMembers);
  };
  
  const handleExportData = () => {
    // In a real app, this would call an API to export data
    alert("Data export feature would be implemented here.");
  };
  
  const handleDeleteProject = () => {
    // In a real app, this would call an API to delete the project
    alert("Project deletion would be implemented here.");
  };
  
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "main_admin":
        return <Shield className="h-4 w-4" />;
      case "admin":
        return <UserCog className="h-4 w-4" />;
      case "user":
        return <User className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case "main_admin":
        return "bg-primary/10 text-primary";
      case "admin":
        return "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300";
      case "user":
        return "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300";
      default:
        return "";
    }
  };

  return (
    <Layout role={userRole} projectName={projectName}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Project Settings</h1>
        </div>
        
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="team">Team Management</TabsTrigger>
            <TabsTrigger value="data">Data & Export</TabsTrigger>
            <TabsTrigger value="danger">Danger Zone</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
                <CardDescription>
                  View and manage basic project settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="project-code">Project Code</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="project-code"
                      value={projectCode}
                      readOnly
                      className="font-mono"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyCodeToClipboard}
                      title="Copy to clipboard"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleRegenerateCode}
                      disabled={regeneratingCode}
                    >
                      {regeneratingCode ? (
                        <span className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin mr-2" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Regenerate
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Share this code with your team members so they can join your project.
                    Regenerating the code will invalidate the old one.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Manage access and roles for your team
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Invite User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite Team Member</DialogTitle>
                      <DialogDescription>
                        Send an invitation to a new team member.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" placeholder="user@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <select
                          id="role"
                          className="w-full border rounded-md p-2"
                          defaultValue="user"
                        >
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
                        </select>
                        <p className="text-sm text-muted-foreground">
                          Admins can manage orders and finances. Users can only view and update delivery statuses.
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button>Send Invitation</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-muted-foreground">{member.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass(member.role)}`}>
                              {getRoleIcon(member.role)}
                              <span className="ml-1 capitalize">{member.role.replace("_", " ")}</span>
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(member.joined).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              {member.role !== "main_admin" && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <UserCog className="h-4 w-4" />
                                      <span className="sr-only">Change role</span>
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Change Role</DialogTitle>
                                      <DialogDescription>
                                        Update role for {member.name}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                      <div className="space-y-2">
                                        <Label htmlFor={`role-${member.id}`}>New Role</Label>
                                        <select
                                          id={`role-${member.id}`}
                                          className="w-full border rounded-md p-2"
                                          defaultValue={member.role}
                                          onChange={(e) => handleChangeRole(member.id, e.target.value as UserRole)}
                                        >
                                          <option value="admin">Admin</option>
                                          <option value="user">User</option>
                                        </select>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button>Save Changes</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              )}
                              
                              {member.role !== "main_admin" && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                      <X className="h-4 w-4" />
                                      <span className="sr-only">Remove</span>
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to remove {member.name} from this project?
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleRemoveMember(member.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Remove
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Export</CardTitle>
                <CardDescription>
                  Export your project data for backup or analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium mb-1">Orders Data</h3>
                    <p className="text-sm text-muted-foreground">
                      Export all order data including delivery status and customer details
                    </p>
                  </div>
                  <Button onClick={handleExportData}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
                
                <div className="rounded-lg border p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium mb-1">Financial Data</h3>
                    <p className="text-sm text-muted-foreground">
                      Export all financial data including income and expenditures
                    </p>
                  </div>
                  <Button onClick={handleExportData}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
                
                <div className="rounded-lg border p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium mb-1">Complete Project Backup</h3>
                    <p className="text-sm text-muted-foreground">
                      Export all project data including team members and settings
                    </p>
                  </div>
                  <Button onClick={handleExportData}>
                    <Download className="mr-2 h-4 w-4" />
                    Export All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="danger" className="space-y-6">
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  These actions are destructive and cannot be undone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border border-destructive/20 p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium mb-1">Deactivate Project</h3>
                    <p className="text-sm text-muted-foreground">
                      Temporarily deactivate this project. All data will be preserved but team members will no longer be able to access it.
                    </p>
                  </div>
                  <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                    Deactivate
                  </Button>
                </div>
                
                <div className="rounded-lg border border-destructive/20 p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium mb-1">Archive Project</h3>
                    <p className="text-sm text-muted-foreground">
                      Archive this project and all its data. You can restore it later if needed.
                    </p>
                  </div>
                  <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                    Archive
                  </Button>
                </div>
                
                <div className="rounded-lg border border-destructive/20 p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium mb-1">Delete Project</h3>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete this project and all associated data. This action cannot be undone.
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        Delete Forever
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. It will permanently delete the "{projectName}" project
                          and all of its data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteProject}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Yes, delete everything
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProjectPage;
