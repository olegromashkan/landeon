"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useBuilderStore } from "@/store/builderStore";
import { getSectionLabel, getSectionIcon, cn } from "@/lib/utils";
import type { Section, SectionType } from "@/types";
import type { ComponentType, SVGProps } from "react";
import * as LucideIcons from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const SECTION_TYPES: SectionType[] = [
  "hero",
  "about",
  "features",
  "services",
  "how_it_works",
  "testimonials",
  "pricing",
  "faq",
  "contact_form",
  "cta",
  "footer",
];

function createDefaultSection(type: SectionType): Section {
  const id = `${type}-${uuidv4().slice(0, 8)}`;
  switch (type) {
    case "hero":
      return {
        id, type: "hero", variant: "centered",
        props: { headline: "Your Headline Here", description: "A compelling description of your offer.", ctaText: "Get Started" },
      };
    case "about":
      return {
        id, type: "about", variant: "default",
        props: { headline: "About Us", description: "Tell your story here." },
      };
    case "features":
      return {
        id, type: "features", variant: "grid",
        props: {
          headline: "Key Features",
          items: [
            { icon: "Zap", title: "Feature One", description: "Description of this feature." },
            { icon: "Shield", title: "Feature Two", description: "Description of this feature." },
            { icon: "Star", title: "Feature Three", description: "Description of this feature." },
          ],
        },
      };
    case "services":
      return {
        id, type: "services", variant: "default",
        props: {
          headline: "Our Services",
          items: [
            { icon: "Briefcase", title: "Service One", description: "Description of this service." },
            { icon: "Target", title: "Service Two", description: "Description of this service." },
          ],
        },
      };
    case "how_it_works":
      return {
        id, type: "how_it_works", variant: "default",
        props: {
          headline: "How It Works",
          steps: [
            { number: "1", title: "Step One", description: "Description of the first step." },
            { number: "2", title: "Step Two", description: "Description of the second step." },
            { number: "3", title: "Step Three", description: "Description of the third step." },
          ],
        },
      };
    case "testimonials":
      return {
        id, type: "testimonials", variant: "default",
        props: {
          headline: "What People Say",
          items: [
            { quote: "This exceeded our expectations.", author: "Jane Doe", role: "CEO", rating: 5 },
            { quote: "Highly recommended.", author: "John Smith", role: "Founder", rating: 5 },
          ],
        },
      };
    case "pricing":
      return {
        id, type: "pricing", variant: "default",
        props: {
          headline: "Simple Pricing",
          plans: [
            { name: "Starter", price: "$29", period: "/mo", description: "For individuals.", features: ["Feature A", "Feature B"], ctaText: "Get Started", highlighted: false },
            { name: "Pro", price: "$79", period: "/mo", description: "For teams.", features: ["Everything in Starter", "Feature C", "Feature D"], ctaText: "Get Pro", highlighted: true },
          ],
        },
      };
    case "faq":
      return {
        id, type: "faq", variant: "default",
        props: {
          headline: "Frequently Asked Questions",
          items: [
            { question: "What is this?", answer: "A comprehensive answer to the question." },
            { question: "How does it work?", answer: "A clear explanation of the process." },
          ],
        },
      };
    case "contact_form":
      return {
        id, type: "contact_form", variant: "default",
        props: { headline: "Get in Touch", ctaText: "Send Message", showName: true, showEmail: true, showPhone: false, showMessage: true, showCompany: false },
      };
    case "cta":
      return {
        id, type: "cta", variant: "default",
        props: { headline: "Ready to Get Started?", subheadline: "Join hundreds of satisfied customers.", ctaText: "Start Now" },
      };
    case "footer":
      return {
        id, type: "footer", variant: "default",
        props: { businessName: "Your Business", copyright: `© ${new Date().getFullYear()} Your Business. All rights reserved.` },
      };
  }
}

function SectionIcon({ type }: { type: string }) {
  const iconName = getSectionIcon(type);
  const icons = LucideIcons as unknown as Record<string, ComponentType<SVGProps<SVGSVGElement>>>;
  const Icon = icons[iconName];
  if (!Icon) return null;
  return <Icon className="w-5 h-5" />;
}

export function AddSectionModal({ open, onClose }: Props) {
  const { addSection, pageJson } = useBuilderStore();
  const [selected, setSelected] = useState<SectionType | null>(null);

  const existingTypes = new Set(pageJson?.sections.map((s) => s.type) ?? []);

  function handleAdd() {
    if (!selected) return;
    const section = createDefaultSection(selected);
    addSection(section);
    setSelected(null);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Section</DialogTitle>
          <DialogDescription>Choose a section type to add to your page.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {SECTION_TYPES.map((type) => {
            const alreadyUsed = type === "footer" && existingTypes.has("footer");
            return (
              <button
                key={type}
                disabled={alreadyUsed}
                onClick={() => setSelected(type)}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-all",
                  selected === type
                    ? "border-purple-600 bg-purple-900/30 text-purple-200"
                    : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 hover:bg-zinc-800/40",
                  alreadyUsed && "opacity-40 cursor-not-allowed"
                )}
              >
                <span className={cn(selected === type ? "text-purple-400" : "text-zinc-500")}>
                  <SectionIcon type={type} />
                </span>
                <span className="font-medium">{getSectionLabel(type)}</span>
              </button>
            );
          })}
        </div>
        <div className="flex gap-2 mt-4 justify-end">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button disabled={!selected} onClick={handleAdd}>Add Section</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
