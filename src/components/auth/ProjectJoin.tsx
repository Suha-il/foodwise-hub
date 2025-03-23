
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
import { ArrowLeft } from "lucide-react";

interface ProjectJoinProps {
  onBack: () => void;
  onComplete: (projectCode: string) => void;
}

export default function ProjectJoin({ onBack, onComplete }: ProjectJoinProps) {
  const [projectCode, setProjectCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectCode) {
      setError("Please enter a project code");
      return;
    }
    
    setIsVerifying(true);
    setError("");
    
    // In a real app, this would verify the code with an API
    // For this demo, we'll simulate an API call
    setTimeout(() => {
      setIsVerifying(false);
      
      // For this demo, we'll accept any 6-character code
      if (projectCode.length === 6) {
        onComplete(projectCode);
      } else {
        setError("Invalid project code. Please check and try again.");
      }
    }, 1000);
  };

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
          <CardTitle className="text-2xl">Join Existing Project</CardTitle>
          <CardDescription>
            Enter the project code provided by your project administrator
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="project-code">Project Code</Label>
                <Input
                  id="project-code"
                  placeholder="Enter 6-character code"
                  value={projectCode}
                  onChange={(e) => {
                    setProjectCode(e.target.value.toUpperCase());
                    setError("");
                  }}
                  maxLength={6}
                  className={`input-animated font-mono uppercase text-center text-lg ${
                    error ? "border-destructive" : ""
                  }`}
                />
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Ask your project administrator for the 6-character project code
                </p>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full mt-6"
              disabled={isVerifying || projectCode.length !== 6}
            >
              {isVerifying ? (
                <>
                  <span className="mr-2 h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
                  Verifying
                </>
              ) : (
                "Join Project"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
