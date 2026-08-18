import { getAuthToken, clearAuthState } from "../utils/auth";
import ApplicationRoutes from "../config/routes";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import {
  FetchRequestConfig,
  FetchResponse,
  HttpError,
} from "../lib/interfaces/http";

/* --- CONFIGURATION --- */

const BASE_URL = process.env.BASE_API_URL || "";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

/* --- INTERCEPTORS LOGIC --- */

/**
 * Mimics axios request interceptor
 * Handles Auth Token injection and default Timeouts
 */
export const handleRequestInterceptor = (
  config: FetchRequestConfig
): FetchRequestConfig => {
  const newConfig = { ...config };

  // 1. Headers Setup
  newConfig.headers = {
    ...DEFAULT_HEADERS,
    requestSession: JSON.stringify({
      processId: Date.now(),
      userSystemId: uuid(),
    }),
    ...newConfig.headers,
    "ngrok-skip-browser-warning": "69420",
  };

  // 2. Auth Token
  if (
    !newConfig.headers["Authorization"] &&
    !newConfig.headers["authorization"]
  ) {
    const token = getAuthToken()?.token;
    console.log('token', token);
    if (token) {
      newConfig.headers["Authorization"] = `Bearer ${token}`;
    }
  }

  // 3. Timeout Default (10s for GET if not specified)
  /*  if (!newConfig.timeout && newConfig.method === 'GET') {
    newConfig.timeout = 10000;
  }
 */
  return newConfig;
};

/**
 * Mimics axios response interceptor
 * Handles global error codes (401, 500) and network issues
 */
export const handleResponseError = async (error: HttpError | any) => {
  const response = error.response;

  // 1. Handle 401 Unauthorized
  if (response?.status === 401) {
    const isAuthLogoutRequest = error?.config?.url?.includes?.("/auth/logout");

    if (isAuthLogoutRequest) {
      throw error;
    }

    if (error?.config?.skipAuthRedirect === true) {
      throw error;
    }

    const requestUrl = String(error?.config?.url ?? "");
    /** Auth flows that may return 401 without meaning “session expired” — never redirect away. */
    if (
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/verify-email") ||
      requestUrl.includes("/auth/resend-verification-email") ||
      requestUrl.includes("/auth/forgot-password")
    ) {
      throw error;
    }

    const pathname = window?.location?.pathname;
    const isAuthMeRequest = error?.config?.url?.includes?.("/auth/me");

    if (
      !pathname?.includes("verify") &&
      !pathname?.includes("login") &&
      !pathname?.includes("logout")
    ) {
      clearAuthState();
      if (!isAuthMeRequest) {
        window.location.href = `${window.location.origin}${ApplicationRoutes.HOME}`;
      }
    }
    throw error;
  }

  // 2. Handle 500 Server Error
  if (response?.status === 500) {
    toast.error("Something went wrong!");
  }

  // 3. Connectivity Issues (Network Errors)
  // Fetch throws TypeError on network failure, mimicking ENOTFOUND
  if (error.name === "TypeError" && error.message === "Failed to fetch") {
    toast.error("Experiencing issues with connectivity");
  }

  // 4. Aborted Requests
  if (error.name === "AbortError") {
    // console.log('Request canceled');
  }

  throw error;
};

/* --- CORE FETCH WRAPPER --- */

const $http = async <T = any>(
  endpoint: string,
  config: FetchRequestConfig = {}
): Promise<FetchResponse<T>> => {
  // Apply Request Interceptor
  const finalConfig = handleRequestInterceptor({
    ...config,
    method: config.method || "GET",
    url: endpoint,
  });

  // Construct URL with Query Params
  const url = new URL(endpoint, finalConfig.baseURL || BASE_URL);
  if (finalConfig.params) {
    Object.entries(finalConfig.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  // Handle Timeout using AbortController
  const controller = new AbortController();
  const id = finalConfig.timeout
    ? setTimeout(() => controller.abort(), finalConfig.timeout)
    : null;

  finalConfig.signal = controller.signal;

  try {
    const response = await fetch(url.toString(), finalConfig as RequestInit);

    if (id) clearTimeout(id);

    // Try to parse JSON, fallback to text if empty or invalid
    let responseData;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      try {
        responseData = await response.json();
      } catch {
        responseData = null;
      }
    } else {
      responseData = await response.text();
    }

    const result: FetchResponse<T> = {
      data: responseData,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: finalConfig,
      ok: response.ok,
    };

    // If status is not 2xx, throw an error that mimics AxiosError
    if (!response.ok) {
      const error = new Error(
        responseData?.message || response.statusText
      ) as HttpError;
      error.response = result;
      error.config = finalConfig;
      throw error;
    }

    return result;
  } catch (error: any) {
    if (id) clearTimeout(id);

    // Normalize error shape for the interceptor
    const httpError = error as HttpError;
    httpError.config = finalConfig;

    // Pass to Centralized Error Handler
    return handleResponseError(httpError);
  }
};

/* --- EXPORTS --- */

// Helper to extract error messages (Legacy compatibility)
export const getHttpErrorMessage = (error: any): never => {
  const errorMessage =
    error?.response?.data?.errors?.[0]?.message ??
    error?.response?.data?.message ??
    error?.message ??
    "Something went wrong";

  const code =
    error?.response?.data?.code ??
    error?.response?.data?.errors?.[0]?.code;

  const err = new Error(errorMessage) as HttpError;
  if (error?.config) err.config = error.config;
  if (error?.response) err.response = error.response;
  if (code) err.code = code;
  throw err;
};

// Convenience methods to match Axios API style
export default {
  get: <T>(url: string, config?: FetchRequestConfig) =>
    $http<T>(url, { ...config, method: "GET" }),

  post: <T>(url: string, data?: any, config?: FetchRequestConfig) =>
    $http<T>(url, { ...config, method: "POST", body: JSON.stringify(data) }),

  put: <T>(url: string, data?: any, config?: FetchRequestConfig) =>
    $http<T>(url, { ...config, method: "PUT", body: JSON.stringify(data) }),

  patch: <T>(url: string, data?: any, config?: FetchRequestConfig) =>
    $http<T>(url, { ...config, method: "PATCH", body: JSON.stringify(data) }),

  delete: <T>(url: string, config?: FetchRequestConfig) =>
    $http<T>(url, { ...config, method: "DELETE" }),

  // Raw request
  request: $http,
};
