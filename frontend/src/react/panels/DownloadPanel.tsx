import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useQRStore } from "@/store/useQRStore";
import { useDownloadStore } from "@/store/useDownloadStore";
import { useDownloadHandlers } from "@/hooks/useDownloadHandlers";
import { ScannabilityAlert } from "@/components/ui/ScannabilityAlert";

interface DownloadPanelProps {
  onNavigateToContent?: () => void;
}

export function DownloadPanel({ onNavigateToContent }: DownloadPanelProps) {
  const { settings, batchCsvRows, batchDataColumn } = useQRStore();
  const { 
    batchFormat, setBatchFormat, batchSize, setBatchSize,
    downloadFormat, setDownloadFormat, downloadSize, setDownloadSize,
    noStretching, setNoStretching, customFilename, setCustomFilename,
    isDownloading, downloadSuccess, isCopying, copySuccess, isBatchGenerating 
  } = useDownloadStore();

  const { handleDownloadCustom, handleCopyToClipboard, handleBatchDownload, hasComplexStyling } = useDownloadHandlers();

  const showResolutionSelector = downloadFormat !== "SVG" && downloadFormat !== "PDF";

  if (settings.contentType === "batch") {
    return (
      <div className="bg-surface-container-lowest p-gutter rounded-2xl border border-outline-variant shadow-sm space-y-8">
        <div>
          <h3 className="font-headline-sm text-on-surface font-bold">Batch ZIP Export</h3>
        </div>

        {batchCsvRows.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-outline-variant rounded-xl bg-surface-container-lowest">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">upload_file</span>
            <p className="font-bold text-on-surface">No CSV Data</p>
            <p className="text-sm text-on-surface-variant mt-1">Please upload a CSV file in the Content tab first.</p>
            <button 
              onClick={onNavigateToContent} 
              className="mt-4 text-primary font-bold hover:underline text-sm bg-primary/10 px-4 py-2 rounded-lg"
            >
              Go to Content
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 border-t border-outline-variant pt-6">
              <div className="space-y-3">
                <div className="text-sm font-semibold text-on-surface">Export Format</div>
                <div className="flex bg-surface-container rounded-lg p-1 border border-outline-variant/50">
                  {["PNG", "SVG", "PDF"].map(fmt => (
                    <button 
                      key={fmt} 
                      type="button" 
                      onClick={() => setBatchFormat(fmt as any)} 
                      className={`relative flex-1 py-2.5 rounded-md font-bold transition-colors text-sm outline-none ${batchFormat === fmt ? "text-primary" : "text-on-surface-variant hover:text-on-surface"}`}
                    >
                      {batchFormat === fmt && (
                        <motion.div
                          layoutId="batch-format-tab"
                          className="absolute inset-0 bg-white shadow-sm ring-1 ring-black/5 rounded-md"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10">{fmt}</span>
                    </button>
                  ))}
                </div>
              </div>
              {batchFormat === "PNG" && (
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-on-surface">Size (px)</div>
                  <div className="flex bg-surface-container rounded-lg p-1 border border-outline-variant/50">
                    {["512", "1024", "2048"].map(s => (
                      <button 
                        key={s} 
                        type="button" 
                        onClick={() => setBatchSize(s)} 
                        className={`relative flex-1 py-2.5 rounded-md font-bold transition-colors text-sm outline-none ${batchSize === s ? "text-primary" : "text-on-surface-variant hover:text-on-surface"}`}
                      >
                        {batchSize === s && (
                          <motion.div
                            layoutId="batch-size-tab"
                            className="absolute inset-0 bg-white shadow-sm ring-1 ring-black/5 rounded-md"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <span className="relative z-10">{s}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleBatchDownload}
              disabled={isBatchGenerating || !batchDataColumn}
              className="flex w-full py-4 rounded-xl font-bold items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-hover text-white shadow-md hover:shadow-lg disabled:opacity-50 transition-all text-base"
            >
              {isBatchGenerating ? (
                <><Loader2 className="animate-spin w-6 h-6" /> Generating Batch Archive...</>
              ) : (
                <><span className="material-symbols-outlined text-[24px]">bolt</span> Generate & Download ZIP ({batchCsvRows.length > 500 ? 500 : batchCsvRows.length} items)</>
              )}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest p-gutter rounded-2xl border border-outline-variant shadow-sm space-y-8">
      <div>
        <h3 className="font-headline-sm text-on-surface font-bold">Export & Download</h3>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-semibold text-on-surface block">1. Select Format</div>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { id: "PNG", icon: "image" },
            { id: "SVG", icon: "polyline" },
            { id: "PDF", icon: "picture_as_pdf" },
          ].map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => setDownloadFormat(fmt.id as any)}
              className={`p-3 sm:p-4 rounded-xl border flex flex-col items-center text-center transition-all duration-200 ${downloadFormat === fmt.id
                ? "bg-primary/10 border-primary text-primary font-bold shadow-sm"
                : "border-outline-variant bg-white text-on-surface hover:bg-surface-container-highest"
                }`}
            >
              <span className="material-symbols-outlined text-2xl mb-1">{fmt.icon}</span>
              <span className="text-sm sm:text-base font-bold">{fmt.id}</span>
            </button>
          ))}
        </div>
      </div>

      {showResolutionSelector && (
        <div className="space-y-3 border-t border-outline-variant pt-6">
          <div className="flex justify-between items-center">
            <div className="text-sm font-semibold text-on-surface block">
              2. Output Resolution
            </div>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
              {downloadSize} x {downloadSize} px
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { size: 512, label: "512px" },
              { size: 1024, label: "1024px" },
              { size: 2048, label: "2048px" },
              { size: 4096, label: "4K", comingSoon: true },
              { size: 8192, label: "8K", comingSoon: true },
            ].map((opt) => (
              <button
                key={opt.size}
                disabled={opt.comingSoon}
                onClick={() => setDownloadSize(opt.size)}
                className={`flex-1 min-w-[60px] py-2.5 px-1 rounded-xl border text-[10px] sm:text-xs font-bold transition-all ${
                  opt.comingSoon 
                    ? "opacity-50 cursor-not-allowed bg-surface-container-low border-outline-variant/30 text-on-surface-variant/40" 
                    : downloadSize === opt.size
                      ? "bg-primary/10 text-primary border-primary shadow-sm"
                      : "border-outline-variant bg-white text-on-surface hover:bg-surface-container-highest"
                }`}
              >
                {opt.label} {opt.comingSoon && <span className="block text-[8px] opacity-70 font-normal">Soon</span>}
              </button>
            ))}
          </div>
          {downloadSize >= 4096 && (
            <div className="flex items-start gap-2 text-amber-700 bg-amber-50 px-3 py-2.5 rounded-lg border border-amber-200 mt-3">
              <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">info</span>
              <span className="text-xs font-medium leading-relaxed">
                Generating at {downloadSize}px takes significantly more processing power. Please expect a {downloadSize === 8192 ? '10-20' : '3-5'} second delay.
              </span>
            </div>
          )}
          <div className="bg-primary/5 rounded-2xl p-4 border border-primary/20 flex flex-col gap-3 mt-3">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center mt-0.5">
                <input name="input_field_e53a09c9" aria-label="Input Field" type="checkbox" checked={noStretching} onChange={(e) => setNoStretching(e.target.checked)} className="peer sr-only" />
                <div className="w-5 h-5 rounded border-2 border-primary/50 peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[16px] opacity-0 peer-checked:opacity-100 transition-opacity">check</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-on-surface">Native Resolution (No Stretching)</p>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Generates exact target size natively. Uncheck to use smooth upscaling for complex shapes.
                </p>
              </div>
            </label>
          </div>
        </div>
      )}

      {downloadFormat === "SVG" && (
        <div className="bg-primary/5 rounded-2xl p-4 border border-primary/20 space-y-2 text-xs text-on-surface-variant leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-primary text-sm">
            <span className="material-symbols-outlined text-[18px]">polyline</span>
            SVG Vector Generation Details
          </div>
          <p>
            Outputs as a scalable vector graphic or 300 DPI container for maximum print quality.
          </p>
        </div>
      )}

      {downloadFormat === "PDF" && (
        <div className="bg-primary/5 rounded-2xl p-4 border border-primary/20 space-y-2 text-xs text-on-surface-variant leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-primary text-sm">
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            PDF Document Generation Details
          </div>
          <p>
            Outputs as a 300 DPI print-ready document with a clean background canvas.
          </p>
        </div>
      )}

      <div className="space-y-3 border-t border-outline-variant pt-6">
        <div className="text-sm font-semibold text-on-surface block">
          {showResolutionSelector ? "3." : "2."} File Name
        </div>
        <div className="relative flex items-center">
          <input name="input_field_ef2df2ae" aria-label="Input Field"
            type="text"
            placeholder={`GenerateCustomQR-${settings.contentType}`}
            value={customFilename}
            onChange={(e) => setCustomFilename(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-outline-variant rounded-xl text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-medium text-sm transition-all"
          />
          <span className="absolute right-4 text-xs font-bold text-on-surface-variant uppercase bg-surface-container px-2 py-1 rounded-md">
            .{downloadFormat.toLowerCase()}
          </span>
        </div>
      </div>

      <div className="mb-6 mt-2">
        <ScannabilityAlert
          show={settings.logo_size_ratio > 0.18 || settings.logo_clear_size > 0.5 || settings.quiet_zone > 4 || settings.error_correction !== "H"}
          message="You have modified scannability settings from their defaults. Please test the QR scan first to ensure it scans reliably."
        />
      </div>
      <div className="flex border-t border-outline-variant pt-6 flex-col sm:flex-row gap-4">
        <button
          onClick={handleDownloadCustom}
          disabled={isDownloading || isCopying}
          className={`flex-1 py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-3 btn-spring shadow-lg text-base ${downloadSuccess
            ? "bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 animate-celebrate"
            : isDownloading
              ? "bg-primary/80 text-white cursor-wait shadow-sm animate-pulse"
              : "bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-white shadow-md hover:shadow-lg hover:scale-[1.015]"
            } disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100`}
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>
                {downloadSize >= 4096 && (downloadFormat === "PNG" || hasComplexStyling)
                  ? `Rendering ${downloadSize === 8192 ? '8K' : '4K'} (${downloadSize}px)...`
                  : `Rendering High-Res ${downloadFormat}...`
                }
              </span>
            </>
          ) : downloadSuccess ? (
            <>
              <span className="material-symbols-outlined text-2xl animate-[spin_400ms_ease-out_1]">check_circle</span>
              <span>Downloaded Successfully!</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-2xl">download</span>
              <span>
                Download {downloadFormat} {downloadFormat === "PNG" ? `(${downloadSize}px)` : ""}
              </span>
            </>
          )}
        </button>

        <button
          onClick={handleCopyToClipboard}
          disabled={isDownloading || isCopying}
          className={`py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 border btn-spring shadow-sm ${copySuccess
            ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/25 animate-celebrate"
            : isCopying
              ? "bg-surface-container-highest text-on-surface cursor-wait border-outline-variant"
              : "bg-white border-outline-variant text-on-surface hover:bg-surface-container-highest hover:border-zinc-300 hover:shadow-md hover:scale-[1.015]"
            } disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100`}
        >
          {isCopying ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Copying...</span>
            </>
          ) : copySuccess ? (
            <>
              <span className="material-symbols-outlined text-xl animate-[spin_400ms_ease-out_1]">check_circle</span>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-xl">content_copy</span>
              <span>Copy PNG</span>
            </>
          )}
        </button>
      </div>

      {/* Trust Badge */}
      <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
        {[
          { icon: "block", label: "No watermarks" },
          { icon: "person_off", label: "No sign-up" },
          { icon: "lock", label: "Files stay private" },
        ].map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-[11px] text-on-surface-variant font-medium">
            <span className="material-symbols-outlined text-[14px] text-emerald-600">{icon}</span>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
