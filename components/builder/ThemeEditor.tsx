"use client";

import { useBuilderStore } from "@/store/builderStore";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PRESET_ACCENTS = [
  { label: "Purple", value: "#a855f7" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Cyan", value: "#06b6d4" },
  { label: "Emerald", value: "#10b981" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Rose", value: "#f43f5e" },
  { label: "Indigo", value: "#6366f1" },
  { label: "Orange", value: "#f97316" },
];

export function ThemeEditor() {
  const { pageJson, updateTheme } = useBuilderStore();

  if (!pageJson) return null;

  const { theme } = pageJson;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Mode</Label>
        <Select value={theme.mode} onValueChange={(v) => updateTheme({ mode: v as "dark" | "light" })}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="light">Light</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Style</Label>
        <Select
          value={theme.style}
          onValueChange={(v) => updateTheme({ style: v as "modern" | "minimal" | "bold" | "elegant" })}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="modern">Modern</SelectItem>
            <SelectItem value="minimal">Minimal</SelectItem>
            <SelectItem value="bold">Bold</SelectItem>
            <SelectItem value="elegant">Elegant</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Accent Color</Label>
        <div className="grid grid-cols-4 gap-2">
          {PRESET_ACCENTS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => updateTheme({ accent: preset.value })}
              className={cn(
                "h-8 rounded-lg border-2 transition-all",
                theme.accent === preset.value
                  ? "border-white scale-110"
                  : "border-transparent hover:scale-105"
              )}
              style={{ background: preset.value }}
              title={preset.label}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div
            className="w-8 h-8 rounded-lg border border-zinc-700 flex-shrink-0"
            style={{ background: theme.accent }}
          />
          <Input
            value={theme.accent}
            onChange={(e) => {
              const v = e.target.value;
              if (/^#[0-9a-fA-F]{0,6}$/.test(v)) updateTheme({ accent: v });
            }}
            placeholder="#a855f7"
            className="text-xs h-8 font-mono"
          />
        </div>
      </div>
    </div>
  );
}
