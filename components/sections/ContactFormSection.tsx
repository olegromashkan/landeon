import type { ContactFormSectionProps, PageTheme } from "@/types";
import { cn } from "@/lib/utils";
import { isDark, mutedText, sectionPadding, headingStyle, itemBorderRadius } from "./theme";

interface Props {
  props: ContactFormSectionProps;
  theme: PageTheme;
}

export function ContactFormSection({ props, theme }: Props) {
  const dark = isDark(theme);
  const accent = theme.accent;

  const inputClass = cn(
    "w-full rounded-lg px-3 py-2.5 text-sm border transition-colors bg-transparent",
    dark
      ? "border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
      : "border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30",
    "outline-none"
  );

  const labelClass = cn("block text-xs font-medium mb-1.5", mutedText(dark));

  return (
    <section
      className={cn(
        `px-6 ${sectionPadding(theme.style)}`,
        dark ? "bg-[#0a0a0f] text-zinc-100" : "bg-white text-zinc-900"
      )}
    >
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h2 className={cn("text-3xl md:text-4xl tracking-tight", headingStyle(theme.style))}>{props.headline}</h2>
          {props.subheadline && (
            <p className={cn("mt-4 text-base", mutedText(dark))}>{props.subheadline}</p>
          )}
          {props.description && (
            <p className={cn("mt-2 text-sm", mutedText(dark))}>{props.description}</p>
          )}
        </div>
        <div
          className={cn(
            itemBorderRadius(theme.style),
            "p-8",
            dark ? "bg-zinc-900/60 border border-zinc-800" : "bg-zinc-50 border border-zinc-200"
          )}
        >
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            {props.showName && (
              <div>
                <label className={labelClass}>Full Name</label>
                <input className={inputClass} type="text" placeholder="Your name" />
              </div>
            )}
            {props.showEmail && (
              <div>
                <label className={labelClass}>Email Address</label>
                <input className={inputClass} type="email" placeholder="your@email.com" />
              </div>
            )}
            {props.showPhone && (
              <div>
                <label className={labelClass}>Phone Number</label>
                <input className={inputClass} type="tel" placeholder="+1 (555) 000-0000" />
              </div>
            )}
            {props.showCompany && (
              <div>
                <label className={labelClass}>Company</label>
                <input className={inputClass} type="text" placeholder="Company name" />
              </div>
            )}
            {props.showMessage && (
              <div>
                <label className={labelClass}>Message</label>
                <textarea
                  className={cn(inputClass, "min-h-[120px] resize-none")}
                  placeholder="How can we help you?"
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:brightness-110 mt-2"
              style={{ background: accent }}
            >
              {props.ctaText}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
