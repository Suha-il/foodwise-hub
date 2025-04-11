
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Database, Key, Check } from "lucide-react";
import { useAuth, SupabaseProject } from "@/contexts/AuthContext";
import { showToast } from "@/components/ui/toast-container";

const projectSetupSchema = z.object({
  projectName: z.string()
    .min(3, "Project name must be at least 3 characters long")
    .max(50, "Project name must be less than 50 characters"),
});

type ProjectSetupFormValues = z.infer<typeof projectSetupSchema>;

interface SupabaseProjectSetupFormProps {
  onComplete: (project: SupabaseProject) => void;
  onSkip: () => void;
}

export default function SupabaseProjectSetupForm({ onComplete, onSkip }: SupabaseProjectSetupFormProps) {
  const { createSupabaseProject } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [creationStep, setCreationStep] = useState<
    "waiting" | "creating" | "initializing" | "completed"
  >("waiting");

  const form = useForm<ProjectSetupFormValues>({
    resolver: zodResolver(projectSetupSchema),
    defaultValues: {
      projectName: "",
    },
  });

  const onSubmit = async (data: ProjectSetupFormValues) => {
    try {
      setIsCreating(true);
      setCreationStep("creating");
      
      // Create the Supabase project
      const project = await createSupabaseProject(data.projectName);
      
      if (!project) {
        throw new Error("Failed to create Supabase project");
      }
      
      // Simulate initializing the database schema
      setCreationStep("initializing");
      
      // In a real implementation, this would call your backend to set up tables
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCreationStep("completed");
      showToast.success("Supabase project created and initialized successfully");
      
      onComplete(project);
    } catch (error) {
      console.error("Error setting up Supabase project:", error);
      showToast.error(error instanceof Error ? error.message : "Failed to set up Supabase project");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Set Up Your Supabase Project</h2>
        <p className="text-muted-foreground">
          This will create a new Supabase project for your food delivery management system
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="projectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="My Food Delivery App" 
                    className="input-animated"
                    disabled={isCreating}
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  This will be used to identify your project in Supabase and in this app
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {creationStep !== "waiting" && (
            <div className="space-y-3 mt-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
              <h3 className="font-medium">Project Creation Progress</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  {creationStep === "creating" ? (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  ) : creationStep === "initializing" || creationStep === "completed" ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                  )}
                  <span className={creationStep === "creating" ? "text-primary font-medium" : ""}>
                    Creating Supabase project
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  {creationStep === "initializing" ? (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  ) : creationStep === "completed" ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                  )}
                  <span className={creationStep === "initializing" ? "text-primary font-medium" : ""}>
                    Initializing database schema
                  </span>
                </li>
              </ul>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onSkip}
              disabled={isCreating}
            >
              Skip for now
            </Button>
            <Button
              type="submit"
              disabled={isCreating || !form.formState.isValid}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Create Supabase Project
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
