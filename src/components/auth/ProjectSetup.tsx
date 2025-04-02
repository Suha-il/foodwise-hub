
import ProjectSetupForm from "./ProjectSetupForm";

interface ProjectSetupProps {
  onBack: () => void;
  onComplete: (projectName: string, projectCode: string, apiKey?: string, dbKey?: string) => void;
}

export default function ProjectSetup({ onBack, onComplete }: ProjectSetupProps) {
  return <ProjectSetupForm onBack={onBack} onComplete={onComplete} />;
}
