
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import premiumFoodImg from "@/assets/premium-food.jpg";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleLoginSuccess = () => {
    navigate("/");
  };

  const handleSignupSuccess = () => {
    navigate("/project-setup");
  };

  const switchToSignup = () => {
    setActiveTab("signup");
  };

  const switchToLogin = () => {
    setActiveTab("login");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Premium food image section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="md:w-1/2 relative hidden md:block bg-black"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/70 to-transparent z-10"></div>
        <img 
          src={premiumFoodImg} 
          alt="Premium Food Experience" 
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center z-20 p-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-5xl font-display font-semibold text-white mb-4 text-center"
          >
            Indulge in the Art of <span className="text-gold">Premium Dining</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg font-serif text-gray-200 max-w-md text-center"
          >
            Experience the luxury of exquisite cuisine delivered right to your doorstep.
          </motion.p>
        </div>
      </motion.div>

      {/* Auth form section */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-premium border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm"
          >
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-display font-bold mb-2 bg-gradient-to-r from-gold to-gold-dark bg-clip-text text-transparent">
                {activeTab === "login" ? "Welcome Back" : "Join the Experience"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 font-serif">
                {activeTab === "login" 
                  ? "Sign in to continue your premium food journey" 
                  : "Create an account to start your culinary adventure"}
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "signup")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <TabsTrigger 
                  value="login"
                  className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md transition-all duration-300"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="animate-fade-in">
                <LoginForm 
                  onLoginSuccess={handleLoginSuccess} 
                  onSwitchToSignup={switchToSignup} 
                />
              </TabsContent>
              <TabsContent value="signup" className="animate-fade-in">
                <SignupForm 
                  onSignupSuccess={handleSignupSuccess} 
                  onSwitchToLogin={switchToLogin} 
                />
              </TabsContent>
            </Tabs>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-8 text-sm text-muted-foreground"
          >
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </motion.p>
        </div>
      </div>

      {/* Mobile tagline - visible only on small screens */}
      <div className="block md:hidden bg-black text-center p-4 border-t border-gray-800">
        <h3 className="font-display text-gold text-lg">Indulge in the Art of Premium Dining</h3>
      </div>
    </div>
  );
}
