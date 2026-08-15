import { useQRStore } from "@/store/useQRStore";
import { useDownloadStore } from "@/store/useDownloadStore";
import { useToast } from "@/hooks/useToast";
import { downloadQR, copyQRToClipboard, generateBatch } from "@/services/qrApi";

export function useDownloadHandlers() {
  const { settings, batchCsvRows, batchDataColumn, batchFilenameColumn } = useQRStore();
  const { 
    batchFormat, batchSize, downloadFormat, downloadSize, noStretching, customFilename,
    setIsDownloading, setDownloadSuccess, setIsCopying, setCopySuccess, setIsBatchGenerating 
  } = useDownloadStore();
  const { setToast } = useToast();

  const hasComplexStyling = settings.gradient_type !== "Solid Color" || settings.effect_shadow !== "none";

  const getEffectiveFilename = (ext: string) => {
    const base = customFilename.trim() || `GenerateCustomQR-${settings.contentType}`;
    return base.endsWith(`.${ext.toLowerCase()}`) ? base : `${base}.${ext.toLowerCase()}`;
  };

  const handleDownloadCustom = async () => {
    let progressTimer: any = null;
    try {
      setIsDownloading(true);
      const resLabel = downloadSize >= 8192 ? "8K (8192px)" : downloadSize >= 4096 ? "4K (4096px)" : downloadSize >= 2048 ? "2K (2048px)" : `${downloadSize}px`;
      
      if (downloadSize >= 2048) {
        setToast({
          message: `Preparing ${resLabel} output canvas (20%)...`,
          icon: "hourglass_top",
          persistent: true
        });

        let currentProgress = 20;
        progressTimer = setInterval(() => {
          currentProgress += 15;
          if (currentProgress < 85) {
            const stageMsg = currentProgress < 45
              ? `Building ${resLabel} module matrix (${currentProgress}%)...`
              : currentProgress < 70
              ? `Applying eye styling & custom frames (${currentProgress}%)...`
              : `Rendering high-res canvas effects (${currentProgress}%)...`;
            setToast({
              message: stageMsg,
              icon: "hourglass_top",
              persistent: true
            });
          } else {
            clearInterval(progressTimer);
          }
        }, 350);
      }

      const { blob, ext } = await downloadQR(settings, downloadFormat, downloadSize, noStretching);
      
      if (progressTimer) clearInterval(progressTimer);
      if (downloadSize >= 2048) {
        setToast({
          message: `Finalizing ${resLabel} file stream (95%)...`,
          icon: "hourglass_bottom",
          persistent: true
        });
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = getEffectiveFilename(ext);
      a.click();
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setToast({ message: `Downloaded ${resLabel} as ${ext.toUpperCase()}`, icon: "download_done", duration: 5000 });
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e: any) {
      console.error(e);
      const errorMsg = e?.name === "TimeoutError"
        ? "Download timed out — try a smaller resolution"
        : e?.message || "Download Failed";
      setToast({ message: errorMsg, icon: "error" });
    } finally {
      if (progressTimer) clearInterval(progressTimer);
      setIsDownloading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      setIsCopying(true);
      await copyQRToClipboard(settings, downloadSize, noStretching);
      setCopySuccess(true);
      setToast({ message: "Copied to Clipboard!", icon: "content_copy" });
      setTimeout(() => setCopySuccess(false), 2500);
    } catch (e) {
      console.error("Clipboard copy failed:", e);
      setToast({ message: "Failed to Copy", icon: "error" });
    } finally {
      setIsCopying(false);
    }
  };

  const handleBatchDownload = async () => {
    if (!batchDataColumn || batchCsvRows.length === 0) return;
    setIsBatchGenerating(true);
    try {
      const items = batchCsvRows.map(row => ({
        data: row[batchDataColumn],
        filename: batchFilenameColumn ? row[batchFilenameColumn] : undefined
      })).filter(item => item.data && item.data.trim().length > 0);

      if (items.length === 0) {
        setToast({ message: "No valid data rows found in selected column", icon: "warning" });
        return;
      }

      const maxBatchLimit = 50;
      const batchItems = items.slice(0, maxBatchLimit);
      if (items.length > maxBatchLimit) {
        setToast({ message: `Exporting first ${maxBatchLimit} items (batch limit)`, icon: "info" });
      }

      const blob = await generateBatch(settings, batchItems, batchFormat, parseInt(batchSize) || 1024);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "batch_qrcodes.zip";
      a.click();
      URL.revokeObjectURL(url);

      setToast({ message: `Batch ZIP generated (${batchItems.length} QR codes)`, icon: "download_done" });
    } catch (err: any) {
      console.error(err);
      setToast({ message: err?.message || "Error generating batch ZIP", icon: "error" });
    } finally {
      setIsBatchGenerating(false);
    }
  };

  return {
    handleDownloadCustom,
    handleCopyToClipboard,
    handleBatchDownload,
    hasComplexStyling,
  };
}
