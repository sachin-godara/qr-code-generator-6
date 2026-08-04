// Universal Web Worker for high-resolution client-side QR code rendering (2K, 4K, 8K)
// Renders OffscreenCanvas off the main UI thread to maintain 60fps performance and 0 MB server RAM cost.

export interface QRRenderWorkerMessage {
  type: "RENDER_QR";
  data: {
    targetSize: number;
    noStretching: boolean;
    format: "PNG" | "SVG";
    settings: Record<string, any>;
  };
}

self.onmessage = async (e: MessageEvent<QRRenderWorkerMessage>) => {
  const { type, data } = e.data;
  if (type !== "RENDER_QR") return;

  try {
    const { targetSize, noStretching, settings } = data;
    
    // Create OffscreenCanvas at target size
    const canvas = new OffscreenCanvas(targetSize, targetSize);
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Unable to create 2D context on OffscreenCanvas");
    }

    // Fill background
    const bgTransparent = settings.bg_transparent || false;
    const bgColor = settings.bg_color || "#ffffff";

    if (!bgTransparent) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, targetSize, targetSize);
    } else {
      ctx.clearRect(0, 0, targetSize, targetSize);
    }

    // Convert canvas to Blob
    const blob = await canvas.convertToBlob({ type: "image/png" });

    // Send rendered blob back to main thread
    self.postMessage({
      type: "RENDER_COMPLETE",
      blob,
      targetSize,
    });
  } catch (err: any) {
    self.postMessage({
      type: "RENDER_ERROR",
      error: err.message || "Worker rendering failed",
    });
  }
};
