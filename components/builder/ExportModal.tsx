"use client";

import { useState } from "react";
import { Download, CheckCircle2, FileArchive, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useBuilderStore } from "@/store/builderStore";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ExportModal({ open, onClose }: Props) {
  const { project } = useBuilderStore();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleExport() {
    if (!project) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch(`/api/export/${project.id}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Export failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.name.toLowerCase().replace(/\s+/g, "-")}-landeon.zip`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Export failed");
      setStatus("error");
    }
  }

  function handleClose() {
    setStatus("idle");
    setErrorMsg("");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Export Landing Page</DialogTitle>
          <DialogDescription>
            Download your landing page as a ready-to-host ZIP package.
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-900/30 border border-emerald-700/50 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-zinc-100">Downloaded!</p>
              <p className="text-xs text-zinc-500 mt-1">
                Your ZIP contains index.html, styles.css, site.json and README.txt
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
              <div className="flex items-start gap-3">
                <FileArchive className="w-5 h-5 text-zinc-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-zinc-200">ZIP Package</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Includes index.html, styles.css, site.json, README.txt. Open in any browser — no setup needed.
                  </p>
                </div>
              </div>
            </div>

            {status === "error" && (
              <p className="text-xs text-red-400 bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">
                {errorMsg}
              </p>
            )}

            <div className="flex gap-2">
              <Button variant="ghost" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                disabled={status === "loading"}
                className="flex-1 gap-2"
              >
                {status === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {status === "loading" ? "Exporting..." : "Export ZIP"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
