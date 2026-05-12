import type { Section, PageTheme } from "@/types";
import { HeroSection } from "./HeroSection";
import { AboutSection } from "./AboutSection";
import { FeaturesSection } from "./FeaturesSection";
import { ServicesSection } from "./ServicesSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { PricingSection } from "./PricingSection";
import { FAQSection } from "./FAQSection";
import { ContactFormSection } from "./ContactFormSection";
import { CTASection } from "./CTASection";
import { FooterSection } from "./FooterSection";

interface SectionRendererProps {
  section: Section;
  theme: PageTheme;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function SectionRenderer({ section, theme, isSelected, onSelect }: SectionRendererProps) {
  const wrapperClass = isSelected !== undefined
    ? `relative group cursor-pointer transition-all duration-150 ${isSelected ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-zinc-950" : "hover:ring-1 hover:ring-zinc-600 hover:ring-offset-1 hover:ring-offset-zinc-950"}`
    : "";

  const content = (() => {
    switch (section.type) {
      case "hero":
        return <HeroSection props={section.props} variant={section.variant} theme={theme} />;
      case "about":
        return <AboutSection props={section.props} theme={theme} />;
      case "features":
        return <FeaturesSection props={section.props} variant={section.variant} theme={theme} />;
      case "services":
        return <ServicesSection props={section.props} theme={theme} />;
      case "how_it_works":
        return <HowItWorksSection props={section.props} theme={theme} />;
      case "testimonials":
        return <TestimonialsSection props={section.props} theme={theme} />;
      case "pricing":
        return <PricingSection props={section.props} theme={theme} />;
      case "faq":
        return <FAQSection props={section.props} theme={theme} />;
      case "contact_form":
        return <ContactFormSection props={section.props} theme={theme} />;
      case "cta":
        return <CTASection props={section.props} theme={theme} />;
      case "footer":
        return <FooterSection props={section.props} theme={theme} />;
      default:
        return null;
    }
  })();

  if (onSelect) {
    return (
      <div className={wrapperClass} onClick={onSelect}>
        {content}
      </div>
    );
  }

  return <>{content}</>;
}
