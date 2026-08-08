import { useQRStore } from "@/store/useQRStore";
import { useDownloadStore } from "@/store/useDownloadStore";
import { useToast } from "@/hooks/useToast";
import { getReactLogoPngDataUrl, PRESET_LOGO_BRAND_COLORS } from "@/components/previews/SvgIcons";

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

      const { contentData, ...rest } = settings;

      let finalLogo = rest.logo_image;
      const isPresetLogo = !finalLogo && rest.preset_logo && rest.preset_logo !== "None";
      if (isPresetLogo) {
        finalLogo = await getReactLogoPngDataUrl(
          rest.preset_logo,
          rest.logo_color_mode || "default",
          rest.logo_custom_color || "#000000",
          rest.dots_color || "#000000",
          rest.logo_icon_style || "badge",
          rest.logo_card_shape || "Rounded Square"
        );
      }

      const color = rest.logo_color_mode === "custom"
        ? (rest.logo_custom_color?.startsWith("#") ? rest.logo_custom_color : "#000000")
        : (PRESET_LOGO_BRAND_COLORS[rest.preset_logo] || (rest.dots_color?.startsWith("#") ? rest.dots_color : "#000000"));

      const payload = { 
        ...rest, 
        data: contentData || "Your text here...", 
        logo_image: finalLogo, 
        preset_logo: isPresetLogo ? "None" : rest.preset_logo, 
        logo_card_shape: rest.logo_card_shape, 
        preset_logo_color: color, 
        box_size: 10, 
        target_size: downloadSize, 
        no_stretching: noStretching 
      };

      let endpoint = "/api/generator/generate";
      let ext = "png";
      if (downloadFormat === "SVG") {
        endpoint = "/api/generator/generate/svg";
        ext = "svg";
      } else if (downloadFormat === "PDF") {
        endpoint = "/api/generator/generate/pdf";
        ext = "pdf";
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Failed to generate ${downloadFormat}`);
      
      if (progressTimer) clearInterval(progressTimer);
      if (downloadSize >= 2048) {
        setToast({
          message: `Finalizing ${resLabel} file stream (95%)...`,
          icon: "hourglass_bottom",
          persistent: true
        });
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = getEffectiveFilename(ext);
      a.click();
      URL.revokeObjectURL(url);
      setDownloadSuccess(true);
      setToast({ message: `Downloaded ${resLabel} as ${ext.toUpperCase()}`, icon: "download_done", duration: 5000 });
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e) {
      console.error(e);
      setToast({ message: "Download Failed", icon: "error" });
    } finally {
      if (progressTimer) clearInterval(progressTimer);
      setIsDownloading(false);
    }

  };

  const handleCopyToClipboard = async () => {
    try {
      setIsCopying(true);
      const { contentData, ...rest } = settings;
      let finalLogo = rest.logo_image;
      const isPresetLogo = !finalLogo && rest.preset_logo && rest.preset_logo !== "None";
      if (isPresetLogo) {
        finalLogo = await getReactLogoPngDataUrl(
          rest.preset_logo,
          rest.logo_color_mode || "default",
          rest.logo_custom_color || "#000000",
          rest.dots_color || "#000000",
          rest.logo_icon_style || "badge",
          rest.logo_card_shape || "Rounded Square"
        );
      }
      const color = rest.logo_color_mode === "custom"
        ? (rest.logo_custom_color?.startsWith("#") ? rest.logo_custom_color : "#000000")
        : (PRESET_LOGO_BRAND_COLORS[rest.preset_logo] || (rest.dots_color?.startsWith("#") ? rest.dots_color : "#000000"));

      const payload = { 
        ...rest, 
        data: contentData || "Your text here...", 
        logo_image: finalLogo, 
        preset_logo: isPresetLogo ? "None" : rest.preset_logo, 
        logo_card_shape: rest.logo_card_shape, 
        preset_logo_color: color, 
        box_size: 10, 
        target_size: downloadSize, 
        no_stretching: noStretching 
      };
      const response = await fetch("/api/generator/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to generate PNG for clipboard");
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
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
      const { contentData, ...rest } = settings;
      let finalLogo = rest.logo_image;
      const isPresetLogo = !finalLogo && rest.preset_logo && rest.preset_logo !== "None";
      if (isPresetLogo) {
        finalLogo = await getReactLogoPngDataUrl(
          rest.preset_logo,
          rest.logo_color_mode || "default",
          rest.logo_custom_color || "#000000",
          rest.dots_color || "#000000",
          rest.logo_icon_style || "badge",
          rest.logo_card_shape || "Rounded Square"
        );
      }
      const color = rest.logo_color_mode === "custom"
        ? (rest.logo_custom_color?.startsWith("#") ? rest.logo_custom_color : "#000000")
        : (PRESET_LOGO_BRAND_COLORS[rest.preset_logo] || (rest.dots_color?.startsWith("#") ? rest.dots_color : "#000000"));

      const payloadSettings = {
        ...rest,
        logo_image: finalLogo,
        preset_logo: isPresetLogo ? "None" : rest.preset_logo,
        preset_logo_color: color
      };

      const items = batchCsvRows.map(row => ({
        data: row[batchDataColumn],
        filename: batchFilenameColumn ? row[batchFilenameColumn] : undefined
      }));

      const payload = {
        items: items.slice(0, 500),
        settings: payloadSettings,
        format: batchFormat.toLowerCase(),
        target_size: parseInt(batchSize)
      };

      const response = await fetch("/api/generator/generate/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Batch generation failed: " + errorText);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "batch_qrcodes.zip";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {

      console.error(err);
      alert("Error generating batch ZIP. Please check console for details.");
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
