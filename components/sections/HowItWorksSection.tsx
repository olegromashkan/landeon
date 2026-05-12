import type { HowItWorksSectionProps, PageTheme } from "@/types";
import { cn } from "@/lib/utils";
import { isDark, mutedText, sectionPadding, headingStyle } from "./theme";

interface Props {
  props: HowItWorksSectionProps;
  theme: PageTheme;
}

export function HowItWorksSection({ props, theme }: Props) {
  const dark = isDark(theme);
  const accent = theme.accent;

  return (
    <section
      className={cn(
        "px-6", sectionPadding(theme.style),
        dark ? "bg-[#0a0a0f] text-zinc-100" : "bg-white text-zinc-900"
      )}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <h2 className={cn("text-3xl md:text-4xl tracking-tight", headingStyle(theme.style))}>{props.headline}</h2>
          {props.subheadline && (
            <p className={cn("mt-4 text-base", mutedText(dark))}>{props.subheadline}</p>
          )}
        </div>
        <div className="relative flex flex-col gap-0">
          {/* Vertical connector line */}
          <div
            className="absolute left-[23px] top-8 bottom-8 w-px"
            style={{ background: `${accent}30` }}
          />
          {props.steps.map((step, i) => (
            <div key={i} className="flex gap-6 pb-10 last:pb-0 relative">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 z-10 border-2"
                style={{
                  background: dark ? "#0a0a0f" : "#fff",
                  borderColor: accent,
                  color: accent,
                }}
              >
                {step.number}
              </div>
              <div className="pt-2">
                <h3 className="font-semibold text-base mb-2">{step.title}</h3>
                <p className={cn("text-sm leading-relaxed", mutedText(dark))}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
