
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { showToast } from "@/components/ui/toast-container";
import { UserRole } from "@/lib/types";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  supabaseProjects?: SupabaseProject[];
}

export interface SupabaseProject {
  id: string;
  name: string;
  apiUrl: string;
  apiKey: string;
  anonKey: string;
  databaseUrl?: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  signup: (email: string, password: string, name: string) => Promise<User | null>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
  createSupabaseProject: (projectName: string) => Promise<SupabaseProject | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on page load
    const checkSession = async () => {
      setIsLoading(true);
      try {
        // In a full implementation, this would check with your backend
        // For now, we'll check localStorage as a demonstration
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call your backend API
      // For demo purposes, we'll simulate a successful login
      const mockUser: User = {
        id: "user-" + Date.now().toString(),
        email,
        role: "main_admin",
        supabaseProjects: [],
      };
      
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("user_role", mockUser.role);
      
      showToast.success("Logged in successfully");
      return mockUser;
    } catch (error) {
      console.error("Login error:", error);
      showToast.error(error instanceof Error ? error.message : "Login failed");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<User | null> => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call your backend API
      // For demo purposes, we'll simulate a successful signup
      const mockUser: User = {
        id: "user-" + Date.now().toString(),
        email,
        name,
        role: "main_admin",
        supabaseProjects: [],
      };
      
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("user_role", mockUser.role);
      
      showToast.success("Account created successfully");
      return mockUser;
    } catch (error) {
      console.error("Signup error:", error);
      showToast.error(error instanceof Error ? error.message : "Signup failed");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // In a real implementation, this would call your backend API
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_projects");
      localStorage.removeItem("selected_project");
      
      showToast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      showToast.error(error instanceof Error ? error.message : "Logout failed");
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      if (!user) throw new Error("No user logged in");
      
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      showToast.success("User profile updated");
    } catch (error) {
      console.error("Update user error:", error);
      showToast.error(error instanceof Error ? error.message : "Failed to update user");
    }
  };

  const createSupabaseProject = async (projectName: string): Promise<SupabaseProject | null> => {
    try {
      if (!user) throw new Error("No user logged in");
      
      // In a real implementation, this would call your backend API
      // which would then interact with the Supabase Management API
      
      // For demo purposes, we'll create a mock project
      const mockProject: SupabaseProject = {
        id: "proj-" + Date.now().toString(),
        name: projectName,
        apiUrl: `https://mock-${projectName.toLowerCase().replace(/\s+/g, '-')}.supabase.co`,
        apiKey: "mock-api-key-" + Math.random().toString(36).substring(2, 15),
        anonKey: "mock-anon-key-" + Math.random().toString(36).substring(2, 15),
        databaseUrl: `postgresql://postgres:password@db.mock-${projectName.toLowerCase().replace(/\s+/g, '-')}.supabase.co:5432/postgres`,
        isActive: true,
      };
      
      // Update user with the new project
      const updatedUser = { 
        ...user, 
        supabaseProjects: [...(user.supabaseProjects || []), mockProject] 
      };
      
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      showToast.success("Supabase project created successfully");
      return mockProject;
    } catch (error) {
      console.error("Create Supabase project error:", error);
      showToast.error(error instanceof Error ? error.message : "Failed to create Supabase project");
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateUser,
        createSupabaseProject,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
