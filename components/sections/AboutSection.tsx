import type { AboutSectionProps, PageTheme } from "@/types";
import { cn } from "@/lib/utils";
import { isDark, mutedText, cardStyle, boldBorderStyle, sectionPadding, headingStyle, itemBorderRadius } from "./theme";
import { Check } from "lucide-react";

interface Props {
  props: AboutSectionProps;
  theme: PageTheme;
}

export function AboutSection({ props, theme }: Props) {
  const dark = isDark(theme);
  const accent = theme.accent;

  return (
    <section
      className={cn("px-6", sectionPadding(theme.style), dark ? "bg-[#111118] text-zinc-100" : "bg-zinc-50 text-zinc-900")}
    >
      <div className="max-w-5xl mx-auto">
        <div className={cn(props.imageUrl ? "grid sm:grid-cols-2 gap-10 items-start" : "")}>
          <div className={props.imageUrl ? "" : "max-w-3xl"}>
            <h2 className={cn("text-3xl md:text-4xl tracking-tight mb-5", headingStyle(theme.style))}>
              {props.headline}
            </h2>
            <p className={cn("text-base leading-relaxed", mutedText(dark))}>{props.description}</p>

            {props.highlights && props.highlights.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-3">
                {props.highlights.map((h, i) => (
                  <li
                    key={i}
                    className={cn(
                      "flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg",
                      dark ? "bg-zinc-800/60 text-zinc-300" : "bg-white text-zinc-700 border border-zinc-200"
                    )}
                  >
                    <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accent }} />
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {props.imageUrl && (
            <div className="flex flex-col gap-2">
              <img
                src={props.imageUrl}
                alt={props.imageAlt ?? ""}
                className={cn("w-full object-cover aspect-[4/3]", itemBorderRadius(theme.style))}
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

        {props.stats && props.stats.length > 0 && (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {props.stats.map((stat, i) => (
              <div
                key={i}
                className={cn(itemBorderRadius(theme.style), "p-5 text-center", cardStyle(dark, theme.style))}
                style={boldBorderStyle(theme.style, accent)}
              >
                <div className="text-3xl font-extrabold mb-1" style={{ color: accent }}>
                  {stat.value}
                </div>
                <div className={cn("text-xs", mutedText(dark))}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
