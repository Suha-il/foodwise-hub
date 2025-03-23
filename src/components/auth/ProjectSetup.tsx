
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Copy, Eye, EyeOff } from "lucide-react";

interface ProjectSetupProps {
  onBack: () => void;
  onComplete: (projectName: string, projectCode: string, apiKey?: string, dbKey?: string) => void;
}

export default function ProjectSetup({ onBack, onComplete }: ProjectSetupProps) {
  const [projectName, setProjectName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectCode, setProjectCode] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [dbKey, setDbKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [showDbKey, setShowDbKey] = useState(false);

  const generateUniqueCode = () => {
    setIsGenerating(true);
    // In a real app, this would call an API to generate a unique code
    // For this demo, we'll create a random alphanumeric code
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const codeLength = 6;
    let code = "";
    
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    
    // Simulate API delay
    setTimeout(() => {
      setProjectCode(code);
      setIsGenerating(false);
    }, 800);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(projectCode);
    // In a real app, show a toast notification
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName && projectCode) {
      onComplete(projectName, projectCode, apiKey, dbKey);
    }
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
      
      <Card className="animation-slide-up">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Project</CardTitle>
          <CardDescription>
            Set up your food delivery project and invite your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="e.g., Downtown Food Delivery"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                  className="input-animated"
                />
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="project-code">Project Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="project-code"
                    placeholder="Generate unique code"
                    value={projectCode}
                    readOnly
                    className="input-animated font-mono"
                  />
                  {projectCode ? (
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
                      disabled={isGenerating || !projectName}
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
                <p className="text-xs text-muted-foreground">
                  Share this code with your team members so they can join your project
                </p>
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="supabase-api-key">Supabase API Key (Optional)</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="supabase-api-key"
                      type={showApiKey ? "text" : "password"}
                      placeholder="Enter your Supabase API key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="input-animated font-mono pr-10"
                    />
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
                </div>
                <p className="text-xs text-muted-foreground">
                  Your API key will be securely stored and used only for this project
                </p>
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="supabase-db-key">Supabase Database Key (Optional)</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="supabase-db-key"
                      type={showDbKey ? "text" : "password"}
                      placeholder="Enter your Supabase Database key"
                      value={dbKey}
                      onChange={(e) => setDbKey(e.target.value)}
                      className="input-animated font-mono pr-10"
                    />
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
                </div>
                <p className="text-xs text-muted-foreground">
                  Your Database key will be securely stored and used only for this project
                </p>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full mt-6"
              disabled={!projectName || !projectCode}
            >
              Create Project
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
