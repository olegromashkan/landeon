"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Save, Download, ArrowLeft, Loader2, Zap, AlertCircle, Eye, EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionList } from "@/components/builder/SectionList";
import { PreviewPanel } from "@/components/builder/PreviewPanel";
import { RightPanel } from "@/components/builder/RightPanel";
import { AddSectionModal } from "@/components/builder/AddSectionModal";
import { ExportModal } from "@/components/builder/ExportModal";
import { useBuilderStore } from "@/store/builderStore";
import { cn } from "@/lib/utils";
import type { Project, AIActionType } from "@/types";

export default function BuilderPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    project,
    pageJson,
    isDirty,
    isSaving,
    initProject,
    replaceSection,
    setSaving,
    setAILoading,
    setDirty,
    selectedSectionId,
    updateProjectName,
  } = useBuilderStore();

  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [loadError, setLoadError] = useState("");
  const [showAddSection, setShowAddSection] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [saveMsg, setSaveMsg] = useState("");

  // Load project
  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) throw new Error(data.error);
        initProject(data.data as Project);
        setLoadState("ready");
      })
      .catch((err) => {
        setLoadError(err.message || "Failed to load project");
        setLoadState("error");
      });
  }, [id, initProject]);

  // Auto-save when dirty (debounced)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isDirty || !project) return;
    const timer = setTimeout(() => handleSave(true), 3000);
    return () => clearTimeout(timer);
  }, [isDirty, pageJson]); // intentionally omitting handleSave to avoid re-trigger loops

  async function handleSave(silent = false) {
    if (!project || !pageJson) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: project.name, pageJson }),
      });
      if (!res.ok) throw new Error("Save failed");
      setDirty(false);
      if (!silent) {
        setSaveMsg("Saved");
        setTimeout(() => setSaveMsg(""), 2000);
      }
    } catch {
      if (!silent) setSaveMsg("Save failed");
    } finally {
      setSaving(false);
    }
  }

  const handleAIAction = useCallback(
    async (actionType: AIActionType) => {
      if (!project || !pageJson || !selectedSectionId) return;
      const section = pageJson.sections.find((s) => s.id === selectedSectionId);
      if (!section) return;

      setAILoading(true, selectedSectionId);
      try {
        const res = await fetch("/api/ai/section", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: project.id,
            sectionId: selectedSectionId,
            actionType,
            section,
            pageContext: {
              pageTitle: pageJson.pageTitle,
              theme: pageJson.theme,
              businessDescription: project.businessDescription ?? undefined,
            },
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        replaceSection(selectedSectionId, data.data);
      } catch (err) {
        console.error("AI action failed:", err);
      } finally {
        setAILoading(false);
      }
    },
    [project, pageJson, selectedSectionId, setAILoading, replaceSection]
  );

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loadState === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          <p className="text-sm text-zinc-500">Loading your project…</p>
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (loadState === "error") {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <AlertCircle className="w-10 h-10 text-red-400" />
          <h2 className="text-lg font-semibold text-zinc-100">Project not found</h2>
          <p className="text-sm text-zinc-500">{loadError}</p>
          <Button variant="outline" onClick={() => router.push("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0a0a0f] flex flex-col overflow-hidden">
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <header className="flex items-center gap-3 px-4 py-2.5 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur flex-shrink-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/")}
          className="text-zinc-500 hover:text-zinc-100"
          title="Back to home"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>

        {/* Logo */}
        <div className="flex items-center gap-1.5 mr-2">
          <div className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        {/* Project name */}
        <input
          className="bg-transparent text-sm font-medium text-zinc-200 border-none outline-none focus:text-zinc-100 placeholder:text-zinc-600 min-w-0 flex-1 max-w-xs"
          value={project?.name ?? ""}
          onChange={(e) => updateProjectName(e.target.value)}
          placeholder="Project name"
        />

        <div className="flex-1" />

        {/* Save status */}
        {saveMsg && (
          <span className="text-xs text-zinc-500 animate-fade-in">{saveMsg}</span>
        )}
        {isDirty && !isSaving && !saveMsg && (
          <span className="text-xs text-zinc-600">Unsaved changes</span>
        )}

        {/* Toggle preview */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowPreview((v) => !v)}
          className="text-zinc-500 hover:text-zinc-100"
          title={showPreview ? "Hide preview" : "Show preview"}
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSave()}
          disabled={isSaving || !isDirty}
          className="gap-1.5 h-8"
        >
          {isSaving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          Save
        </Button>

        <Button
          size="sm"
          onClick={() => setShowExport(true)}
          className="gap-1.5 h-8"
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </Button>
      </header>

      {/* ── Main layout ─────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — sections list */}
        <aside className="w-56 flex-shrink-0 bg-zinc-950 border-r border-zinc-800/80 flex flex-col overflow-hidden">
          <div className="px-3 py-3 border-b border-zinc-800/60">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
              Sections
            </p>
          </div>
          <div className="flex-1 overflow-y-auto px-2 py-2">
            <SectionList onAddSection={() => setShowAddSection(true)} />
          </div>
          {pageJson && (
            <div className="px-3 py-2.5 border-t border-zinc-800/60">
              <p className="text-xs text-zinc-600 truncate" title={pageJson.pageTitle}>
                {pageJson.pageTitle}
              </p>
              <p className="text-xs text-zinc-700 mt-0.5">
                {pageJson.sections.length} sections · {pageJson.theme.mode}
              </p>
            </div>
          )}
        </aside>

        {/* Center — preview */}
        {showPreview && (
          <main className="flex-1 overflow-y-auto bg-zinc-900/30">
            <div className="min-h-full">
              <PreviewPanel />
            </div>
          </main>
        )}

        {/* Right sidebar — settings & AI */}
        <aside className="w-64 flex-shrink-0 bg-zinc-950 border-l border-zinc-800/80 flex flex-col overflow-hidden">
          <RightPanel onAIAction={handleAIAction} />
        </aside>
      </div>

      {/* Modals */}
      <AddSectionModal
        open={showAddSection}
        onClose={() => setShowAddSection(false)}
      />
      <ExportModal
        open={showExport}
        onClose={() => setShowExport(false)}
      />
    </div>
  );
}
