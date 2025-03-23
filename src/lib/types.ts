
export type UserRole = "main_admin" | "admin" | "user";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  projectId?: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  ownerId: string;
  createdAt: string;
  lastActive: string;
}

export interface Order {
  id: string;
  serialNumber: string;
  date: string;
  houseNumber: string;
  name: string;
  numberOfPeople: number;
  amount: number;
  status: "pending" | "delivered";
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expenditure {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  projectId: string;
  createdAt: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenditure: number;
  balance: number;
}

export interface DeliveryStats {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalPeople: number;
  pendingPeople: number;
}
