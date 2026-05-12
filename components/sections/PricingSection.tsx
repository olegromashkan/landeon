import type { PricingSectionProps, PageTheme } from "@/types";
import { cn } from "@/lib/utils";
import { isDark, mutedText, cardStyle, boldBorderStyle, sectionPadding, headingStyle, itemBorderRadius } from "./theme";
import { Check } from "lucide-react";

interface Props {
  props: PricingSectionProps;
  theme: PageTheme;
}

export function PricingSection({ props, theme }: Props) {
  const dark = isDark(theme);
  const accent = theme.accent;

  return (
    <section
      className={cn(
        `px-6 ${sectionPadding(theme.style)}`,
        dark ? "bg-[#0a0a0f] text-zinc-100" : "bg-white text-zinc-900"
      )}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className={cn("text-3xl md:text-4xl tracking-tight", headingStyle(theme.style))}>{props.headline}</h2>
          {props.subheadline && (
            <p className={cn("mt-4 text-base max-w-xl mx-auto", mutedText(dark))}>
              {props.subheadline}
            </p>
          )}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
          {props.plans.map((plan, i) => (
            <div
              key={i}
              className={cn(
                itemBorderRadius(theme.style),
                "p-6 flex flex-col gap-5 relative",
                plan.highlighted
                  ? "border-2"
                  : cardStyle(dark, theme.style)
              )}
              style={
                plan.highlighted
                  ? { borderColor: accent, background: dark ? `${accent}0a` : `${accent}05` }
                  : boldBorderStyle(theme.style, accent)
              }
            >
              {plan.highlighted && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold text-white"
                  style={{ background: accent }}
                >
                  Most Popular
                </div>
              )}
              <div>
                <p className={cn("text-xs uppercase tracking-widest font-medium mb-2", mutedText(dark))}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className={cn("text-sm pb-1", mutedText(dark))}>{plan.period}</span>
                </div>
                {plan.description && (
                  <p className={cn("mt-2 text-sm", mutedText(dark))}>{plan.description}</p>
                )}
              </div>
              <ul className="flex flex-col gap-2.5">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: accent }} />
                    <span className={cn(dark ? "text-zinc-300" : "text-zinc-700")}>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={cn(
                  "mt-auto w-full py-2.5 rounded-lg text-sm font-semibold transition-all",
                  plan.highlighted
                    ? "text-white hover:brightness-110"
                    : dark
                    ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700"
                    : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-zinc-200"
                )}
                style={plan.highlighted ? { background: accent } : {}}
              >
                {plan.ctaText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
