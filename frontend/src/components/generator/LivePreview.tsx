import { useState } from "react"
import { useQRStore } from "@/store/useQRStore"
import { useQuery } from "@tanstack/react-query"
import { Download, Loader2, Share2 } from "lucide-react"

async function fetchQRCode(settings: any) {
  const response = await fetch("/api/generator/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  })
  
  if (!response.ok) {
    throw new Error("Failed to generate QR code")
  }
  
  const blob = await response.blob()
  return URL.createObjectURL(blob)
}

export function LivePreview() {
  const { settings } = useQRStore()
  const [isDownloading, setIsDownloading] = useState(false)
  
  const { data: imageUrl, isLoading, isError } = useQuery({
    queryKey: ["qr-code", settings],
    queryFn: () => fetchQRCode(settings),
    staleTime: 1000 * 60, // 1 minute
  })

  return (
    <div className="flex flex-col items-center bg-card rounded-2xl border border-border shadow-sm overflow-hidden sticky top-6">
      <div className="w-full bg-muted/30 px-6 py-4 border-b border-border flex justify-between items-center">
        <h2 className="font-semibold text-foreground">Live Preview</h2>
      </div>
      
      <div className="p-8 w-full flex flex-col items-center justify-center min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center text-muted-foreground gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p>Generating...</p>
          </div>
        ) : isError ? (
          <div className="text-destructive p-4 bg-destructive/10 rounded-lg text-center">
            <p>Failed to generate QR Code.</p>
            <p className="text-sm mt-1">Please check your settings.</p>
          </div>
        ) : (
          <div className="relative group">
            <img 
              src={imageUrl} 
              alt="QR Code Preview" 
              className="max-w-[280px] w-full rounded-xl shadow-lg border border-border/50 transition-transform duration-300 group-hover:scale-[1.02]"
              style={settings.bg_transparent ? {
                backgroundImage: "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)",
                backgroundSize: "16px 16px",
                backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
                backgroundColor: "#f3f4f6",
              } : {}}
            />
          </div>
        )}
      </div>

      <div className="w-full p-6 bg-muted/20 border-t border-border grid grid-cols-2 gap-4">
        <button 
          className="flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
          disabled={isLoading || isError || isDownloading}
          onClick={async () => {
            if (!imageUrl) return;
            try {
              setIsDownloading(true);
              const highResSettings = { ...settings, target_size: 1024 };
              const url = await fetchQRCode(highResSettings);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'QRStream-Code.png';
              a.click();
              URL.revokeObjectURL(url);
            } catch (error) {
              console.error("Failed to download high-res QR:", error);
              const a = document.createElement('a');
              a.href = imageUrl;
              a.download = 'QRStream-Code-preview.png';
              a.click();
            } finally {
              setIsDownloading(false);
            }
          }}
        >
          {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {isDownloading ? 'Downloading...' : 'Download'}
        </button>
        <button 
          className="flex items-center justify-center gap-2 py-2.5 px-4 bg-card text-foreground border border-border rounded-lg font-medium hover:bg-muted transition-colors shadow-sm disabled:opacity-50"
          disabled={isLoading || isError}
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>
    </div>
  )
}
