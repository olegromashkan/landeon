"use client";

import { useState } from "react";
import { useBuilderStore } from "@/store/builderStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Section } from "@/types";
import { ItemListEditor } from "./ItemListEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UnsplashPickerModal } from "./UnsplashPickerModal";
import { Image, X } from "lucide-react";

function ImageField({
  imageUrl,
  imageAttribution,
  imageSuggestion,
  onPick,
  onClear,
}: {
  imageUrl?: string;
  imageAttribution?: string;
  imageSuggestion?: string;
  onPick: () => void;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>Image</Label>
      {imageUrl ? (
        <div className="relative">
          <img src={imageUrl} alt="" className="w-full aspect-[16/9] object-cover rounded-lg" />
          <button
            onClick={onClear}
            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-black transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
          {imageAttribution && (
            <p className="text-xs text-zinc-600 mt-1 truncate">{imageAttribution}</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <button
            onClick={onPick}
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200 border border-dashed border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors"
          >
            <Image className="w-3.5 h-3.5" />
            Choose photo from Unsplash
          </button>
          {imageSuggestion && (
            <p className="text-xs text-zinc-600">
              AI suggests: <span className="text-zinc-400 italic">&quot;{imageSuggestion}&quot;</span>
            </p>
          )}
        </div>
      )}
      {imageUrl && (
        <button
          onClick={onPick}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors text-left"
        >
          Change photo
        </button>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {multiline ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="text-xs min-h-[72px]"
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="text-xs h-8"
        />
      )}
    </div>
  );
}

interface Props {
  section: Section;
}

export function SectionPropsEditor({ section }: Props) {
  const { updateSectionProps } = useBuilderStore();
  const [showUnsplash, setShowUnsplash] = useState(false);
  const [pickerQuery, setPickerQuery] = useState("");

  function update(key: string, value: unknown) {
    updateSectionProps(section.id, { [key]: value });
  }

  // Render fields based on section type
  switch (section.type) {
    case "hero":
      return (
        <div className="flex flex-col gap-3">
          <Field label="Headline" value={section.props.headline} onChange={(v) => update("headline", v)} />
          <Field label="Subheadline" value={section.props.subheadline ?? ""} onChange={(v) => update("subheadline", v)} />
          <Field label="Description" value={section.props.description} onChange={(v) => update("description", v)} multiline />
          <Field label="CTA Button Text" value={section.props.ctaText} onChange={(v) => update("ctaText", v)} placeholder="Get Started" />
          <Field label="Secondary CTA" value={section.props.ctaSecondaryText ?? ""} onChange={(v) => update("ctaSecondaryText", v)} placeholder="Learn more" />
          <Field label="Badge Text" value={section.props.badge ?? ""} onChange={(v) => update("badge", v)} placeholder="New" />
          <ImageField
            imageUrl={section.props.imageUrl}
            imageAttribution={section.props.imageAttribution}
            imageSuggestion={section.props.imageSuggestion}
            onPick={() => {
              setPickerQuery(section.props.imageSuggestion ?? "");
              setShowUnsplash(true);
            }}
            onClear={() => {
              update("imageUrl", undefined);
              update("imagePhotographerUrl", undefined);
            }}
          />
          {showUnsplash && (
            <UnsplashPickerModal
              initialQuery={pickerQuery}
              onSelect={(img) => {
                update("imageUrl", img.imageUrl);
                update("imageAlt", img.imageAlt);
                update("imageAttribution", img.imageAttribution);
                update("imagePhotographerUrl", img.imagePhotographerUrl);
                setShowUnsplash(false);
              }}
              onClose={() => setShowUnsplash(false)}
            />
          )}
        </div>
      );

    case "about":
      return (
        <div className="flex flex-col gap-3">
          <Field label="Headline" value={section.props.headline} onChange={(v) => update("headline", v)} />
          <Field label="Description" value={section.props.description} onChange={(v) => update("description", v)} multiline />

          <p className="text-xs font-medium text-zinc-400 mt-1">Highlights</p>
          <ItemListEditor
            items={(section.props.highlights ?? []).map((h) => ({ text: h }))}
            onChange={(items) => update("highlights", items.map((i) => i.text))}
            maxItems={6}
            emptyItem={{ text: "" }}
            getLabel={(item, i) => item.text || `Highlight ${i + 1}`}
            renderFields={(item, onChange) => (
              <Field label="Text" value={item.text} onChange={(v) => onChange({ text: v })} />
            )}
          />

          <p className="text-xs font-medium text-zinc-400 mt-1">Stats</p>
          <ItemListEditor
            items={section.props.stats ?? []}
            onChange={(items) => update("stats", items)}
            maxItems={6}
            emptyItem={{ value: "0", label: "Label" }}
            getLabel={(item) => `${item.value} — ${item.label}`}
            renderFields={(item, onChange) => (
              <>
                <Field label="Value" value={item.value} onChange={(v) => onChange({ ...item, value: v })} placeholder="99%" />
                <Field label="Label" value={item.label} onChange={(v) => onChange({ ...item, label: v })} placeholder="Satisfaction" />
              </>
            )}
          />

          <ImageField
            imageUrl={section.props.imageUrl}
            imageAttribution={section.props.imageAttribution}
            imageSuggestion={section.props.imageSuggestion}
            onPick={() => {
              setPickerQuery(section.props.imageSuggestion ?? "");
              setShowUnsplash(true);
            }}
            onClear={() => {
              update("imageUrl", undefined);
              update("imagePhotographerUrl", undefined);
            }}
          />
          {showUnsplash && (
            <UnsplashPickerModal
              initialQuery={pickerQuery}
              onSelect={(img) => {
                update("imageUrl", img.imageUrl);
                update("imageAlt", img.imageAlt);
                update("imageAttribution", img.imageAttribution);
                update("imagePhotographerUrl", img.imagePhotographerUrl);
                setShowUnsplash(false);
              }}
              onClose={() => setShowUnsplash(false)}
            />
          )}
        </div>
      );

    case "features":
      return (
        <div className="flex flex-col gap-3">
          <Field label="Headline" value={section.props.headline} onChange={(v) => update("headline", v)} />
          <Field label="Subheadline" value={section.props.subheadline ?? ""} onChange={(v) => update("subheadline", v)} multiline />
          <p className="text-xs font-medium text-zinc-400 mt-1">Items</p>
          <ItemListEditor
            items={section.props.items}
            onChange={(items) => update("items", items)}
            maxItems={9}
            emptyItem={{ icon: "Sparkles", title: "New Feature", description: "" }}
            getLabel={(item) => item.title || "Untitled"}
            renderFields={(item, onChange) => (
              <>
                <Field label="Icon (Lucide name)" value={item.icon} onChange={(v) => onChange({ ...item, icon: v })} placeholder="Sparkles" />
                <Field label="Title" value={item.title} onChange={(v) => onChange({ ...item, title: v })} />
                <Field label="Description" value={item.description} onChange={(v) => onChange({ ...item, description: v })} multiline />
              </>
            )}
          />
        </div>
      );

    case "services":
      return (
        <div className="flex flex-col gap-3">
          <Field label="Headline" value={section.props.headline} onChange={(v) => update("headline", v)} />
          <Field label="Subheadline" value={section.props.subheadline ?? ""} onChange={(v) => update("subheadline", v)} multiline />
          <p className="text-xs font-medium text-zinc-400 mt-1">Services</p>
          <ItemListEditor
            items={section.props.items}
            onChange={(items) => update("items", items)}
            maxItems={9}
            emptyItem={{ icon: "Briefcase", title: "New Service", description: "", price: "" }}
            getLabel={(item) => item.title || "Untitled"}
            renderFields={(item, onChange) => (
              <>
                <Field label="Icon (Lucide name)" value={item.icon} onChange={(v) => onChange({ ...item, icon: v })} placeholder="Briefcase" />
                <Field label="Title" value={item.title} onChange={(v) => onChange({ ...item, title: v })} />
                <Field label="Description" value={item.description} onChange={(v) => onChange({ ...item, description: v })} multiline />
                <Field label="Price (optional)" value={item.price ?? ""} onChange={(v) => onChange({ ...item, price: v })} placeholder="$99/mo" />
              </>
            )}
          />
        </div>
      );

    case "how_it_works":
      return (
        <div className="flex flex-col gap-3">
          <Field label="Headline" value={section.props.headline} onChange={(v) => update("headline", v)} />
          <Field label="Subheadline" value={section.props.subheadline ?? ""} onChange={(v) => update("subheadline", v)} />
          <p className="text-xs font-medium text-zinc-400 mt-1">Steps</p>
          <ItemListEditor
            items={section.props.steps}
            onChange={(steps) => update("steps", steps)}
            maxItems={6}
            emptyItem={{ number: String(section.props.steps.length + 1), title: "New Step", description: "" }}
            getLabel={(item, i) => `${item.number || i + 1}. ${item.title || "Untitled"}`}
            renderFields={(item, onChange) => (
              <>
                <Field label="Number" value={item.number} onChange={(v) => onChange({ ...item, number: v })} placeholder="01" />
                <Field label="Title" value={item.title} onChange={(v) => onChange({ ...item, title: v })} />
                <Field label="Description" value={item.description} onChange={(v) => onChange({ ...item, description: v })} multiline />
              </>
            )}
          />
        </div>
      );

    case "testimonials":
      return (
        <div className="flex flex-col gap-3">
          <Field label="Headline" value={section.props.headline} onChange={(v) => update("headline", v)} />
          <Field label="Subheadline" value={section.props.subheadline ?? ""} onChange={(v) => update("subheadline", v)} />
          <p className="text-xs font-medium text-zinc-400 mt-1">Testimonials</p>
          <ItemListEditor
            items={section.props.items}
            onChange={(items) => update("items", items)}
            maxItems={6}
            emptyItem={{ quote: "", author: "Name", role: "Role", company: "", rating: 5 }}
            getLabel={(item) => item.author || "Untitled"}
            renderFields={(item, onChange) => (
              <>
                <Field label="Quote" value={item.quote} onChange={(v) => onChange({ ...item, quote: v })} multiline />
                <Field label="Author" value={item.author} onChange={(v) => onChange({ ...item, author: v })} />
                <Field label="Role" value={item.role} onChange={(v) => onChange({ ...item, role: v })} />
                <Field label="Company (optional)" value={item.company ?? ""} onChange={(v) => onChange({ ...item, company: v })} />
                <div className="flex flex-col gap-1.5">
                  <Label>Rating</Label>
                  <Select
                    value={String(item.rating ?? 5)}
                    onValueChange={(v) => onChange({ ...item, rating: Number(v) })}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n} star{n > 1 ? "s" : ""}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          />
        </div>
      );

    case "pricing":
      return (
        <div className="flex flex-col gap-3">
          <Field label="Headline" value={section.props.headline} onChange={(v) => update("headline", v)} />
          <Field label="Subheadline" value={section.props.subheadline ?? ""} onChange={(v) => update("subheadline", v)} />
          <p className="text-xs font-medium text-zinc-400 mt-1">Plans</p>
          <ItemListEditor
            items={section.props.plans}
            onChange={(plans) => update("plans", plans)}
            maxItems={4}
            emptyItem={{ name: "New Plan", price: "$0", period: "/mo", description: "", features: ["Feature 1"], ctaText: "Get Started", highlighted: false }}
            getLabel={(item) => item.name || "Untitled"}
            renderFields={(item, onChange) => (
              <>
                <Field label="Plan Name" value={item.name} onChange={(v) => onChange({ ...item, name: v })} />
                <Field label="Price" value={item.price} onChange={(v) => onChange({ ...item, price: v })} placeholder="$49" />
                <Field label="Period" value={item.period} onChange={(v) => onChange({ ...item, period: v })} placeholder="/mo" />
                <Field label="Description" value={item.description} onChange={(v) => onChange({ ...item, description: v })} multiline />
                <Field
                  label="Features (one per line)"
                  value={item.features.join("\n")}
                  onChange={(v) => onChange({ ...item, features: v.split("\n").filter(Boolean) })}
                  multiline
                />
                <Field label="CTA Text" value={item.ctaText} onChange={(v) => onChange({ ...item, ctaText: v })} />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`highlighted-${item.name}`}
                    checked={item.highlighted}
                    onChange={(e) => onChange({ ...item, highlighted: e.target.checked })}
                    className="w-3.5 h-3.5 accent-purple-500"
                  />
                  <label htmlFor={`highlighted-${item.name}`} className="text-xs text-zinc-400">
                    Highlighted (most popular)
                  </label>
                </div>
              </>
            )}
          />
        </div>
      );

    case "faq":
      return (
        <div className="flex flex-col gap-3">
          <Field label="Headline" value={section.props.headline} onChange={(v) => update("headline", v)} />
          <Field label="Subheadline" value={section.props.subheadline ?? ""} onChange={(v) => update("subheadline", v)} />
          <p className="text-xs font-medium text-zinc-400 mt-1">Questions</p>
          <ItemListEditor
            items={section.props.items}
            onChange={(items) => update("items", items)}
            maxItems={12}
            emptyItem={{ question: "New Question?", answer: "" }}
            getLabel={(item) => item.question || "Untitled"}
            renderFields={(item, onChange) => (
              <>
                <Field label="Question" value={item.question} onChange={(v) => onChange({ ...item, question: v })} />
                <Field label="Answer" value={item.answer} onChange={(v) => onChange({ ...item, answer: v })} multiline />
              </>
            )}
          />
        </div>
      );

    case "contact_form":
      return (
        <div className="flex flex-col gap-3">
          <Field label="Headline" value={section.props.headline} onChange={(v) => update("headline", v)} />
          <Field label="Subheadline" value={section.props.subheadline ?? ""} onChange={(v) => update("subheadline", v)} />
          <Field label="CTA Button Text" value={section.props.ctaText} onChange={(v) => update("ctaText", v)} />
        </div>
      );

    case "cta":
      return (
        <div className="flex flex-col gap-3">
          <Field label="Headline" value={section.props.headline} onChange={(v) => update("headline", v)} />
          <Field label="Subheadline" value={section.props.subheadline ?? ""} onChange={(v) => update("subheadline", v)} multiline />
          <Field label="CTA Button Text" value={section.props.ctaText} onChange={(v) => update("ctaText", v)} />
          <Field label="Secondary CTA" value={section.props.ctaSecondaryText ?? ""} onChange={(v) => update("ctaSecondaryText", v)} />
        </div>
      );

    case "footer":
      return (
        <div className="flex flex-col gap-3">
          <Field label="Business Name" value={section.props.businessName} onChange={(v) => update("businessName", v)} />
          <Field label="Tagline" value={section.props.tagline ?? ""} onChange={(v) => update("tagline", v)} />
          <Field label="Email" value={section.props.contactEmail ?? ""} onChange={(v) => update("contactEmail", v)} />
          <Field label="Phone" value={section.props.contactPhone ?? ""} onChange={(v) => update("contactPhone", v)} />
          <Field label="Copyright" value={section.props.copyright} onChange={(v) => update("copyright", v)} />

          <p className="text-xs font-medium text-zinc-400 mt-1">Links</p>
          <ItemListEditor
            items={section.props.links ?? []}
            onChange={(items) => update("links", items)}
            maxItems={8}
            emptyItem={{ label: "Link", href: "#" }}
            getLabel={(item) => item.label || "Untitled"}
            renderFields={(item, onChange) => (
              <>
                <Field label="Label" value={item.label} onChange={(v) => onChange({ ...item, label: v })} />
                <Field label="URL" value={item.href} onChange={(v) => onChange({ ...item, href: v })} placeholder="https://..." />
              </>
            )}
          />
        </div>
      );

    default:
      return <p className="text-xs text-zinc-500">No editable fields for this section.</p>;
  }
}
