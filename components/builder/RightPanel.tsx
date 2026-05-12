"use client";

import { useBuilderStore } from "@/store/builderStore";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SectionPropsEditor } from "./SectionPropsEditor";
import { AIActionsPanel } from "./AIActionsPanel";
import { ThemeEditor } from "./ThemeEditor";
import { getSectionLabel } from "@/lib/utils";
import { Palette, Settings2, Wand2 } from "lucide-react";
import type { AIActionType } from "@/types";

interface Props {
  onAIAction: (actionType: AIActionType) => Promise<void>;
}

export function RightPanel({ onAIAction }: Props) {
  const { pageJson, selectedSectionId } = useBuilderStore();

  const selectedSection = pageJson?.sections.find((s) => s.id === selectedSectionId);

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="section" className="flex flex-col h-full">
        <div className="px-3 pt-3 pb-2 border-b border-zinc-800">
          <TabsList className="w-full grid grid-cols-3 h-8">
            <TabsTrigger value="section" className="text-xs gap-1.5">
              <Settings2 className="w-3 h-3" />
              Section
            </TabsTrigger>
            <TabsTrigger value="ai" className="text-xs gap-1.5">
              <Wand2 className="w-3 h-3" />
              AI
            </TabsTrigger>
            <TabsTrigger value="theme" className="text-xs gap-1.5">
              <Palette className="w-3 h-3" />
              Theme
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="section" className="p-3 mt-0">
            {selectedSection ? (
              <>
                <p className="text-xs font-medium text-zinc-400 mb-3">
                  {getSectionLabel(selectedSection.type)}
                </p>
                <SectionPropsEditor section={selectedSection} />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-28 text-center">
                <Settings2 className="w-6 h-6 text-zinc-700 mb-2" />
                <p className="text-xs text-zinc-500">Click a section in the preview to edit it</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ai" className="p-3 mt-0">
            {selectedSection && (
              <p className="text-xs font-medium text-zinc-400 mb-3">
                AI Actions — {getSectionLabel(selectedSection.type)}
              </p>
            )}
            <AIActionsPanel onAIAction={onAIAction} />
          </TabsContent>

          <TabsContent value="theme" className="p-3 mt-0">
            <p className="text-xs font-medium text-zinc-400 mb-3">Page Theme</p>
            <ThemeEditor />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
