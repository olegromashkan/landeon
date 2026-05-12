import type React from "react";
import type { FeaturesSectionProps, PageTheme } from "@/types";
import { cn } from "@/lib/utils";
import { isDark, mutedText, cardStyle, boldBorderStyle, sectionPadding, headingStyle, itemBorderRadius } from "./theme";
import { Sparkles } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface Props {
  props: FeaturesSectionProps;
  variant: "grid" | "alternating";
  theme: PageTheme;
}

type LucideIconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

function DynamicIcon({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const icons = LucideIcons as unknown as Record<string, LucideIconComponent>;
  const IconComponent = icons[name] ?? icons["Sparkles"];
  return <IconComponent className={className} style={style} />;
}

export function FeaturesSection({ props, variant, theme }: Props) {
  const dark = isDark(theme);
  const accent = theme.accent;

  if (variant === "grid") {
    return (
      <section
        className={cn(
          "px-6", sectionPadding(theme.style),
          dark ? "bg-[#0a0a0f] text-zinc-100" : "bg-white text-zinc-900"
        )}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className={cn("text-3xl md:text-4xl tracking-tight", headingStyle(theme.style))}>{props.headline}</h2>
            {props.subheadline && (
              <p className={cn("mt-4 text-base max-w-xl mx-auto", mutedText(dark))}>
                {props.subheadline}
              </p>
            )}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {props.items.map((item, i) => (
              <div key={i} className={cn(itemBorderRadius(theme.style), "p-6", cardStyle(dark, theme.style))} style={boldBorderStyle(theme.style, accent)}>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: `${accent}20` }}
                >
                  <DynamicIcon
                    name={item.icon}
                    className="w-5 h-5"
                    style={{ color: accent } as React.CSSProperties}
                  />
                </div>
                <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                <p className={cn("text-sm leading-relaxed", mutedText(dark))}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Alternating variant
  return (
    <section
      className={cn(
        "px-6", sectionPadding(theme.style),
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
        <div className="flex flex-col gap-12">
          {props.items.map((item, i) => (
            <div
              key={i}
              className={cn(
                "flex flex-col md:flex-row items-start gap-8",
                i % 2 === 1 && "md:flex-row-reverse"
              )}
            >
              <div
                className={cn("w-14 h-14 flex items-center justify-center flex-shrink-0", itemBorderRadius(theme.style))}
                style={{ background: `${accent}20` }}
              >
                <DynamicIcon
                  name={item.icon}
                  className="w-7 h-7"
                  style={{ color: accent } as React.CSSProperties}
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className={cn("text-sm leading-relaxed", mutedText(dark))}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
