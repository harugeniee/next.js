import React, { useCallback, useState } from "react";
import { toast } from "sonner";

/**
 * Simple, reusable form validation hook
 * No complex logic, just basic validation
 */
export function useFormValidation<T extends Record<string, any>>(
  validateFn: (data: T) => { isValid: boolean; errors: Record<string, string> },
) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(
    (data: T) => {
      const result = validateFn(data);
      setErrors(result.errors);
      return result.isValid;
    },
    [validateFn],
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return { errors, validate, clearErrors };
}

/**
 * Simple toast notifications hook
 * Clean and minimal
 */
export function useToast() {
  const success = useCallback((message: string) => toast.success(message), []);
  const error = useCallback((message: string) => toast.error(message), []);
  const info = useCallback((message: string) => toast.info(message), []);
  const warning = useCallback((message: string) => toast.warning(message), []);

  return { success, error, info, warning };
}

/**
 * Simple form submission hook
 * Handles loading state and basic error handling
 */
export function useFormSubmit<T>(
  submitFn: (data: T) => Promise<any>,
  options?: {
    onSuccess?: (result: any) => void;
    onError?: (error: any) => void;
    successMessage?: string;
    errorMessage?: string;
  },
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  const submit = useCallback(
    async (data: T) => {
      setIsSubmitting(true);

      try {
        const result = await submitFn(data);

        if (options?.onSuccess) {
          options.onSuccess(result);
        }

        if (options?.successMessage) {
          success(options.successMessage);
        }

        return result;
      } catch (err) {
        if (options?.onError) {
          options.onError(err);
        }

        if (options?.errorMessage) {
          error(options.errorMessage);
        }

        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [submitFn, options, success, error],
  );

  return { submit, isSubmitting };
}

/**
 * Simple debounced input hook
 * For search and form fields
 */
export function useDebounce<T>(value: T, delay: number = 300) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
