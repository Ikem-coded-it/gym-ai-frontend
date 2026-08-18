import { getHttpErrorMessage } from '../utils/$http';
import $http from '../utils/$http';
import { FetchRequestConfig } from '../lib/interfaces/http';

export default class ApiService {
  static async get<T>(url: string, headers?: Record<string, string>): Promise<T> {
    try {
      const response = await $http.get<T>(url, { headers });
      
      if (response.status !== 200) {
        throw new Error(`Failed to fetch data from ${url}`);
      }
      return response.data;
    } catch (error) {
      throw getHttpErrorMessage(error);
    }
  }

  static async post<T>(
    url: string,
    data: object,
    config?: FetchRequestConfig,
  ): Promise<T> {
    try {
      const response = await $http.post<T>(url, data, config);
      
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Failed to post data to ${url}`);
      }
      return response.data;
    } catch (error) {
      throw getHttpErrorMessage(error);
    }
  }

  static async put<T>(
    url: string,
    data: object,
    config?: FetchRequestConfig,
  ): Promise<T> {
    try {
      const response = await $http.put<T>(url, data, config);
      
      if (response.status !== 200) {
        throw new Error(`Failed to update data at ${url}`);
      }
      return response.data;
    } catch (error) {
      throw getHttpErrorMessage(error);
    }
  }

  static async patch<T>(
    url: string,
    data: object,
    config?: FetchRequestConfig,
  ): Promise<T> {
    try {
      const response = await $http.patch<T>(url, data, config);
      
      if (response.status !== 200) {
        throw new Error(`Failed to update data at ${url}`);
      }
      return response.data;
    } catch (error) {
      throw getHttpErrorMessage(error);
    }
  }

  static async delete<T>(url: string): Promise<T> {
    try {
      const response = await $http.delete<T>(url);
      
      if (response.status !== 200) {
        throw new Error(`Failed to delete data from ${url}`);
      }
      return response.data;
    } catch (error) {
      throw getHttpErrorMessage(error);
    }
  }

  static async formData<T>(
    method: 'POST' | 'PUT' | 'PATCH',
    url: string,
    data: FormData,
  ): Promise<T> {
    try {
      // NOTE: For native Fetch with FormData, we MUST NOT set 'Content-Type': 'multipart/form-data'.
      // The browser automatically sets the Content-Type with the correct boundary.
      // We use $http.request directly to pass the 'body' property instead of 'data'.
      const response = await $http.request<T>(url, {
        method,
        body: data as any,
        headers: {}, // Explicitly empty to let browser handle boundary
      });

      if (response.status !== 200) {
        throw new Error(`Failed to ${method} data to ${url}`);
      }
      return response.data;
    } catch (error) {
      throw getHttpErrorMessage(error);
    }
  }
}