import { useAuth, useUser, useOrganization } from "@clerk/nextjs";
import { useCallback } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface UserResponse {
  id: string;
  clerk_id: string;
  email: string;
  name: string | null;
  is_active: boolean;
}

export interface OrganizationResponse {
  id: string;
  clerk_org_id: string;
  name: string;
  slug: string;
}

export interface OrganizationMembershipResponse {
  id: string;
  user_id: string;
  organization_id: string;
  role: string;
}

export class ApiError extends Error {
  status: number;
  info: unknown;
  constructor(message: string, status: number, info: unknown = null) {
    super(message);
    this.status = status;
    this.info = info;
  }
}

export function useApiClient() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const { organization, membership } = useOrganization();

  const request = useCallback(
    async <T>(path: string, options: RequestInit = {}): Promise<T> => {
      const token = await getToken();
      if (!token) {
        throw new ApiError("No active authentication token found.", 401);
      }

      // Build Headers
      const headers = new Headers(options.headers);
      headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");

      // Set Sync Headers if User is available
      if (user) {
        const primaryEmail = user.primaryEmailAddress?.emailAddress;
        if (primaryEmail) headers.set("X-User-Email", primaryEmail);
        if (user.fullName) headers.set("X-User-Name", user.fullName);
      }

      // Set Sync Headers if Organization is active
      if (organization) {
        headers.set("X-Org-Id", organization.id);
        headers.set("X-Org-Name", organization.name);
        headers.set("X-Org-Slug", organization.slug || "");
        
        if (membership && membership.role) {
          headers.set("X-Org-Role", membership.role);
        }
      }

      const url = `${API_BASE_URL}${path}`;
      
      try {
        const response = await fetch(url, {
          ...options,
          headers,
        });

        if (!response.ok) {
          let errorInfo = null;
          try {
            errorInfo = await response.json();
          } catch {
            // response was not JSON
          }
          throw new ApiError(
            errorInfo?.detail || `API Request failed with status ${response.status}`,
            response.status,
            errorInfo
          );
        }

        // Handle empty responses
        if (response.status === 204) {
          return {} as T;
        }

        return (await response.json()) as T;
      } catch (err: unknown) {
        if (err instanceof ApiError) {
          throw err;
        }
        const errMsg = err instanceof Error ? err.message : "Network error occurred";
        throw new ApiError(errMsg, 500);
      }
    },
    [getToken, user, organization, membership]
  );

  const get = useCallback(
    <T>(path: string, options?: Omit<RequestInit, "method">) =>
      request<T>(path, { ...options, method: "GET" }),
    [request]
  );

  const post = useCallback(
    <T>(path: string, body?: unknown, options?: Omit<RequestInit, "method" | "body">) =>
      request<T>(path, {
        ...options,
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
      }),
    [request]
  );

  const put = useCallback(
    <T>(path: string, body?: unknown, options?: Omit<RequestInit, "method" | "body">) =>
      request<T>(path, {
        ...options,
        method: "PUT",
        body: body ? JSON.stringify(body) : undefined,
      }),
    [request]
  );

  const del = useCallback(
    <T>(path: string, options?: Omit<RequestInit, "method">) =>
      request<T>(path, { ...options, method: "DELETE" }),
    [request]
  );

  return { get, post, put, del };
}
