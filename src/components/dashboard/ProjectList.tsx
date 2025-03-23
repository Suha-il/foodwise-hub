
import { ProjectSummary } from "@/lib/types";
import ProjectCard from "@/components/project/ProjectCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectListProps {
  projects: ProjectSummary[];
  isLoading: boolean;
  onSelectProject: (project: ProjectSummary) => void;
}

export default function ProjectList({ projects, isLoading, onSelectProject }: ProjectListProps) {
  // Create loading skeletons
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-[200px] w-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  // No projects found
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No projects found</h3>
        <p className="text-muted-foreground mt-2">Create a new project to get started.</p>
      </div>
    );
  }

  // Render projects with virtualization for large lists
  return (
    <ScrollArea className="h-[calc(100vh-220px)]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.project.id}
            projectSummary={project}
            onClick={() => onSelectProject(project)}
            index={index}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
