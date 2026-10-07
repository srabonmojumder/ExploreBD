export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://explorebd-fc0r.onrender.com/api';

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

export type PlaceCategory =
  | 'WATERFALL'
  | 'BEACH'
  | 'PARK'
  | 'HILL'
  | 'FOREST'
  | 'HISTORICAL'
  | 'MUSEUM'
  | 'RELIGIOUS'
  | 'LAKE'
  | 'RIVER'
  | 'ADVENTURE'
  | 'RESORT'
  | 'OTHER';

export interface Division {
  id: string;
  name: string;
  bnName: string | null;
  slug: string;
  code: string | null;
  description: string | null;
  image: string | null;
  _count: {
    districts: number;
    places: number;
  };
}

export interface District {
  id: string;
  name: string;
  bnName: string | null;
  slug: string;
  description: string | null;
  coverImage: string | null;
  latitude: number | null;
  longitude: number | null;
  division: {
    name: string;
    bnName: string | null;
    slug: string;
  };
  _count: {
    places: number;
  };
}

export interface Place {
  id: string;
  name: string;
  bnName: string | null;
  slug: string;
  description: string;
  coverImage: string | null;
  category: PlaceCategory;
  averageRating: number;
  totalVisitors: number;
  latitude: number;
  longitude: number;
  district: {
    name: string;
    bnName: string | null;
    slug: string;
  };
  division: {
    name: string;
    bnName: string | null;
    slug: string;
  };
  images: Array<{
    url: string;
    caption: string | null;
  }>;
  _count: {
    visits: number;
    reviews: number;
  };
}

export interface DistrictDetail extends District {
  division: {
    id: string;
    name: string;
    bnName: string | null;
    slug: string;
    description: string | null;
  };
  places: Place[];
  stats: {
    totalPlaces: number;
    exploredPlaces: number;
    explorationPercentage: number;
  };
  popularPlaces: Place[];
}

export interface PlaceDetail extends Place {
  district: {
    id: string;
    name: string;
    bnName: string | null;
    slug: string;
    description: string | null;
    coverImage: string | null;
  };
  division: {
    id: string;
    name: string;
    bnName: string | null;
    slug: string;
    code: string | null;
  };
  images: Array<{
    id: string;
    url: string;
    caption: string | null;
    isCover: boolean;
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: {
      id: string;
      name: string;
      username: string;
      avatar: string | null;
    };
  }>;
  recommended: Array<{
    id: string;
    name: string;
    slug: string;
    coverImage: string | null;
    averageRating: number;
    category: PlaceCategory;
    district: {
      name: string;
      slug: string;
    };
    images: Array<{ url: string }>;
  }>;
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

  static async getDivisions(): Promise<ApiResponse<Division[]>> {
    return this.request<Division[]>('/divisions');
  }

  static async getDivisionBySlug(slug: string): Promise<ApiResponse<Division & { districts: District[]; places: Place[] }>> {
    return this.request(`/divisions/${slug}`);
  }

  static async getDistricts(params?: {
    division?: string;
    search?: string;
  }): Promise<ApiResponse<District[]>> {
    const searchParams = new URLSearchParams();
    if (params?.division) searchParams.set('division', params.division);
    if (params?.search) searchParams.set('search', params.search);
    const qs = searchParams.toString();
    return this.request<District[]>(`/districts${qs ? `?${qs}` : ''}`);
  }

  static async getDistrictBySlug(slug: string): Promise<ApiResponse<DistrictDetail>> {
    return this.request<DistrictDetail>(`/districts/${slug}`);
  }

  static async getPlaces(params?: {
    category?: string;
    district?: string;
    division?: string;
    search?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Place[]>> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.district) searchParams.set('district', params.district);
    if (params?.division) searchParams.set('division', params.division);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    const qs = searchParams.toString();
    return this.request<Place[]>(`/places${qs ? `?${qs}` : ''}`);
  }

  static async getPlaceBySlug(slug: string): Promise<ApiResponse<PlaceDetail>> {
    return this.request<PlaceDetail>(`/places/${slug}`);
  }
}

export default ApiClient;
