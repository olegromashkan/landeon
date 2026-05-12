import type { TestimonialsSectionProps, PageTheme } from "@/types";
import { cn } from "@/lib/utils";
import { isDark, mutedText, cardStyle, boldBorderStyle, sectionPadding, headingStyle, itemBorderRadius } from "./theme";

interface Props {
  props: TestimonialsSectionProps;
  theme: PageTheme;
}

export function TestimonialsSection({ props, theme }: Props) {
  const dark = isDark(theme);
  const accent = theme.accent;

  return (
    <section
      className={cn(
        `px-6 ${sectionPadding(theme.style)}`,
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
              {item.rating !== undefined && (
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <span
                      key={star}
                      className="text-sm"
                      style={{ color: star < item.rating! ? accent : dark ? "#3f3f46" : "#d4d4d8" }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              )}
              <p className={cn("text-sm leading-relaxed italic flex-1", dark ? "text-zinc-300" : "text-zinc-700")}>
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-zinc-800/40">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: `${accent}30`, color: accent }}
                >
                  {item.author.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold">{item.author}</div>
                  <div className={cn("text-xs", mutedText(dark))}>
                    {item.role}{item.company && `, ${item.company}`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
