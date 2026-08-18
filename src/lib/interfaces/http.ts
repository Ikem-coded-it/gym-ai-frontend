
export interface FetchRequestConfig extends RequestInit {
    timeout?: number;
    headers?: Record<string, string> | any;
    baseURL?: string;
    params?: Record<string, string | number | boolean>;
    /** Request path/URL (e.g. '/auth/me') for error handling */
    url?: string;
    /**
     * When true, a 401 response does not clear auth or redirect to home.
     * Use for flows where the UI should show the error in context (e.g. guest review).
     */
    skipAuthRedirect?: boolean;
  }
  
  export interface FetchResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: Headers;
    config: FetchRequestConfig;
    ok: boolean;
  }
  
  export interface HttpError extends Error {
    config: FetchRequestConfig;
    code?: string;
    response?: FetchResponse;
  }