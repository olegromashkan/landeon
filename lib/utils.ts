import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function getSectionLabel(type: string): string {
  const labels: Record<string, string> = {
    hero: "Hero",
    about: "About",
    features: "Features",
    services: "Services",
    how_it_works: "How It Works",
    testimonials: "Testimonials",
    pricing: "Pricing",
    faq: "FAQ",
    contact_form: "Contact Form",
    cta: "Call to Action",
    footer: "Footer",
  };
  return labels[type] ?? type;
}

export function getSectionIcon(type: string): string {
  const icons: Record<string, string> = {
    hero: "Sparkles",
    about: "Info",
    features: "LayoutGrid",
    services: "Briefcase",
    how_it_works: "ListOrdered",
    testimonials: "MessageSquareQuote",
    pricing: "CreditCard",
    faq: "HelpCircle",
    contact_form: "Mail",
    cta: "Megaphone",
    footer: "AlignJustify",
  };
  return icons[type] ?? "Square";
}

export function truncate(str: string, maxLen = 60): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + "...";
}
