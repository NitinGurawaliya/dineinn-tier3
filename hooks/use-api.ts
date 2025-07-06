import { useState, useCallback } from "react";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { useToast } from "@/components/ui/toast";

interface UseApiOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

interface UseApiReturn<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (config?: AxiosRequestConfig) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T = any>(
  defaultConfig: AxiosRequestConfig,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const {
    showSuccessToast = true,
    showErrorToast = true,
    successMessage = "Operation completed successfully",
    errorMessage = "Something went wrong",
    onSuccess,
    onError,
  } = options;

  const execute = useCallback(
    async (config?: AxiosRequestConfig): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);

        const finalConfig = { ...defaultConfig, ...config };
        const response: AxiosResponse<T> = await axios(finalConfig);

        setData(response.data);

        if (showSuccessToast) {
          addToast({
            type: "success",
            title: "Success",
            message: successMessage,
          });
        }

        if (onSuccess) {
          onSuccess(response.data);
        }

        return response.data;
      } catch (err) {
        let errorMsg = errorMessage;

        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError<{ msg?: string }>;
          
          if (axiosError.response?.status === 401) {
            errorMsg = "Please sign in to continue";
          } else if (axiosError.response?.status === 403) {
            errorMsg = "You don't have permission to perform this action";
          } else if (axiosError.response?.status === 404) {
            errorMsg = "Resource not found";
          } else if (axiosError.response?.status === 409) {
            errorMsg = "This resource already exists";
          } else if (axiosError.response?.data?.msg) {
            errorMsg = axiosError.response.data.msg;
          } else if (axiosError.message) {
            errorMsg = axiosError.message;
          }
        } else if (err instanceof Error) {
          errorMsg = err.message;
        }

        setError(errorMsg);

        if (showErrorToast) {
          addToast({
            type: "error",
            title: "Error",
            message: errorMsg,
          });
        }

        if (onError) {
          onError(err);
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [defaultConfig, showSuccessToast, showErrorToast, successMessage, errorMessage, onSuccess, onError, addToast]
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return { data, loading, error, execute, reset };
}

// Specific hooks for common operations
export function useGet<T = any>(url: string, options?: UseApiOptions) {
  return useApi<T>({ method: "GET", url }, options);
}

export function usePost<T = any>(url: string, options?: UseApiOptions) {
  return useApi<T>({ method: "POST", url }, options);
}

export function usePut<T = any>(url: string, options?: UseApiOptions) {
  return useApi<T>({ method: "PUT", url }, options);
}

export function useDelete<T = any>(url: string, options?: UseApiOptions) {
  return useApi<T>({ method: "DELETE", url }, options);
} 