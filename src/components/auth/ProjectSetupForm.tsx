
import { useState } from "react";
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
import { ArrowLeft, Copy, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSetupSchema, ProjectSetupFormValues } from "./project-validation";
import { showToast } from "@/components/ui/toast-container";

interface ProjectSetupFormProps {
  onBack: () => void;
  onComplete: (projectName: string, projectCode: string, apiKey?: string, dbKey?: string) => void;
}

export default function ProjectSetupForm({ onBack, onComplete }: ProjectSetupFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showDbKey, setShowDbKey] = useState(false);

  const form = useForm<ProjectSetupFormValues>({
    resolver: zodResolver(projectSetupSchema),
    defaultValues: {
      projectName: "",
      projectCode: "",
      apiKey: "",
      dbKey: "",
    },
  });
  
  const generateUniqueCode = () => {
    setIsGenerating(true);
    // In a real app, this would call an API to generate a unique code
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const codeLength = 6;
    let code = "";
    
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    
    // Simulate API delay
    setTimeout(() => {
      form.setValue("projectCode", code);
      setIsGenerating(false);
    }, 800);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(form.getValues("projectCode"));
    showToast.success("Project code copied to clipboard");
  };

  const onSubmit = (data: ProjectSetupFormValues) => {
    onComplete(
      data.projectName,
      data.projectCode,
      data.apiKey || undefined,
      data.dbKey || undefined
    );
  };

  const toggleShowApiKey = () => setShowApiKey(!showApiKey);
  const toggleShowDbKey = () => setShowDbKey(!showDbKey);

  return (
    <div className="mx-auto max-w-md">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-4" 
        onClick={onBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="rounded-lg border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-card-foreground shadow animation-slide-up">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Create New Project</h3>
          <p className="text-sm text-muted-foreground">
            Set up your food delivery project and invite your team
          </p>
        </div>
        <div className="p-6 pt-0">
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
                        placeholder="e.g., Downtown Food Delivery" 
                        className="input-animated"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="projectCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Code</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          placeholder="Generate unique code"
                          readOnly
                          className="input-animated font-mono"
                          {...field}
                        />
                      </FormControl>
                      {field.value ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={copyToClipboard}
                          title="Copy to clipboard"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={generateUniqueCode}
                          disabled={isGenerating || !form.getValues("projectName")}
                        >
                          {isGenerating ? (
                            <>
                              <span className="mr-2 h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
                              Generating
                            </>
                          ) : (
                            "Generate"
                          )}
                        </Button>
                      )}
                    </div>
                    <FormDescription>
                      Share this code with your team members so they can join your project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supabase API Key (Optional)</FormLabel>
                    <div className="relative flex-1">
                      <FormControl>
                        <Input
                          type={showApiKey ? "text" : "password"}
                          placeholder="Enter your Supabase API key"
                          className="input-animated font-mono pr-10"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={toggleShowApiKey}
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <FormDescription>
                      Your API key will be securely stored and used only for this project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dbKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supabase Database Key (Optional)</FormLabel>
                    <div className="relative flex-1">
                      <FormControl>
                        <Input
                          type={showDbKey ? "text" : "password"}
                          placeholder="Enter your Supabase Database key"
                          className="input-animated font-mono pr-10"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={toggleShowDbKey}
                      >
                        {showDbKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <FormDescription>
                      Your Database key will be securely stored and used only for this project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="w-full"
                disabled={!form.formState.isValid || !form.getValues("projectCode")}
              >
                Create Project
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
