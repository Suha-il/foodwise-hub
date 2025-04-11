
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer } from "@/components/ui/toast-container";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";

// Lazy-loaded pages for better performance
const OrderPage = lazy(() => import("./pages/OrderPage"));
const DeliveryPage = lazy(() => import("./pages/DeliveryPage"));
const FinancePage = lazy(() => import("./pages/FinancePage"));
const StatsPage = lazy(() => import("./pages/StatsPage"));
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const ProjectSetupPage = lazy(() => import("./pages/ProjectSetupPage"));

const LoadingFallback = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-3 text-center"
    >
      <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-full border-3 sm:border-4 border-primary border-t-transparent animate-spin"></div>
      <p className="text-sm text-muted-foreground animate-pulse">Loading application...</p>
    </motion.div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingFallback />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const AppRoutes = () => (
  <AnimatePresence mode="wait">
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          } 
        />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/project-setup" element={<ProjectSetupPage />} />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/delivery" 
          element={
            <ProtectedRoute>
              <DeliveryPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/finance" 
          element={
            <ProtectedRoute>
              <FinancePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/stats" 
          element={
            <ProtectedRoute>
              <StatsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/project" 
          element={
            <ProtectedRoute>
              <ProjectPage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </AnimatePresence>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ToastContainer />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
