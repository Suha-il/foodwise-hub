
import { useIsMobile } from "@/hooks/use-mobile";
import ProjectSetupForm from "./ProjectSetupForm";

interface ProjectSetupProps {
  onBack: () => void;
  onComplete: (projectName: string, projectCode: string, apiKey?: string, dbKey?: string) => void;
}

export default function ProjectSetup({ onBack, onComplete }: ProjectSetupProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={isMobile ? "px-4" : ""}>
      <ProjectSetupForm onBack={onBack} onComplete={onComplete} />
    </div>
  );
}
