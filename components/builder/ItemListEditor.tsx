"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ItemListEditorProps<T extends object> {
  items: T[];
  onChange: (items: T[]) => void;
  renderFields: (item: T, onChange: (updated: T) => void) => ReactNode;
  getLabel: (item: T, index: number) => string;
  maxItems?: number;
  emptyItem: T;
}

export function ItemListEditor<T extends object>({
  items,
  onChange,
  renderFields,
  getLabel,
  maxItems = 12,
  emptyItem,
}: ItemListEditorProps<T>) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function updateItem(index: number, updated: T) {
    onChange(items.map((item, i) => (i === index ? updated : item)));
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
    if (openIndex === index) setOpenIndex(null);
    else if (openIndex !== null && openIndex > index) setOpenIndex(openIndex - 1);
  }

  function addItem() {
    onChange([...items, { ...emptyItem }]);
    setOpenIndex(items.length);
  }

  return (
    <div className="flex flex-col gap-1">
      {items.map((item, i) => (
        <div key={i} className="border border-zinc-800 rounded-lg overflow-hidden">
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between px-2.5 py-2 text-left hover:bg-zinc-800/40 transition-colors"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span className="text-xs font-medium text-zinc-300 truncate pr-2">
                {getLabel(item, i)}
              </span>
              <ChevronDown
                className={cn(
                  "w-3 h-3 text-zinc-500 flex-shrink-0 transition-transform duration-150",
                  openIndex === i && "rotate-180"
                )}
              />
            </button>
            <button
              onClick={() => removeItem(i)}
              className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
          {openIndex === i && (
            <div className="px-2.5 pb-2.5 pt-2 border-t border-zinc-800 flex flex-col gap-2">
              {renderFields(item, (updated) => updateItem(i, updated))}
            </div>
          )}
        </div>
      ))}
      {items.length < maxItems && (
        <button
          onClick={addItem}
          className="flex items-center gap-1.5 px-2.5 py-2 text-xs text-zinc-500 hover:text-zinc-300 border border-dashed border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors mt-1"
        >
          <Plus className="w-3 h-3" />
          Add item
        </button>
      )}
    </div>
  );
}
