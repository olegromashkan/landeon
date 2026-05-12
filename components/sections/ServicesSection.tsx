import type React from "react";
import type { ServicesSectionProps, PageTheme } from "@/types";
import { cn } from "@/lib/utils";
import { isDark, mutedText, cardStyle, boldBorderStyle, sectionPadding, headingStyle, itemBorderRadius } from "./theme";
import * as LucideIcons from "lucide-react";

interface Props {
  props: ServicesSectionProps;
  theme: PageTheme;
}

type LucideIconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

function DynamicIcon({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const icons = LucideIcons as unknown as Record<string, LucideIconComponent>;
  const IconComponent = icons[name] ?? icons["Briefcase"];
  return <IconComponent className={className} style={style} />;
}

export function ServicesSection({ props, theme }: Props) {
  const dark = isDark(theme);
  const accent = theme.accent;

  return (
    <section
      className={cn(
        "px-6", sectionPadding(theme.style),
        dark ? "bg-[#111118] text-zinc-100" : "bg-zinc-50 text-zinc-900"
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
            <div key={i} className={cn(itemBorderRadius(theme.style), "p-6 flex flex-col gap-4", cardStyle(dark, theme.style))} style={boldBorderStyle(theme.style, accent)}>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${accent}20` }}
              >
                <DynamicIcon
                  name={item.icon}
                  className="w-5 h-5"
                  style={{ color: accent } as React.CSSProperties}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                <p className={cn("text-sm leading-relaxed", mutedText(dark))}>
                  {item.description}
                </p>
              </div>
              {item.price && (
                <div className="mt-auto pt-4 border-t border-zinc-800/50">
                  <span className="text-sm font-bold" style={{ color: accent }}>
                    {item.price}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
