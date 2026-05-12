import type { HeroSectionProps, PageTheme } from "@/types";
import { cn } from "@/lib/utils";
import { isDark, mutedText, headingStyle, itemBorderRadius } from "./theme";

interface Props {
  props: HeroSectionProps;
  variant: "centered" | "split";
  theme: PageTheme;
}

export function HeroSection({ props, variant, theme }: Props) {
  const dark = isDark(theme);
  const accent = theme.accent;

  if (variant === "centered") {
    return (
      <section
        className={cn(
          "relative px-6 py-28 text-center overflow-hidden",
          dark ? "bg-[#0a0a0f] text-zinc-100" : "bg-white text-zinc-900"
        )}
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${accent}18 0%, transparent 70%)`,
          }}
        />
        <div className="relative max-w-3xl mx-auto">
          {props.badge && (
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium mb-6 border"
              style={{
                background: `${accent}18`,
                color: accent,
                borderColor: `${accent}40`,
              }}
            >
              {props.badge}
            </span>
          )}
          <h1 className={cn("text-5xl md:text-6xl tracking-tight leading-[1.05] mb-5", headingStyle(theme.style))}>
            {props.headline}
          </h1>
          {props.subheadline && (
            <p className={cn("text-xl font-semibold mb-4", dark ? "text-zinc-300" : "text-zinc-700")}>
              {props.subheadline}
            </p>
          )}
          <p className={cn("text-lg leading-relaxed max-w-2xl mx-auto mb-10", mutedText(dark))}>
            {props.description}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              className="px-7 py-3 rounded-xl text-white font-semibold text-base transition-all hover:brightness-110 active:scale-95"
              style={{ background: accent }}
            >
              {props.ctaText}
            </button>
            {props.ctaSecondaryText && (
              <button
                className={cn(
                  "px-7 py-3 rounded-xl font-semibold text-base border transition-all hover:bg-zinc-800/50",
                  dark ? "border-zinc-700 text-zinc-300" : "border-zinc-300 text-zinc-700"
                )}
              >
                {props.ctaSecondaryText}
              </button>
            )}
          </div>
          {props.imageUrl && (
            <div className="mt-10 flex flex-col items-center gap-2">
              <img
                src={props.imageUrl}
                alt={props.imageAlt ?? ""}
                className={cn("w-full object-cover aspect-[16/9]", itemBorderRadius(theme.style))}
              />
              {props.imageAttribution && (
                <p className={cn("text-xs", mutedText(dark))}>
                  Photo by{" "}
                  <a
                    href={props.imagePhotographerUrl ?? `https://unsplash.com?utm_source=landeon&utm_medium=referral`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:opacity-80"
                  >
                    {props.imageAttribution.replace(/^Photo by (.+) on Unsplash$/, "$1")}
                  </a>
                  {" "}on{" "}
                  <a
                    href="https://unsplash.com?utm_source=landeon&utm_medium=referral"
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:opacity-80"
                  >
                    Unsplash
                  </a>
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    );
  }

  // Split variant
  return (
    <section
      className={cn(
        "relative px-6 py-24 overflow-hidden",
        dark ? "bg-[#0a0a0f] text-zinc-100" : "bg-white text-zinc-900"
      )}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 80% at 0% 50%, ${accent}14 0%, transparent 60%)`,
        }}
      />
      <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          {props.badge && (
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium mb-6 border"
              style={{ background: `${accent}18`, color: accent, borderColor: `${accent}40` }}
            >
              {props.badge}
            </span>
          )}
          <h1 className={cn("text-4xl md:text-5xl tracking-tight leading-[1.1] mb-5", headingStyle(theme.style))}>
            {props.headline}
          </h1>
          {props.subheadline && (
            <p className={cn("text-lg font-semibold mb-4", dark ? "text-zinc-300" : "text-zinc-700")}>
              {props.subheadline}
            </p>
          )}
          <p className={cn("text-base leading-relaxed mb-8", mutedText(dark))}>
            {props.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              className="px-6 py-3 rounded-xl text-white font-semibold transition-all hover:brightness-110"
              style={{ background: accent }}
            >
              {props.ctaText}
            </button>
            {props.ctaSecondaryText && (
              <button
                className={cn(
                  "px-6 py-3 rounded-xl font-semibold border transition-all",
                  dark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800/50" : "border-zinc-300 text-zinc-700"
                )}
              >
                {props.ctaSecondaryText}
              </button>
            )}
          </div>
        </div>
        {props.imageUrl ? (
          <div className="flex flex-col gap-1.5">
            <img
              src={props.imageUrl}
              alt={props.imageAlt ?? ""}
              className={cn("aspect-[4/3] object-cover w-full", itemBorderRadius(theme.style))}
            />
            {props.imageAttribution && (
              <p className={cn("text-xs", mutedText(dark))}>
                Photo by{" "}
                <a
                  href={props.imagePhotographerUrl ?? `https://unsplash.com?utm_source=landeon&utm_medium=referral`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:opacity-80"
                >
                  {props.imageAttribution.replace(/^Photo by (.+) on Unsplash$/, "$1")}
                </a>
                {" "}on{" "}
                <a
                  href="https://unsplash.com?utm_source=landeon&utm_medium=referral"
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:opacity-80"
                >
                  Unsplash
                </a>
              </p>
            )}
          </div>
        ) : (
          <div
            className={cn(
              "aspect-[4/3] flex items-center justify-center",
              itemBorderRadius(theme.style),
              dark ? "bg-zinc-900/80 border border-zinc-800" : "bg-zinc-100 border border-zinc-200"
            )}
          >
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                style={{ background: `${accent}20` }}
              >
                <div className="w-8 h-8 rounded-full" style={{ background: accent }} />
              </div>
              <p className={cn("text-sm", mutedText(dark))}>Visual / Screenshot</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
