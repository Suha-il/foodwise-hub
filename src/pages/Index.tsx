
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RoleSelector from "@/components/auth/RoleSelector";
import ProjectSetup from "@/components/auth/ProjectSetup";
import ProjectJoin from "@/components/auth/ProjectJoin";
import { UserRole } from "@/lib/types";
import Layout from "@/components/layout/Layout";

type Step = "role_selection" | "project_setup" | "project_join" | "dashboard";

const Index = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("role_selection");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [projectName, setProjectName] = useState<string>("");
  const [projectCode, setProjectCode] = useState<string>("");

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === "main_admin") {
      setCurrentStep("project_setup");
    } else {
      setCurrentStep("project_join");
    }
  };

  const handleProjectSetupComplete = (name: string, code: string) => {
    setProjectName(name);
    setProjectCode(code);
    setCurrentStep("dashboard");
    // In a real app, we would save this to a database or state management
    localStorage.setItem("user_role", selectedRole || "");
    localStorage.setItem("project_name", name);
    localStorage.setItem("project_code", code);
    
    // Navigate to the orders page as a starting point
    navigate("/orders");
  };

  const handleProjectJoinComplete = (code: string) => {
    setProjectCode(code);
    setCurrentStep("dashboard");
    // In a real app, we would validate this code and fetch project details
    setProjectName("Food Delivery Project");
    localStorage.setItem("user_role", selectedRole || "");
    localStorage.setItem("project_code", code);
    localStorage.setItem("project_name", "Food Delivery Project");
    
    // Navigate to the orders page as a starting point
    navigate("/orders");
  };

  // If the user is already authenticated, show the dashboard
  if (currentStep === "dashboard") {
    return (
      <Layout role={selectedRole || undefined} projectName={projectName}>
        <div className="text-center">
          <h1 className="text-4xl font-bold">Welcome to your Dashboard</h1>
          <p className="text-xl text-gray-600 mt-4">
            Redirecting you to the orders page...
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {currentStep === "role_selection" && (
          <RoleSelector onRoleSelect={handleRoleSelect} />
        )}
        
        {currentStep === "project_setup" && (
          <ProjectSetup 
            onBack={() => setCurrentStep("role_selection")}
            onComplete={handleProjectSetupComplete}
          />
        )}
        
        {currentStep === "project_join" && (
          <ProjectJoin 
            onBack={() => setCurrentStep("role_selection")}
            onComplete={handleProjectJoinComplete}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
