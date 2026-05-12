"use client";

import { ArrowUpRight } from "lucide-react";

const EXAMPLES = [
  "Landing page for a premium specialty coffee shop",
  "Modern SaaS startup — project management tool",
  "Minimal portfolio page for a freelance photographer",
  "Local dental clinic lead generation page",
  "Personal fitness coach and training services",
  "AI-powered writing assistant product launch",
];

interface Props {
  onSelect: (prompt: string) => void;
}

export function ExamplePrompts({ onSelect }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-zinc-600 uppercase tracking-widest font-medium mb-1">Examples</p>
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((example) => (
          <button
            key={example}
            onClick={() => onSelect(example)}
            className="group flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 border border-zinc-800 hover:border-zinc-600 rounded-lg px-3 py-2 transition-all hover:bg-zinc-800/40"
          >
            {example}
            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
}
