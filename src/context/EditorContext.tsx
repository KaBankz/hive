'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { DailyLog, DailyReport } from '@/types/dailyReport';

type EditorContextType = {
  report: DailyReport;
  selectedProject: DailyLog;
  showPageBreaks: boolean;
  sectionVisibility: Record<string, boolean>;
  subItemVisibility: Record<string, Record<string, boolean>>;
  setShowPageBreaks: (show: boolean) => void;
  toggleSection: (section: string) => void;
  toggleSubItem: (section: string, itemId: string) => void;
};

const EditorContext = createContext<EditorContextType | null>(null);

export function EditorProvider({
  report,
  projectIndex,
  children,
}: {
  report: DailyReport;
  projectIndex: number;
  children: ReactNode;
}) {
  const selectedProject = report.dailyLogs[projectIndex];

  // Initialize visibility state based on available sections
  const [showPageBreaks, setShowPageBreaks] = useState(true);
  const [sectionVisibility, setSectionVisibility] = useState<
    Record<string, boolean>
  >(() => ({
    reportInfo: true,
    weather: !!selectedProject.weather,
    labor: !!selectedProject.labor,
    equipment: !!selectedProject.equipment,
    photos: !!selectedProject.images,
    questions: !!selectedProject.questions,
    quantities: !!selectedProject.quantities,
    deliveries: !!selectedProject.deliveries,
    inspections: !!selectedProject.inspections,
    visitors: !!selectedProject.visitors,
    notes: !!selectedProject.notes,
  }));

  // Initialize sub-item visibility
  const [subItemVisibility, setSubItemVisibility] = useState<
    Record<string, Record<string, boolean>>
  >(() => {
    const initial: Record<string, Record<string, boolean>> = {};

    // Weather
    if (selectedProject.weather?.summary) {
      initial.weather = Object.fromEntries(
        selectedProject.weather.summary.map((w) => [
          w.forecastTimeTzFormatted,
          true,
        ])
      );
    }

    // Labor
    if (selectedProject.labor?.details) {
      initial.labor = Object.fromEntries(
        selectedProject.labor.details.map((l) => [
          l.nameRow.nameCell.crewName,
          true,
        ])
      );
    }

    // Equipment
    if (selectedProject.equipment?.details) {
      initial.equipment = Object.fromEntries(
        selectedProject.equipment.details.map((e) => [
          e.nameRow.nameCell.equipName,
          true,
        ])
      );
    }

    // Photos
    if (selectedProject.images?.details) {
      initial.photos = Object.fromEntries(
        selectedProject.images.details.map((p, i) => [
          p.url || `photo-${i}`,
          true,
        ])
      );
    }

    // Questions
    if (selectedProject.questions?.details) {
      initial.questions = Object.fromEntries(
        selectedProject.questions.details.map((q) => [q.fullName, true])
      );
    }

    // Quantities
    if (selectedProject.quantities?.details) {
      initial.quantities = Object.fromEntries(
        selectedProject.quantities.details.map((q) => [q.itemNumber, true])
      );
    }

    // Deliveries
    if (selectedProject.deliveries?.details) {
      initial.deliveries = Object.fromEntries(
        selectedProject.deliveries.details.map((d) => [d.itemNumber, true])
      );
    }

    // Inspections
    if (selectedProject.inspections?.details) {
      initial.inspections = Object.fromEntries(
        selectedProject.inspections.details.map((i) => [i.itemNumber, true])
      );
    }

    // Visitors
    if (selectedProject.visitors?.details) {
      initial.visitors = Object.fromEntries(
        selectedProject.visitors.details.map((v) => [v.itemNumber, true])
      );
    }

    // Notes
    if (selectedProject.notes?.details) {
      initial.notes = Object.fromEntries(
        selectedProject.notes.details.map((n) => [n.itemNumber, true])
      );
    }

    return initial;
  });

  const toggleSection = useCallback((section: string) => {
    if (section === 'showAll' || section === 'hideAll') {
      const value = section === 'showAll';
      // Update all section visibility
      setSectionVisibility((prev) =>
        Object.keys(prev).reduce(
          (acc, key) => ({ ...acc, [key]: value }),
          {} as Record<string, boolean>
        )
      );
      // Update all sub-item visibility
      setSubItemVisibility((prev) => {
        const newState = { ...prev };
        Object.keys(newState).forEach((sectionId) => {
          newState[sectionId] = Object.keys(newState[sectionId] || {}).reduce(
            (acc, key) => ({ ...acc, [key]: value }),
            {}
          );
        });
        return newState;
      });
      return;
    }

    setSectionVisibility((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const toggleSubItem = useCallback((section: string, itemId: string) => {
    setSubItemVisibility((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [itemId]: !prev[section]?.[itemId],
      },
    }));
  }, []);

  const value = useMemo(
    () => ({
      report,
      selectedProject,
      showPageBreaks,
      sectionVisibility,
      subItemVisibility,
      setShowPageBreaks,
      toggleSection,
      toggleSubItem,
    }),
    [
      report,
      selectedProject,
      showPageBreaks,
      sectionVisibility,
      subItemVisibility,
      toggleSection,
      toggleSubItem,
    ]
  );

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
