
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RoleSelector from "@/components/auth/RoleSelector";
import ProjectSetupForm from "@/components/auth/ProjectSetupForm";
import ProjectJoin from "@/components/auth/ProjectJoin";
import { UserRole, Project, ProjectSummary } from "@/lib/types";
import Layout from "@/components/layout/Layout";
import ProjectCard from "@/components/project/ProjectCard";
import ProjectOverview from "@/components/project/ProjectOverview";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { showToast } from "@/components/ui/toast-container";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

type Step = "role_selection" | "project_setup" | "project_join" | "project_list" | "project_detail";

const Index = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("role_selection");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // In a real app, fetch user projects from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const storedRole = localStorage.getItem("user_role") as UserRole | null;
        const storedProjects = localStorage.getItem("user_projects");
        
        if (storedRole) {
          setSelectedRole(storedRole);
          
          if (storedProjects) {
            try {
              const parsedProjects = JSON.parse(storedProjects) as ProjectSummary[];
              setProjects(parsedProjects);
              setCurrentStep("project_list");
            } catch (error) {
              console.error("Failed to parse stored projects", error);
              showToast.error("Failed to load projects");
            }
          } else {
            // Generate mock projects for demo
            const mockProjects = generateMockProjects(storedRole);
            setProjects(mockProjects);
            localStorage.setItem("user_projects", JSON.stringify(mockProjects));
            setCurrentStep("project_list");
          }
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        showToast.error("Failed to load projects");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const generateMockProjects = (role: UserRole): ProjectSummary[] => {
    const projectCount = role === "main_admin" ? 3 : role === "admin" ? 2 : 1;
    
    return Array.from({ length: projectCount }, (_, i) => ({
      project: {
        id: `project-${i + 1}`,
        name: `Food Delivery Project ${i + 1}`,
        code: `PROJ${1000 + i}`,
        ownerId: "user-1",
        createdAt: new Date(2023, 6, 15 - i).toISOString(),
        lastActive: new Date().toISOString(),
        apiKey: role === "main_admin" ? "mock-api-key" : undefined,
        dbKey: role === "main_admin" ? "mock-db-key" : undefined
      },
      stats: {
        totalOrders: 50 + (i * 10),
        pendingDeliveries: 15 + (i * 5),
        totalIncome: 75000 + (i * 10000),
        totalExpenditure: 25000 + (i * 5000),
        balance: 50000 + (i * 5000)
      }
    }));
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === "main_admin") {
      setCurrentStep("project_setup");
    } else {
      setCurrentStep("project_join");
    }
  };

  const handleProjectSetupComplete = (name: string, code: string, apiKey?: string, dbKey?: string) => {
    try {
      // In a real app, save this to Supabase
      localStorage.setItem("user_role", selectedRole || "");
      
      const newProject: ProjectSummary = {
        project: {
          id: `project-${Date.now()}`,
          name,
          code,
          ownerId: "user-1",
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          apiKey,
          dbKey
        },
        stats: {
          totalOrders: 0,
          pendingDeliveries: 0,
          totalIncome: 0,
          totalExpenditure: 0,
          balance: 0
        }
      };
      
      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);
      localStorage.setItem("user_projects", JSON.stringify(updatedProjects));
      
      setCurrentStep("project_list");
      showToast.success("Project created successfully!");
    } catch (error) {
      console.error("Error creating project:", error);
      showToast.error("Failed to create project");
    }
  };

  const handleProjectJoinComplete = (code: string) => {
    try {
      // In a real app, validate this code against Supabase
      localStorage.setItem("user_role", selectedRole || "");
      
      const newProject: ProjectSummary = {
        project: {
          id: `project-joined-${Date.now()}`,
          name: "Joined Food Delivery Project",
          code: code,
          ownerId: "other-user",
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString()
        },
        stats: {
          totalOrders: 45,
          pendingDeliveries: 12,
          totalIncome: 65000,
          totalExpenditure: 25000,
          balance: 40000
        }
      };
      
      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);
      localStorage.setItem("user_projects", JSON.stringify(updatedProjects));
      
      setCurrentStep("project_list");
      showToast.success("Joined project successfully!");
    } catch (error) {
      console.error("Error joining project:", error);
      showToast.error("Failed to join project");
    }
  };

  const handleProjectSelect = (project: ProjectSummary) => {
    setSelectedProject(project);
    
    // Store the selected project in localStorage for use in other pages
    localStorage.setItem("selected_project", JSON.stringify(project));
    localStorage.setItem("project_name", project.project.name);
    localStorage.setItem("project_code", project.project.code);
    
    setCurrentStep("project_detail");
  };

  const handleDeleteProject = (projectId: string) => {
    try {
      const updatedProjects = projects.filter(p => p.project.id !== projectId);
      setProjects(updatedProjects);
      localStorage.setItem("user_projects", JSON.stringify(updatedProjects));
      showToast.success("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      showToast.error("Failed to delete project");
    }
  };

  const handleBackToProjectList = () => {
    setSelectedProject(null);
    setCurrentStep("project_list");
  };

  const handleAddNewProject = () => {
    if (selectedRole === "main_admin") {
      setCurrentStep("project_setup");
    } else {
      setCurrentStep("project_join");
    }
  };

  // If the user is viewing the project list
  if (currentStep === "project_list") {
    return (
      <ErrorBoundary>
        <Layout role={selectedRole || undefined} projectName="Project Dashboard">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold tracking-tight">Your Projects</h1>
              <Button onClick={handleAddNewProject}>
                <PlusCircle className="mr-2 h-5 w-5" />
                {selectedRole === "main_admin" ? "Create New Project" : "Join Project"}
              </Button>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-[200px] rounded-lg bg-gray-100 animate-pulse"></div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <h2 className="text-xl font-medium mb-2">No Projects Found</h2>
                <p className="text-muted-foreground">
                  {selectedRole === "main_admin" 
                    ? "Create your first project to get started"
                    : "Join a project using an invite code to get started"}
                </p>
                <Button className="mt-4" onClick={handleAddNewProject}>
                  <PlusCircle className="mr-2 h-5 w-5" />
                  {selectedRole === "main_admin" ? "Create New Project" : "Join Project"}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                  <div key={project.project.id} className="relative">
                    {selectedRole === "main_admin" && (
                      <div className="absolute top-2 right-2 z-10">
                        <ConfirmDialog
                          title="Delete Project"
                          description="Are you sure you want to delete this project? This action cannot be undone."
                          confirmLabel="Delete"
                          variant="destructive"
                          onConfirm={() => handleDeleteProject(project.project.id)}
                          trigger={
                            <Button variant="destructive" size="sm">
                              Delete
                            </Button>
                          }
                        />
                      </div>
                    )}
                    <ProjectCard 
                      key={project.project.id} 
                      projectSummary={project} 
                      onClick={() => handleProjectSelect(project)} 
                      index={index}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Layout>
      </ErrorBoundary>
    );
  }

  // If the user is viewing a specific project
  if (currentStep === "project_detail" && selectedProject) {
    return (
      <ErrorBoundary>
        <Layout role={selectedRole || undefined} projectName={selectedProject.project.name}>
          <ProjectOverview 
            projectSummary={selectedProject} 
            onBack={handleBackToProjectList}
            userRole={selectedRole || "user"}
          />
        </Layout>
      </ErrorBoundary>
    );
  }

  // Role selection and project setup/join steps
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {currentStep === "role_selection" && (
            <RoleSelector onRoleSelect={handleRoleSelect} />
          )}
          
          {currentStep === "project_setup" && (
            <ProjectSetupForm 
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
    </ErrorBoundary>
  );
};

export default Index;
