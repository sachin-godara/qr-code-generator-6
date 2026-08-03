import { useState, useEffect, type RefObject } from "react";

export function useMiniPreview(previewRef: RefObject<HTMLDivElement | null>) {
  const [showMiniPreview, setShowMiniPreview] = useState(false);

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => setShowMiniPreview(!entry.isIntersecting),
      { threshold: 0.15 }
    );
    
    observer.observe(el);
    return () => observer.disconnect();
  }, [previewRef]);

  return { showMiniPreview };
}
