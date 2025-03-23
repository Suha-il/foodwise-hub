
import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  ClipboardList,
  TruckIcon,
  DollarSign,
  BarChart2,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/types";

interface LayoutProps {
  children: ReactNode;
  role?: UserRole;
  projectName?: string;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  allowedRoles: UserRole[];
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    path: "/",
    icon: Home,
    allowedRoles: ["main_admin", "admin", "user"],
  },
  {
    name: "Orders",
    path: "/orders",
    icon: ClipboardList,
    allowedRoles: ["main_admin", "admin", "user"],
  },
  {
    name: "Delivery",
    path: "/delivery",
    icon: TruckIcon,
    allowedRoles: ["main_admin", "admin", "user"],
  },
  {
    name: "Finance",
    path: "/finance",
    icon: DollarSign,
    allowedRoles: ["main_admin", "admin"],
  },
  {
    name: "Statistics",
    path: "/stats",
    icon: BarChart2,
    allowedRoles: ["main_admin", "admin", "user"],
  },
  {
    name: "Project Settings",
    path: "/project",
    icon: Settings,
    allowedRoles: ["main_admin"],
  },
];

export default function Layout({ children, role = "user", projectName = "Food Delivery" }: LayoutProps) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Handle animation mounting
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) =>
    item.allowedRoles.includes(role)
  );

  return (
    <div className={cn("min-h-screen bg-background flex", isMounted ? "opacity-100" : "opacity-0")}>
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:flex-shrink-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
            <h1 className="text-xl font-semibold text-sidebar-foreground truncate">{projectName}</h1>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-2">
            <ul className="space-y-1">
              {filteredNavItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      location.pathname === item.path
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Sidebar footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                {role === "main_admin" ? "MA" : role === "admin" ? "A" : "U"}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-sidebar-foreground capitalize">
                  {role.replace("_", " ")}
                </p>
                <button className="text-xs text-sidebar-foreground/70 flex items-center hover:text-primary">
                  <LogOut className="mr-1 h-3 w-3" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top navigation bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="flex h-16 items-center px-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="ml-auto flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString(undefined, { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="page-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
