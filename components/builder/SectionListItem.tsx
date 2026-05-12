"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Copy, ChevronRight } from "lucide-react";
import { cn, getSectionLabel, getSectionIcon } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Section } from "@/types";
import type { ComponentType, SVGProps } from "react";
import * as LucideIcons from "lucide-react";

interface Props {
  section: Section;
  isSelected: boolean;
  isAILoading: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

function SectionIcon({ type }: { type: string }) {
  const iconName = getSectionIcon(type);
  const icons = LucideIcons as unknown as Record<string, ComponentType<SVGProps<SVGSVGElement>>>;
  const Icon = icons[iconName];
  if (!Icon) return null;
  return <Icon className="w-3.5 h-3.5" />;
}

export function SectionListItem({
  section,
  isSelected,
  isAILoading,
  onSelect,
  onDelete,
  onDuplicate,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-all",
        isSelected
          ? "bg-purple-900/30 border border-purple-700/50"
          : "hover:bg-zinc-800/50 border border-transparent"
      )}
      onClick={onSelect}
    >
      {/* Drag handle */}
      <button
        className="text-zinc-600 hover:text-zinc-400 cursor-grab active:cursor-grabbing flex-shrink-0"
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="w-3.5 h-3.5" />
      </button>

      {/* Icon */}
      <span className={cn("flex-shrink-0", isSelected ? "text-purple-400" : "text-zinc-500")}>
        <SectionIcon type={section.type} />
      </span>

      {/* Label */}
      <span
        className={cn(
          "flex-1 text-xs font-medium truncate",
          isSelected ? "text-zinc-100" : "text-zinc-400"
        )}
      >
        {getSectionLabel(section.type)}
      </span>

      {/* AI loading indicator */}
      {isAILoading && (
        <div className="w-3 h-3 rounded-full border-2 border-purple-400 border-t-transparent animate-spin flex-shrink-0" />
      )}

      {/* Actions (visible on hover/selected) */}
      <div
        className={cn(
          "flex gap-0.5 transition-opacity",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-6 w-6 text-zinc-500 hover:text-zinc-200"
          onClick={onDuplicate}
          title="Duplicate section"
        >
          <Copy className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-6 w-6 text-zinc-500 hover:text-red-400"
          onClick={onDelete}
          title="Delete section"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      {isSelected && <ChevronRight className="w-3 h-3 text-purple-400 flex-shrink-0" />}
    </div>
  );
}
