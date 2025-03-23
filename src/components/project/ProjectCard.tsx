
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectSummary } from "@/lib/types";
import { ArrowUpRight, Package, Clock, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProjectCardProps {
  projectSummary: ProjectSummary;
  onClick: () => void;
  index: number; // Added for staggered animations
}

export default function ProjectCard({ projectSummary, onClick, index }: ProjectCardProps) {
  const { project, stats } = projectSummary;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <Card 
        className="overflow-hidden cursor-pointer glass-card hover:shadow-glass-strong"
        onClick={onClick}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex justify-between items-center">
            <span className="truncate">{project.name}</span>
            <motion.div
              whileHover={{ x: 3, y: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ArrowUpRight className="h-4 w-4 text-primary" />
            </motion.div>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Code: <span className="font-mono">{project.code}</span>
          </p>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="font-medium">{stats.totalOrders}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="font-medium">{stats.pendingDeliveries}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 backdrop-blur-sm py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="font-medium">{formatCurrency(stats.balance)}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Last active: {formatDate(project.lastActive)}
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
