
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
import { UserRole } from "@/lib/types";
import { motion } from "framer-motion";
import { Shield, Users, User } from "lucide-react";

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void;
}

const roles: Array<{ id: UserRole; title: string; description: string; icon: any }> = [
  {
    id: "main_admin",
    title: "Main Admin",
    description: "Full control over projects, users, and finances",
    icon: Shield,
  },
  {
    id: "admin",
    title: "Admin",
    description: "Manage orders and finances",
    icon: Users,
  },
  {
    id: "user",
    title: "User",
    description: "View and update delivery statuses",
    icon: User,
  },
];

export default function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Welcome</h2>
        <p className="text-muted-foreground mt-2">
          Select your role to get started
        </p>
      </div>

      <div className="space-y-4">
        {roles.map((role) => (
          <Card
            key={role.id}
            className={`cursor-pointer transition-all duration-300 ${
              selectedRole === role.id
                ? "ring-2 ring-primary shadow-xl"
                : "hover:border-primary/50"
            }`}
            onClick={() => setSelectedRole(role.id)}
          >
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div
                className={`rounded-full p-2 ${
                  selectedRole === role.id
                    ? "bg-primary text-white"
                    : "bg-muted"
                }`}
              >
                <role.icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl">{role.title}</CardTitle>
              </div>
              {selectedRole === role.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto h-5 w-5 rounded-full bg-primary flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3 text-white"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </motion.div>
              )}
            </CardHeader>
            <CardContent>
              <CardDescription>{role.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Button
          className="w-full"
          size="lg"
          disabled={!selectedRole}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
