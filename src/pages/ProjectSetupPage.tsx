
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, SupabaseProject } from "@/contexts/AuthContext";
import SupabaseProjectSetupForm from "@/components/supabase/SupabaseProjectSetupForm";
import ProjectSetupForm from "@/components/auth/ProjectSetupForm";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { showToast } from "@/components/ui/toast-container";
import premiumFoodImg from "@/assets/premium-food.jpg";

enum SetupStep {
  SUPABASE_PROJECT,
  APP_PROJECT,
}

export default function ProjectSetupPage() {
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState<SetupStep>(SetupStep.SUPABASE_PROJECT);
  const [supabaseProject, setSupabaseProject] = useState<SupabaseProject | null>(null);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left side - Premium food image with overlay */}
      <div className="hidden md:block md:w-1/3 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
        <img 
          src={premiumFoodImg} 
          alt="Premium Food Experience" 
          className="object-cover h-full w-full"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-start z-20 p-8">
          <h2 className="text-4xl font-display font-bold text-white mb-4 max-w-xs">
            Create Your <span className="text-gold">Premium</span> Food Delivery Project
          </h2>
          <p className="text-gray-300 font-serif max-w-xs">
            Set up your platform to deliver exceptional culinary experiences to your customers.
          </p>
        </div>
      </div>

      {/* Right side - Setup form */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 md:p-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <motion.div
          initial="hidden"
          animate={mounted ? "visible" : "hidden"}
          variants={containerVariants}
          className="w-full max-w-2xl p-4 md:p-8"
        >
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-premium border border-gray-200/50 dark:border-gray-800/50 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <Button variant="ghost" size="sm" onClick={handleBack} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-display font-bold">Set Up Your Food Delivery Project</h1>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    step === SetupStep.SUPABASE_PROJECT 
                      ? "bg-gold shadow-sm shadow-gold/30" 
                      : "bg-gray-300 dark:bg-gray-700"
                  }`} />
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    step === SetupStep.APP_PROJECT 
                      ? "bg-gold shadow-sm shadow-gold/30" 
                      : "bg-gray-300 dark:bg-gray-700"
                  }`} />
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {step === SetupStep.SUPABASE_PROJECT && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <SupabaseProjectSetupForm 
                    onComplete={handleSupabaseSetupComplete} 
                    onSkip={handleSkipSupabaseSetup} 
                  />
                </motion.div>
              )}
              
              {step === SetupStep.APP_PROJECT && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h2 className="text-2xl font-display font-bold text-gradient-to-r from-gold to-gold-dark">Create Your Project</h2>
                    <p className="text-muted-foreground font-serif">
                      Set up your premium food delivery project and invite your team
                    </p>
                  </div>
                  
                  {supabaseProject && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg animate-fade-in">
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
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile tagline - visible only on small screens */}
      <div className="block md:hidden bg-black text-center p-4 border-t border-gray-800">
        <h3 className="font-display text-gold text-lg">Premium Food Delivery Solutions</h3>
      </div>
    </div>
  );
}
