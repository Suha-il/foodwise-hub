
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy-loaded pages for better performance
const OrderPage = lazy(() => import("./pages/OrderPage"));
const DeliveryPage = lazy(() => import("./pages/DeliveryPage"));
const FinancePage = lazy(() => import("./pages/FinancePage"));
const StatsPage = lazy(() => import("./pages/StatsPage"));
const ProjectPage = lazy(() => import("./pages/ProjectPage"));

const LoadingFallback = () => (
  <div className="min-h-screen flex flex-col items-center justify-center">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 text-center"
    >
      <div className="w-10 h-10 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      <p className="text-muted-foreground text-sm animate-pulse">Loading application...</p>
    </motion.div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      suspense: false, // We'll handle loading states manually for more control
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/orders" element={<OrderPage />} />
              <Route path="/delivery" element={<DeliveryPage />} />
              <Route path="/finance" element={<FinancePage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/project" element={<ProjectPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
