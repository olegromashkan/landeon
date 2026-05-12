import { create } from "zustand";
import type { LandingPage, Section, PageTheme, Project } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface BuilderState {
  project: Project | null;
  pageJson: LandingPage | null;
  selectedSectionId: string | null;
  isDirty: boolean;
  isSaving: boolean;
  isAILoading: boolean;
  aiLoadingSection: string | null;

  initProject: (project: Project) => void;
  updateProjectName: (name: string) => void;
  setPageJson: (page: LandingPage) => void;
  updateTheme: (patch: Partial<PageTheme>) => void;
  selectSection: (id: string | null) => void;
  updateSectionProps: (id: string, props: Record<string, unknown>) => void;
  deleteSection: (id: string) => void;
  duplicateSection: (id: string) => void;
  addSection: (section: Section) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  replaceSection: (id: string, newSection: Section) => void;
  setSaving: (v: boolean) => void;
  setAILoading: (v: boolean, sectionId?: string) => void;
  setDirty: (v: boolean) => void;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  project: null,
  pageJson: null,
  selectedSectionId: null,
  isDirty: false,
  isSaving: false,
  isAILoading: false,
  aiLoadingSection: null,

  initProject: (project) =>
    set({ project, pageJson: project.pageJson, selectedSectionId: null, isDirty: false }),

  updateProjectName: (name) => {
    const { project } = get();
    if (!project) return;
    set({ project: { ...project, name }, isDirty: true });
  },

  setPageJson: (page) => {
    const { project } = get();
    set({
      pageJson: page,
      project: project ? { ...project, pageJson: page } : null,
      isDirty: true,
    });
  },

  updateTheme: (patch) => {
    const { pageJson, project } = get();
    if (!pageJson) return;
    const updated = { ...pageJson, theme: { ...pageJson.theme, ...patch } };
    set({ pageJson: updated, project: project ? { ...project, pageJson: updated } : null, isDirty: true });
  },

  selectSection: (id) => set({ selectedSectionId: id }),

  updateSectionProps: (id, props) => {
    const { pageJson, project } = get();
    if (!pageJson) return;
    const sections = pageJson.sections.map((s) =>
      s.id === id ? { ...s, props: { ...s.props, ...props } } : s
    ) as Section[];
    const updated = { ...pageJson, sections };
    set({ pageJson: updated, project: project ? { ...project, pageJson: updated } : null, isDirty: true });
  },

  deleteSection: (id) => {
    const { pageJson, project, selectedSectionId } = get();
    if (!pageJson) return;
    const sections = pageJson.sections.filter((s) => s.id !== id);
    const updated = { ...pageJson, sections };
    set({
      pageJson: updated,
      project: project ? { ...project, pageJson: updated } : null,
      selectedSectionId: selectedSectionId === id ? null : selectedSectionId,
      isDirty: true,
    });
  },

  duplicateSection: (id) => {
    const { pageJson, project } = get();
    if (!pageJson) return;
    const idx = pageJson.sections.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const original = pageJson.sections[idx];
    const copy = { ...JSON.parse(JSON.stringify(original)), id: `${original.type}-${uuidv4().slice(0, 8)}` } as Section;
    const sections = [...pageJson.sections];
    sections.splice(idx + 1, 0, copy);
    const updated = { ...pageJson, sections };
    set({ pageJson: updated, project: project ? { ...project, pageJson: updated } : null, isDirty: true });
  },

  addSection: (section) => {
    const { pageJson, project } = get();
    if (!pageJson) return;
    const sections = [...pageJson.sections];
    const footerIdx = sections.findIndex((s) => s.type === "footer");
    if (footerIdx !== -1) {
      sections.splice(footerIdx, 0, section);
    } else {
      sections.push(section);
    }
    const updated = { ...pageJson, sections };
    set({
      pageJson: updated,
      project: project ? { ...project, pageJson: updated } : null,
      selectedSectionId: section.id,
      isDirty: true,
    });
  },

  reorderSections: (fromIndex, toIndex) => {
    const { pageJson, project } = get();
    if (!pageJson) return;
    const sections = [...pageJson.sections];
    const [moved] = sections.splice(fromIndex, 1);
    sections.splice(toIndex, 0, moved);
    const updated = { ...pageJson, sections };
    set({ pageJson: updated, project: project ? { ...project, pageJson: updated } : null, isDirty: true });
  },

  replaceSection: (id, newSection) => {
    const { pageJson, project } = get();
    if (!pageJson) return;
    const sections = pageJson.sections.map((s) => (s.id === id ? newSection : s));
    const updated = { ...pageJson, sections };
    set({ pageJson: updated, project: project ? { ...project, pageJson: updated } : null, isDirty: true });
  },

  setSaving: (v) => set({ isSaving: v }),
  setAILoading: (v, sectionId) => set({ isAILoading: v, aiLoadingSection: sectionId ?? null }),
  setDirty: (v) => set({ isDirty: v }),
}));
