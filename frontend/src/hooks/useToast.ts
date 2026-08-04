import { useEffect } from "react";
import { useToastStore, type ToastItem } from "@/store/useToastStore";


export function useToast(defaultDuration = 4000) {
  const { toast, setToast } = useToastStore();

  useEffect(() => {
    if (toast) {
      if (toast.persistent || toast.duration === 0) {
        return; // Persistent toast does not auto-dismiss
      }
      const delay = toast.duration ?? defaultDuration;
      const timer = setTimeout(() => setToast(null), delay);
      return () => clearTimeout(timer);
    }
  }, [toast, defaultDuration, setToast]);

  return { toast, setToast };
}
