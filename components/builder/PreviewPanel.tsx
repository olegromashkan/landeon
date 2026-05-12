"use client";

import { useBuilderStore } from "@/store/builderStore";
import { SectionRenderer } from "@/components/sections/SectionRenderer";

export function PreviewPanel() {
  const { pageJson, selectedSectionId, selectSection } = useBuilderStore();

  if (!pageJson) return null;

  return (
    <div
      className="min-h-full overflow-y-auto"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {pageJson.sections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          theme={pageJson.theme}
          isSelected={selectedSectionId === section.id}
          onSelect={() =>
            selectSection(selectedSectionId === section.id ? null : section.id)
          }
        />
      ))}
    </div>
  );
}
