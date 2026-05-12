import type { CTASectionProps, PageTheme } from "@/types";
import { cn } from "@/lib/utils";
import { isDark, mutedText, sectionPadding, headingStyle } from "./theme";

interface Props {
  props: CTASectionProps;
  theme: PageTheme;
}

export function CTASection({ props, theme }: Props) {
  const dark = isDark(theme);
  const accent = theme.accent;

  return (
    <section
      className={cn(
        `px-6 ${sectionPadding(theme.style)} relative overflow-hidden`,
        dark ? "bg-[#111118]" : "bg-zinc-50"
      )}
      style={{
        borderTop: `1px solid ${dark ? "#1f1f2e" : "#e4e4eb"}`,
        borderBottom: `1px solid ${dark ? "#1f1f2e" : "#e4e4eb"}`,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${accent}10 0%, transparent 70%)`,
        }}
      />
      <div className="relative max-w-3xl mx-auto text-center">
        <h2
          className={cn(
            "text-3xl md:text-4xl tracking-tight mb-4",
            headingStyle(theme.style),
            dark ? "text-zinc-100" : "text-zinc-900"
          )}
        >
          {props.headline}
        </h2>
        {props.subheadline && (
          <p className={cn("text-base mb-8 max-w-xl mx-auto", mutedText(dark))}>
            {props.subheadline}
          </p>
        )}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            className="px-8 py-3 rounded-xl text-white font-semibold text-base transition-all hover:brightness-110"
            style={{ background: accent }}
          >
            {props.ctaText}
          </button>
          {props.ctaSecondaryText && (
            <button
              className={cn(
                "px-8 py-3 rounded-xl font-semibold text-base border transition-all",
                dark
                  ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800/50"
                  : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"
              )}
            >
              {props.ctaSecondaryText}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
