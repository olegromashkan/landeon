import type { FooterSectionProps, PageTheme } from "@/types";
import { cn } from "@/lib/utils";
import { isDark, mutedText, headingStyle } from "./theme";

interface Props {
  props: FooterSectionProps;
  theme: PageTheme;
}

export function FooterSection({ props, theme }: Props) {
  const dark = isDark(theme);
  const accent = theme.accent;

  return (
    <footer
      className={cn(
        "px-6 py-12",
        dark ? "bg-[#0a0a0f] text-zinc-100" : "bg-white text-zinc-900"
      )}
      style={{
        borderTop: `1px solid ${dark ? "#1f1f2e" : "#e4e4eb"}`,
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-8">
          <div>
            <div className={cn("text-lg", headingStyle(theme.style))}>{props.businessName}</div>
            {props.tagline && (
              <p className={cn("text-sm mt-1", mutedText(dark))}>{props.tagline}</p>
            )}
            <div className={cn("flex flex-col gap-1 mt-3 text-xs", mutedText(dark))}>
              {props.contactEmail && <span>{props.contactEmail}</span>}
              {props.contactPhone && <span>{props.contactPhone}</span>}
            </div>
          </div>
          {props.links && props.links.length > 0 && (
            <nav className="flex flex-wrap gap-6">
              {props.links.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className={cn(
                    "text-sm transition-colors hover:text-current",
                    mutedText(dark)
                  )}
                  style={{ ["--hover-color" as string]: accent }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}
        </div>
        <div
          className={cn("mt-8 pt-6 text-xs flex items-center justify-between flex-wrap gap-4", mutedText(dark))}
          style={{ borderTop: `1px solid ${dark ? "#1f1f2e" : "#e4e4eb"}` }}
        >
          <span>{props.copyright}</span>
          <span>
            Built with{" "}
            <span className="font-semibold" style={{ color: accent }}>
              Landeon
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}
