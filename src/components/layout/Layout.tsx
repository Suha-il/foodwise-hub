
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
      {/* Sidebar - Updated with solid background */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-60 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:flex-shrink-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 border-b border-gray-200 dark:border-gray-800">
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{projectName}</h1>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-3 px-2">
            <ul className="space-y-1">
              {filteredNavItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      location.pathname === item.path
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <item.icon className="mr-2.5 h-4 w-4" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Sidebar footer */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs sm:text-sm">
                {role === "main_admin" ? "MA" : role === "admin" ? "A" : "U"}
              </div>
              <div className="ml-2 sm:ml-3">
                <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {role.replace("_", " ")}
                </p>
                <button className="text-xs text-gray-700 dark:text-gray-300 flex items-center hover:text-primary">
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
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content - Updated with solid background */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top navigation bar */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="flex h-14 sm:h-16 items-center px-3 sm:px-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="ml-auto flex items-center space-x-3 sm:space-x-4">
              <span className="hidden sm:inline text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {new Date().toLocaleDateString(undefined, { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              <span className="inline sm:hidden text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
          <div className="page-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
