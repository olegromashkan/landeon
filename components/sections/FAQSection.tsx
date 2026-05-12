"use client";

import type { FAQSectionProps, PageTheme } from "@/types";
import { cn } from "@/lib/utils";
import { isDark, mutedText, sectionPadding, headingStyle } from "./theme";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  props: FAQSectionProps;
  theme: PageTheme;
}

export function FAQSection({ props, theme }: Props) {
  const dark = isDark(theme);
  const accent = theme.accent;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      className={cn(
        `px-6 ${sectionPadding(theme.style)}`,
        dark ? "bg-[#111118] text-zinc-100" : "bg-zinc-50 text-zinc-900"
      )}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <h2 className={cn("text-3xl md:text-4xl tracking-tight", headingStyle(theme.style))}>{props.headline}</h2>
          {props.subheadline && (
            <p className={cn("mt-4 text-base", mutedText(dark))}>{props.subheadline}</p>
          )}
        </div>
        <div className="flex flex-col">
          {props.items.map((item, i) => (
            <div
              key={i}
              className={cn(
                "border-b",
                dark ? "border-zinc-800" : "border-zinc-200"
              )}
            >
              <button
                className="w-full flex items-center justify-between py-5 text-left gap-4"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className={cn("text-sm font-medium", dark ? "text-zinc-200" : "text-zinc-800")}>
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 flex-shrink-0 transition-transform duration-200",
                    openIndex === i ? "rotate-180" : "",
                    mutedText(dark)
                  )}
                  style={openIndex === i ? { color: accent } : {}}
                />
              </button>
              {openIndex === i && (
                <div className={cn("pb-5 text-sm leading-relaxed", mutedText(dark))}>
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
