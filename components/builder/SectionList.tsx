"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useBuilderStore } from "@/store/builderStore";
import { SectionListItem } from "./SectionListItem";
import { Button } from "@/components/ui/button";

interface Props {
  onAddSection: () => void;
}

export function SectionList({ onAddSection }: Props) {
  const {
    pageJson,
    selectedSectionId,
    aiLoadingSection,
    selectSection,
    deleteSection,
    duplicateSection,
    reorderSections,
  } = useBuilderStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  if (!pageJson) return null;

  const sections = pageJson.sections;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIdx = sections.findIndex((s) => s.id === active.id);
    const toIdx = sections.findIndex((s) => s.id === over.id);
    if (fromIdx !== -1 && toIdx !== -1) reorderSections(fromIdx, toIdx);
  }

  return (
    <div className="flex flex-col gap-1">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {sections.map((section) => (
            <SectionListItem
              key={section.id}
              section={section}
              isSelected={selectedSectionId === section.id}
              isAILoading={aiLoadingSection === section.id}
              onSelect={() => selectSection(section.id)}
              onDelete={() => deleteSection(section.id)}
              onDuplicate={() => duplicateSection(section.id)}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Button
        variant="ghost"
        size="sm"
        className="mt-2 text-zinc-500 hover:text-zinc-200 justify-start gap-2"
        onClick={onAddSection}
      >
        <Plus className="w-3.5 h-3.5" />
        Add section
      </Button>
    </div>
  );
}
