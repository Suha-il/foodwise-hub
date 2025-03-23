
import { useQuery } from "@tanstack/react-query";
import { ProjectSummary } from "@/lib/types";

// Mock function to simulate API call
const fetchProjects = async (): Promise<ProjectSummary[]> => {
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock data
  return Array.from({ length: 3 }, (_, i) => ({
    project: {
      id: `project-${i + 1}`,
      name: `Food Delivery Project ${i + 1}`,
      code: `FD${1000 + i}`,
      ownerId: "user-1",
      createdAt: new Date(2023, 6, 15).toISOString(),
      lastActive: new Date().toISOString(),
      totalOrders: Math.floor(Math.random() * 100) + 50,
      pendingDeliveries: Math.floor(Math.random() * 20) + 5,
      balance: Math.floor(Math.random() * 50000) + 10000,
    },
    stats: {
      totalOrders: Math.floor(Math.random() * 100) + 50,
      pendingDeliveries: Math.floor(Math.random() * 20) + 5,
      totalIncome: Math.floor(Math.random() * 100000) + 50000,
      totalExpenditure: Math.floor(Math.random() * 50000) + 10000,
      balance: Math.floor(Math.random() * 50000) + 10000,
    }
  }));
};

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
