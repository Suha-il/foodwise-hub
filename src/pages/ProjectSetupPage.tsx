
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, SupabaseProject } from "@/contexts/AuthContext";
import SupabaseProjectSetupForm from "@/components/supabase/SupabaseProjectSetupForm";
import ProjectSetupForm from "@/components/auth/ProjectSetupForm";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { showToast } from "@/components/ui/toast-container";

enum SetupStep {
  SUPABASE_PROJECT,
  APP_PROJECT,
}

export default function ProjectSetupPage() {
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState<SetupStep>(SetupStep.SUPABASE_PROJECT);
  const [supabaseProject, setSupabaseProject] = useState<SupabaseProject | null>(null);
  const navigate = useNavigate();

  // If not authenticated, redirect to auth page
  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  const handleSupabaseSetupComplete = (project: SupabaseProject) => {
    setSupabaseProject(project);
    setStep(SetupStep.APP_PROJECT);
  };

  const handleSkipSupabaseSetup = () => {
    showToast.info("Skipped Supabase setup. You can set it up later in Project Settings.");
    setStep(SetupStep.APP_PROJECT);
  };

  const handleProjectSetupComplete = (
    projectName: string,
    projectCode: string,
    apiKey?: string,
    dbKey?: string
  ) => {
    // In a real implementation, this would call your backend to create the project
    // and link it to the Supabase project
    
    showToast.success("Project created successfully!");
    navigate("/");
  };

  const handleBack = () => {
    if (step === SetupStep.APP_PROJECT) {
      setStep(SetupStep.SUPABASE_PROJECT);
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50 dark:bg-gray-950">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <Button variant="ghost" size="sm" onClick={handleBack} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">Set Up Your Food Delivery Project</h1>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  step === SetupStep.SUPABASE_PROJECT 
                    ? "bg-primary" 
                    : "bg-gray-300 dark:bg-gray-700"
                }`} />
                <div className={`w-3 h-3 rounded-full ${
                  step === SetupStep.APP_PROJECT 
                    ? "bg-primary" 
                    : "bg-gray-300 dark:bg-gray-700"
                }`} />
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {step === SetupStep.SUPABASE_PROJECT && (
              <SupabaseProjectSetupForm 
                onComplete={handleSupabaseSetupComplete} 
                onSkip={handleSkipSupabaseSetup} 
              />
            )}
            
            {step === SetupStep.APP_PROJECT && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Create Your Project</h2>
                  <p className="text-muted-foreground">
                    Set up your food delivery project and invite your team
                  </p>
                </div>
                
                {supabaseProject && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-300 flex items-center">
                      <Check className="mr-2 h-4 w-4" />
                      Supabase Project Connected
                    </h3>
                    <p className="mt-1 text-sm text-green-700 dark:text-green-400">
                      {supabaseProject.name} is connected and ready to use
                    </p>
                  </div>
                )}
                
                <ProjectSetupForm 
                  onBack={() => setStep(SetupStep.SUPABASE_PROJECT)} 
                  onComplete={handleProjectSetupComplete} 
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
