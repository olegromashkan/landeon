"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AdvancedBrief, SectionType } from "@/types";
import { getSectionLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";

const SECTION_TYPES: SectionType[] = [
  "hero", "about", "features", "services", "how_it_works",
  "testimonials", "pricing", "faq", "contact_form", "cta",
];

const TONES = ["Professional", "Friendly", "Bold", "Minimal", "Luxury", "Casual", "Authoritative"];
const STYLES = ["Modern", "Minimal", "Bold", "Elegant", "Corporate", "Creative"];
const GOALS = [
  "Generate leads",
  "Product launch",
  "Waitlist signup",
  "Service showcase",
  "Portfolio display",
  "Direct sales",
];
const LANGUAGES = ["English", "Spanish", "French", "German", "Portuguese", "Ukrainian", "Polish"];

interface Props {
  value: AdvancedBrief;
  onChange: (v: AdvancedBrief) => void;
}

export function AdvancedBriefForm({ value, onChange }: Props) {
  function set(key: keyof AdvancedBrief, v: unknown) {
    onChange({ ...value, [key]: v });
  }

  function toggleSection(type: SectionType) {
    const current = value.requiredSections ?? [];
    if (current.includes(type)) {
      set("requiredSections", current.filter((t) => t !== type));
    } else {
      set("requiredSections", [...current, type]);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Business Name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="businessName">Business Name</Label>
        <Input
          id="businessName"
          placeholder="e.g. Brew & Co."
          value={value.businessName ?? ""}
          onChange={(e) => set("businessName", e.target.value)}
        />
      </div>

      {/* Language */}
      <div className="flex flex-col gap-1.5">
        <Label>Language</Label>
        <Select value={value.language ?? "English"} onValueChange={(v) => set("language", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((l) => (
              <SelectItem key={l} value={l}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Business Description */}
      <div className="flex flex-col gap-1.5 md:col-span-2">
        <Label htmlFor="businessDesc">Business Description</Label>
        <Textarea
          id="businessDesc"
          placeholder="What does your business do? Who do you serve?"
          value={value.businessDescription ?? ""}
          onChange={(e) => set("businessDescription", e.target.value)}
          className="min-h-[80px]"
        />
      </div>

      {/* Target Audience */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="audience">Target Audience</Label>
        <Input
          id="audience"
          placeholder="e.g. Small business owners aged 30-50"
          value={value.targetAudience ?? ""}
          onChange={(e) => set("targetAudience", e.target.value)}
        />
      </div>

      {/* Goal */}
      <div className="flex flex-col gap-1.5">
        <Label>Landing Page Goal</Label>
        <Select value={value.goal ?? ""} onValueChange={(v) => set("goal", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select goal" />
          </SelectTrigger>
          <SelectContent>
            {GOALS.map((g) => (
              <SelectItem key={g} value={g}>{g}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tone */}
      <div className="flex flex-col gap-1.5">
        <Label>Brand Tone</Label>
        <Select value={value.tone ?? ""} onValueChange={(v) => set("tone", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            {TONES.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Visual Style */}
      <div className="flex flex-col gap-1.5">
        <Label>Visual Style</Label>
        <Select value={value.visualStyle ?? ""} onValueChange={(v) => set("visualStyle", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            {STYLES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* CTA Text */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ctaText">Preferred CTA Text</Label>
        <Input
          id="ctaText"
          placeholder="e.g. Book a Free Consultation"
          value={value.ctaText ?? ""}
          onChange={(e) => set("ctaText", e.target.value)}
        />
      </div>

      {/* Accent Color */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="accent">Accent Color (hex)</Label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={value.primaryAccent ?? "#a855f7"}
            onChange={(e) => set("primaryAccent", e.target.value)}
            className="h-9 w-12 rounded-lg border border-zinc-700 bg-zinc-900 cursor-pointer p-1"
          />
          <Input
            id="accent"
            placeholder="#a855f7"
            value={value.primaryAccent ?? ""}
            onChange={(e) => set("primaryAccent", e.target.value)}
            className="font-mono"
          />
        </div>
      </div>

      {/* Contact Info */}
      <div className="flex flex-col gap-1.5 md:col-span-2">
        <Label htmlFor="contactInfo">Contact Info (optional)</Label>
        <Input
          id="contactInfo"
          placeholder="e.g. hello@company.com, +1 555 000 0000"
          value={value.contactInfo ?? ""}
          onChange={(e) => set("contactInfo", e.target.value)}
        />
      </div>

      {/* Required Sections */}
      <div className="flex flex-col gap-2 md:col-span-2">
        <Label>Required Sections (optional)</Label>
        <div className="flex flex-wrap gap-2">
          {SECTION_TYPES.map((type) => {
            const isSelected = value.requiredSections?.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleSection(type)}
                className={cn(
                  "text-xs rounded-lg px-3 py-1.5 border transition-all",
                  isSelected
                    ? "border-purple-600 bg-purple-900/30 text-purple-200"
                    : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                )}
              >
                {getSectionLabel(type)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
