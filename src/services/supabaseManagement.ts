
import { showToast } from "@/components/ui/toast-container";

interface CreateSupabaseProjectParams {
  name: string;
  organizationId?: string;
  dbPass?: string;
  region?: string;
}

interface SupabaseCredentials {
  apiUrl: string;
  apiKey: string;
  anonKey: string;
  serviceRoleKey: string;
  databaseUrl: string;
}

const SUPABASE_MANAGEMENT_API = "https://api.supabase.io/v1";

/**
 * Service for interacting with the Supabase Management API
 * This service is used to create and manage Supabase projects
 */
export const supabaseManagementService = {
  /**
   * Create a new Supabase project
   */
  async createProject(
    accessToken: string,
    params: CreateSupabaseProjectParams
  ): Promise<SupabaseCredentials | null> {
    try {
      // In a real implementation, this would call the Supabase Management API
      // For security reasons, these calls should be proxied through your own backend
      const response = await fetch("/api/supabase/create-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create Supabase project");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating Supabase project:", error);
      showToast.error(error instanceof Error ? error.message : "Failed to create Supabase project");
      return null;
    }
  },

  /**
   * Initialize database schema for a project
   */
  async initializeSchema(
    accessToken: string,
    projectRef: string,
    apiKey: string
  ): Promise<boolean> {
    try {
      // In a real implementation, this would apply SQL migrations to set up tables
      const response = await fetch("/api/supabase/initialize-schema", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ projectRef, apiKey }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to initialize database schema");
      }

      return true;
    } catch (error) {
      console.error("Error initializing schema:", error);
      showToast.error(
        error instanceof Error ? error.message : "Failed to initialize database schema"
      );
      return false;
    }
  },

  /**
   * Get organizations for the current user
   */
  async getOrganizations(accessToken: string): Promise<any[]> {
    try {
      const response = await fetch("/api/supabase/organizations", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch organizations");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching organizations:", error);
      showToast.error(
        error instanceof Error ? error.message : "Failed to fetch organizations"
      );
      return [];
    }
  },
};
