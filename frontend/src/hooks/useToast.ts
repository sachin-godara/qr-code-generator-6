import { useEffect } from "react";
import { useToastStore } from "@/store/useToastStore";

export function useToast(duration = 3000) {
  const { toast, setToast } = useToastStore();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), duration);
      return () => clearTimeout(timer);
    }
  }, [toast, duration, setToast]);

  return { toast, setToast };
}
