"use client";

import { useState } from "react";
import {
  Wand2, RefreshCw, AlignLeft, Crown, Briefcase, MessageSquare, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBuilderStore } from "@/store/builderStore";
import { cn } from "@/lib/utils";
import type { AIActionType } from "@/types";

interface AIAction {
  type: AIActionType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const AI_ACTIONS: AIAction[] = [
  {
    type: "rewrite_section",
    label: "Rewrite",
    description: "Fresh copy with better persuasion",
    icon: <Wand2 className="w-4 h-4" />,
  },
  {
    type: "regenerate_section",
    label: "Regenerate",
    description: "Completely new approach",
    icon: <RefreshCw className="w-4 h-4" />,
  },
  {
    type: "make_shorter",
    label: "Make Shorter",
    description: "Reduce to essentials",
    icon: <AlignLeft className="w-4 h-4" />,
  },
  {
    type: "make_premium",
    label: "Make Premium",
    description: "Elevated, sophisticated tone",
    icon: <Crown className="w-4 h-4" />,
  },
  {
    type: "make_formal",
    label: "Make Formal",
    description: "Professional business tone",
    icon: <Briefcase className="w-4 h-4" />,
  },
  {
    type: "suggest_cta",
    label: "Improve CTA",
    description: "Stronger call-to-action text",
    icon: <Zap className="w-4 h-4" />,
  },
];

interface Props {
  onAIAction: (actionType: AIActionType) => Promise<void>;
}

export function AIActionsPanel({ onAIAction }: Props) {
  const { selectedSectionId, isAILoading, aiLoadingSection } = useBuilderStore();
  const [activeAction, setActiveAction] = useState<AIActionType | null>(null);

  if (!selectedSectionId) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-center px-4">
        <MessageSquare className="w-6 h-6 text-zinc-600 mb-2" />
        <p className="text-xs text-zinc-500">Select a section to use AI actions</p>
      </div>
    );
  }

  async function handleAction(actionType: AIActionType) {
    setActiveAction(actionType);
    try {
      await onAIAction(actionType);
    } finally {
      setActiveAction(null);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      {AI_ACTIONS.map((action) => {
        const isLoading = isAILoading && aiLoadingSection === selectedSectionId && activeAction === action.type;
        return (
          <button
            key={action.type}
            onClick={() => handleAction(action.type)}
            disabled={isAILoading}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all border",
              "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/40",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              isLoading && "border-purple-700/50 bg-purple-900/20"
            )}
          >
            <span className={cn("flex-shrink-0", isLoading ? "text-purple-400" : "text-zinc-500")}>
              {isLoading ? (
                <div className="w-4 h-4 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
              ) : (
                action.icon
              )}
            </span>
            <div>
              <div className={cn("text-xs font-semibold", isLoading ? "text-purple-300" : "text-zinc-300")}>
                {action.label}
              </div>
              <div className="text-xs text-zinc-500 mt-0.5">{action.description}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
