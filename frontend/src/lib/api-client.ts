export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: unknown;
}

export interface HealthData {
  status: 'healthy' | 'degraded';
  timestamp: string;
  uptime: number;
  environment: string;
  database: {
    connected: boolean;
    provider: string;
    responseTimeMs?: number;
    error?: string;
  };
  app: {
    name: string;
    version: string;
  };
}

export class ApiClient {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
        credentials: 'include',
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || `API error with status ${response.status}`);
      }

      return json as ApiResponse<T>;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred while communicating with the server.');
    }
  }

  static async getHealth(): Promise<ApiResponse<HealthData>> {
    return this.request<HealthData>('/health');
  }
}

export default ApiClient;
