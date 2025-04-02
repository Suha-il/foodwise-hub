
import { toast, Toaster } from "sonner";

export function ToastContainer() {
  return (
    <Toaster 
      position="top-right"
      toastOptions={{
        duration: 4000,
        className: "text-sm",
      }}
    />
  );
}

// Helper functions to display consistent toast notifications
export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  warning: (message: string) => toast.warning(message),
  info: (message: string) => toast.info(message),
};
