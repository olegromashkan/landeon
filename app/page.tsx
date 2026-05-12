"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ChevronDown, ChevronUp, Loader2, ArrowRight, Zap, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ExamplePrompts } from "@/components/home/ExamplePrompts";
import { AdvancedBriefForm } from "@/components/home/AdvancedBriefForm";
import type { AdvancedBrief } from "@/types";
import { cn } from "@/lib/utils";

type Stage = "idle" | "error";

export default function HomePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [brief, setBrief] = useState<AdvancedBrief>({});
  const [stage, setStage] = useState<Stage>("idle");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleGenerate() {
    const fullBrief: AdvancedBrief = {
      ...brief,
      prompt: prompt.trim() || undefined,
    };

    if (!fullBrief.prompt && !fullBrief.businessDescription) {
      setErrorMsg("Please describe your business or what you want to build.");
      return;
    }

    setIsGenerating(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief: fullBrief }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Generation failed");

      router.push(`/builder/${data.data.project.id}`);
    } catch (err) {
      setIsGenerating(false);
      setStage("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  }

  if (isGenerating) {
    return <GeneratingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] bg-grid flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-900/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-zinc-100 tracking-tight">Landeon</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/diploma"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-100"
          >
            <FileText className="w-3.5 h-3.5" />
            Диплом
          </Link>
          <div className="hidden text-xs text-zinc-600 sm:block">AI Landing Page Builder</div>
        </div>
      </header>

      {/* Hero area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl flex flex-col gap-8">
          {/* Title */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-700/40 bg-purple-900/20 px-4 py-1.5 text-xs text-purple-300 font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Powered by OpenRouter Free AI
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-100 leading-[1.1]">
              Your landing page,
              <br />
              <span className="text-gradient-purple">built in seconds</span>
            </h1>
            <p className="mt-4 text-base text-zinc-400 max-w-lg mx-auto">
              Describe your business and Landeon will generate a complete, conversion-focused
              landing page — structured, copywritten, and ready to publish.
            </p>
          </div>

          {/* Input area */}
          <div className="flex flex-col gap-3">
            <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/80 focus-within:border-purple-600/60 transition-colors overflow-hidden">
              <Textarea
                placeholder="Describe your business and what you want your landing page to do..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[120px] text-base border-none bg-transparent resize-none px-5 py-4 text-zinc-100 placeholder:text-zinc-600 focus:ring-0"
                disabled={isGenerating}
              />
              <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800">
                <button
                  className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                  onClick={() => setShowAdvanced((v) => !v)}
                >
                  {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  {showAdvanced ? "Hide" : "Advanced"} brief
                </button>
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="gap-2 h-8"
                >
                  Generate page
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {errorMsg && (
              <p className="text-sm text-red-400 bg-red-900/20 border border-red-800/40 rounded-xl px-4 py-2.5">
                {errorMsg}
              </p>
            )}

            {/* Advanced brief */}
            {showAdvanced && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
                <p className="text-xs font-medium text-zinc-400 mb-4">
                  Advanced Brief — all fields optional, AI fills the gaps
                </p>
                <AdvancedBriefForm value={brief} onChange={setBrief} />
              </div>
            )}
          </div>

          {/* Examples */}
          {!showAdvanced && (
            <ExamplePrompts
              onSelect={(example) => {
                setPrompt(example);
              }}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-zinc-700 border-t border-zinc-900/80">
        Landeon — Diploma Project · Built with Next.js & OpenRouter AI
      </footer>
    </div>
  );
}

function GeneratingScreen() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-8">
      {/* Animated orb */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-purple-600/20 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-purple-600/30 flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-purple-600/30 animate-ping" />
      </div>

      <div className="text-center">
        <h2 className="text-xl font-semibold text-zinc-100 mb-2">
          Building your landing page
        </h2>
        <p className="text-sm text-zinc-500 max-w-xs mx-auto">
          AI is crafting your page structure, sections, and copy...
        </p>
      </div>

      <div className="flex flex-col items-center gap-2">
        {[
          "Analyzing your business...",
          "Selecting the best sections...",
          "Writing persuasive copy...",
          "Finalizing the layout...",
        ].map((step, i) => (
          <div
            key={step}
            className={cn(
              "flex items-center gap-2.5 text-sm transition-all",
              i === 0 ? "text-zinc-300" : "text-zinc-600"
            )}
          >
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                i === 0 ? "bg-purple-400" : "bg-zinc-700"
              )}
            />
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
