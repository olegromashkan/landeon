import type { CSSProperties } from "react";
import type { PageTheme, ThemeStyle } from "@/types";

export function getAccentStyle(theme: PageTheme): CSSProperties {
  return { "--section-accent": theme.accent } as CSSProperties;
}

export function isDark(theme: PageTheme) {
  return theme.mode === "dark";
}

export const sectionBase = (dark: boolean) =>
  dark ? "bg-[#0a0a0f] text-zinc-100" : "bg-white text-zinc-900";

export const sectionAlt = (dark: boolean) =>
  dark ? "bg-[#111118]" : "bg-zinc-50";

export const mutedText = (dark: boolean) =>
  dark ? "text-zinc-400" : "text-zinc-500";

export const borderColor = (dark: boolean) =>
  dark ? "border-zinc-800" : "border-zinc-200";

export const cardBg = (dark: boolean) =>
  dark
    ? "bg-zinc-900/60 border border-zinc-800"
    : "bg-white border border-zinc-200";

// ─── Style-aware helpers ───────────────────────────────────────────────────────

export function cardStyle(dark: boolean, style: ThemeStyle): string {
  switch (style) {
    case "minimal":
      return dark
        ? "bg-transparent border border-zinc-800"
        : "bg-transparent border border-zinc-200";
    case "bold":
      return dark
        ? "bg-zinc-900/80 border-2 border-zinc-700"
        : "bg-white border-2 border-zinc-300";
    case "elegant":
      return dark
        ? "bg-zinc-900/40 border border-zinc-700/60"
        : "bg-white border border-zinc-300";
    default: // modern
      return cardBg(dark);
  }
}

export function boldBorderStyle(
  style: ThemeStyle,
  accent: string
): { borderColor: string } | undefined {
  return style === "bold" ? { borderColor: accent } : undefined;
}

export function sectionPadding(style: ThemeStyle): string {
  switch (style) {
    case "minimal": return "py-24";
    case "bold":    return "py-16";
    case "elegant": return "py-28";
    default:        return "py-20";
  }
}

export function headingStyle(style: ThemeStyle): string {
  switch (style) {
    case "bold":    return "font-extrabold";
    case "minimal": return "font-semibold";
    case "elegant": return "font-semibold";
    default:        return "font-bold";
  }
}

export function itemBorderRadius(style: ThemeStyle): string {
  switch (style) {
    case "minimal": return "rounded-lg";
    case "bold":    return "rounded-2xl";
    case "elegant": return "rounded";
    default:        return "rounded-xl";
  }
}
