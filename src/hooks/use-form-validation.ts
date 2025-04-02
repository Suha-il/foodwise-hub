
import { useState } from "react";
import { ZodSchema } from "zod";
import { showToast } from "@/components/ui/toast-container";

interface ValidationOptions<T> {
  schema: ZodSchema<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
}

export function useFormValidation<T>({ 
  schema, 
  onSuccess, 
  onError 
}: ValidationOptions<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = async (data: unknown) => {
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const validData = await schema.parseAsync(data);
      onSuccess?.(validData);
      return true;
    } catch (error: any) {
      const formattedErrors: Record<string, string> = {};
      
      if (error.errors) {
        error.errors.forEach((err: any) => {
          if (err.path.length > 0) {
            const path = err.path.join('.');
            formattedErrors[path] = err.message;
          }
        });
      }
      
      setErrors(formattedErrors);
      
      // Display the first error message as a toast
      if (Object.values(formattedErrors).length > 0) {
        showToast.error(Object.values(formattedErrors)[0]);
      } else {
        showToast.error("Validation failed");
      }
      
      onError?.(error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    errors,
    isSubmitting,
    validate,
    hasErrors: Object.keys(errors).length > 0,
  };
}
