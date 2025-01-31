'use client';

import { useId, useMemo, useState } from 'react';

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  FileDown,
  Layers,
  Printer,
  Scissors,
} from 'lucide-react';

import { Button } from '@/components/Button';
import { useEditor } from '@/context/EditorContext';
import { usePdfExport } from '@/hooks/usePdfExport';

import { SidebarSubItem } from './sections/SidebarSection';
import { SortableItem } from './sections/SortableItem';

type SectionConfig = {
  id: string;
  label: string;
  getSubItems?: (data: ReturnType<typeof useEditor>) => Array<{
    id: string;
    label: string;
  }>;
};

const SECTION_CONFIG: Record<string, SectionConfig> = {
  reportInfo: {
    id: 'reportInfo',
    label: 'Report Information',
  },
  weather: {
    id: 'weather',
    label: 'Weather',
    getSubItems: ({ selectedProject }) =>
      selectedProject.weather?.summary.map((w) => ({
        id: w.forecastTimeTzFormatted,
        label: `${w.forecastTimeTzFormatted} - ${w.tempF}°`,
      })) || [],
  },
  labor: {
    id: 'labor',
    label: 'Labor',
    getSubItems: ({ selectedProject }) =>
      selectedProject.labor?.details.map((l) => ({
        id: l.nameRow.nameCell.crewName,
        label: l.nameRow.nameCell.crewName,
      })) || [],
  },
  equipment: {
    id: 'equipment',
    label: 'Equipment',
    getSubItems: ({ selectedProject }) =>
      selectedProject.equipment?.details.map((e) => ({
        id: e.nameRow.nameCell.equipName,
        label: e.nameRow.nameCell.equipName,
      })) || [],
  },
  photos: {
    id: 'photos',
    label: 'Photos',
    getSubItems: ({ selectedProject }) =>
      selectedProject.images?.details.map((p, i) => ({
        id: p.url || `photo-${i}`,
        label: p.note || `Photo ${i + 1}`,
      })) || [],
  },
  questions: {
    id: 'questions',
    label: 'Questions',
    getSubItems: ({ selectedProject }) =>
      selectedProject.questions?.details.map((q) => ({
        id: q.fullName,
        label: q.fullName,
      })) || [],
  },
  quantities: {
    id: 'quantities',
    label: 'Quantities',
    getSubItems: ({ selectedProject }) =>
      selectedProject.quantities?.details.map((q) => ({
        id: q.itemNumber,
        label: `Item ${q.itemNumber}`,
      })) || [],
  },
  deliveries: {
    id: 'deliveries',
    label: 'Deliveries',
    getSubItems: ({ selectedProject }) =>
      selectedProject.deliveries?.details.map((d) => ({
        id: d.itemNumber,
        label: `${d.deliveryFrom} - ${d.deliveryContents}`,
      })) || [],
  },
  inspections: {
    id: 'inspections',
    label: 'Inspections',
    getSubItems: ({ selectedProject }) =>
      selectedProject.inspections?.details.map((i) => ({
        id: i.itemNumber,
        label: `${i.inspectionType} - ${i.inspectorName}`,
      })) || [],
  },
  visitors: {
    id: 'visitors',
    label: 'Visitors',
    getSubItems: ({ selectedProject }) =>
      selectedProject.visitors?.details.map((v) => ({
        id: v.itemNumber,
        label: `${v.visitorName} - ${v.startTimeLocalString}`,
      })) || [],
  },
  notes: {
    id: 'notes',
    label: 'Notes',
    getSubItems: ({ selectedProject }) =>
      selectedProject.notes?.details.map((n) => ({
        id: n.itemNumber,
        label: `${n.noteLocation} - ${n.notes.substring(0, 30)}${
          n.notes.length > 30 ? '...' : ''
        }`,
      })) || [],
  },
};

export function Sidebar() {
  const [isGenerating, setIsGenerating] = useState(false);
  const editorContext = useEditor();
  const {
    showPageBreaks,
    setShowPageBreaks,
    sectionVisibility,
    subItemVisibility,
    toggleSection,
    toggleSubItem,
    reorderSections,
    sectionOrder,
    reorderSubItems,
    subItemOrder,
    selectedProject,
  } = editorContext;
  const { exportToPdf } = usePdfExport();

  const dndId = useId();
  const subDndId = useId();

  // Track expanded state for each section
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(() => {
    // Initialize all sections as collapsed
    return Object.values(SECTION_CONFIG).reduce(
      (acc, section) => ({
        ...acc,
        [section.id]: false,
      }),
      {}
    );
  });

  // Get available sections based on data and order them according to sectionOrder
  const availableSections = useMemo(() => {
    const sections = Object.values(SECTION_CONFIG).filter((section) => {
      if (section.id === 'reportInfo') return true;
      const subItems = section.getSubItems?.(editorContext);
      return subItems && subItems.length > 0;
    });

    // Sort sections based on sectionOrder
    return [...sections].sort(
      (a, b) => sectionOrder.indexOf(a.id) - sectionOrder.indexOf(b.id)
    );
  }, [editorContext, sectionOrder]);

  const handleSubItemToggle = (sectionId: string, itemId: string) => {
    // Get all sub-items for this section
    const subItems =
      SECTION_CONFIG[sectionId]?.getSubItems?.(editorContext) || [];

    // Toggle the sub-item
    toggleSubItem(sectionId, itemId);

    // After toggling, check if any items are visible
    const anyVisible = subItems.some((item) => {
      if (item.id === itemId) {
        // Use the new state for the toggled item
        return !subItemVisibility[sectionId]?.[itemId];
      }
      // Use current state for other items
      return subItemVisibility[sectionId]?.[item.id];
    });

    // Update parent section visibility if needed
    if (anyVisible && !sectionVisibility[sectionId]) {
      toggleSection(sectionId);
    } else if (!anyVisible && sectionVisibility[sectionId]) {
      toggleSection(sectionId);
    }
  };

  const handleSectionToggle = (sectionId: string) => {
    const subItems = SECTION_CONFIG[sectionId]?.getSubItems?.(editorContext);
    if (!subItems) {
      toggleSection(sectionId);
      return;
    }

    const willBeVisible = !sectionVisibility[sectionId];

    // If turning section on, turn on all sub-items that are off
    // If turning section off, turn off all sub-items that are on
    subItems.forEach((item) => {
      const isItemVisible = subItemVisibility[sectionId]?.[item.id] ?? false;
      if (willBeVisible !== isItemVisible) {
        toggleSubItem(sectionId, item.id);
      }
    });

    // Toggle the section last
    toggleSection(sectionId);
  };

  const toggleExpand = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const toggleAllSections = (expand: boolean) => {
    setExpandedSections((prev) => {
      const newState = { ...prev };
      Object.keys(prev).forEach((key) => {
        newState[key] = expand;
      });
      return newState;
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragOver = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sectionOrder.indexOf(active.id as string);
      const newIndex = sectionOrder.indexOf(over?.id as string);

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderSections(oldIndex, newIndex);
      }
    }
  };

  const isEverythingVisible = () => {
    return availableSections.every((section) => {
      // Check if section is visible
      if (!sectionVisibility[section.id]) return false;

      // Check if all sub-items are visible
      const subItems = section.getSubItems?.(editorContext);
      if (subItems) {
        return subItems.every(
          (item) => subItemVisibility[section.id]?.[item.id]
        );
      }

      return true;
    });
  };

  const handleShowHideAll = () => {
    const willShow = !isEverythingVisible();

    // First, handle all sub-items
    availableSections.forEach((section) => {
      const subItems = section.getSubItems?.(editorContext);
      if (subItems) {
        subItems.forEach((item) => {
          const isItemVisible =
            subItemVisibility[section.id]?.[item.id] ?? false;
          if (willShow !== isItemVisible) {
            toggleSubItem(section.id, item.id);
          }
        });
      }
    });

    // Then toggle the sections
    toggleSection(willShow ? 'showAll' : 'hideAll');
  };

  const handleExportPDF = async () => {
    setIsGenerating(true);
    try {
      const element = document.querySelector('[data-document-preview]');
      if (!element) return;

      await exportToPdf(element as HTMLElement, {
        filename: `daily-report-${selectedProject.projectNumber}-${selectedProject.dailyLogDate}.pdf`,
        margin: [6, 12, 6, 12],
        imageQuality: 1,
        scale: 3,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <aside className='h-[calc(100vh-4rem)] w-[400px] border-l border-gray-200 dark:border-gray-800'>
      <div className='flex h-full flex-col bg-white dark:bg-black/30'>
        {/* Fixed Header */}
        <div className='border-b border-gray-200 px-6 py-4 dark:border-gray-800'>
          <div className='space-y-4'>
            {/* Export Buttons */}
            <div className='space-y-2'>
              <Button
                variant='default'
                size='full'
                disabled={isGenerating}
                onClick={handleExportPDF}
                className='group'>
                <FileDown className='size-4' />
                <span className='ml-2'>
                  {isGenerating ? 'Generating PDF...' : 'Export PDF'}
                </span>
              </Button>
              <Button
                variant='outline'
                size='full'
                onClick={() => window.print()}
                className='group'>
                <Printer className='size-4' />
                <span>Print</span>
              </Button>
            </div>

            <div className='h-px bg-gray-200 dark:bg-gray-800' />

            {/* Page Breaks Control */}
            <div className='flex items-center justify-between'>
              <h2 className='flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100'>
                <Scissors className='size-4 text-blue-500' />
                Page Breaks
              </h2>
              <Button
                variant='toggle'
                onClick={() => setShowPageBreaks(!showPageBreaks)}>
                {showPageBreaks ? (
                  <>
                    <EyeOff className='size-3.5' />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className='size-3.5' />
                    Show
                  </>
                )}
              </Button>
            </div>

            <div className='h-px bg-gray-200 dark:bg-gray-800' />

            {/* Section Controls */}
            <div className='flex items-center justify-between gap-2'>
              <h2 className='flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100'>
                <Layers className='size-4 text-blue-500' />
                Sections
              </h2>
              <div className='flex gap-2'>
                <Button variant='toggle' onClick={handleShowHideAll}>
                  {isEverythingVisible() ? (
                    <>
                      <EyeOff className='size-3.5' />
                      <span className='w-8'>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className='size-3.5' />
                      <span className='w-8'>Show</span>
                    </>
                  )}
                </Button>
                <Button
                  variant='toggle'
                  onClick={() =>
                    toggleAllSections(
                      !Object.values(expandedSections).every(Boolean)
                    )
                  }>
                  {Object.values(expandedSections).every(Boolean) ? (
                    <>
                      <ChevronDown className='size-3.5' />
                      <span className='w-14'>Collapse</span>
                    </>
                  ) : (
                    <>
                      <ChevronRight className='size-3.5' />
                      <span className='w-14'>Expand</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className='flex-1 overflow-y-auto p-6'>
          <DndContext
            id={dndId}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragOver={handleDragOver}>
            <SortableContext
              items={availableSections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}>
              <div className='space-y-2'>
                {availableSections.map((section) => {
                  const subItems = section.getSubItems?.(editorContext);
                  const isExpanded = expandedSections[section.id];
                  const orderedSubItems =
                    subItems && subItemOrder[section.id]
                      ? (subItemOrder[section.id]
                          .map((id) => subItems.find((item) => item.id === id))
                          .filter(Boolean) as typeof subItems)
                      : subItems;

                  return (
                    <SortableItem
                      key={section.id}
                      id={section.id}
                      title={section.label}
                      isVisible={sectionVisibility[section.id]}
                      isExpanded={isExpanded}
                      onToggle={() => handleSectionToggle(section.id)}
                      onToggleExpand={
                        subItems ? () => toggleExpand(section.id) : undefined
                      }
                      hasPartialVisibility={
                        subItems
                          ? subItems.some(
                              (item) =>
                                !subItemVisibility[section.id]?.[item.id]
                            ) &&
                            subItems.some(
                              (item) => subItemVisibility[section.id]?.[item.id]
                            )
                          : false
                      }>
                      {orderedSubItems && isExpanded && (
                        <DndContext
                          id={`${subDndId}-${section.id}`}
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragOver={(event) => {
                            const { active, over } = event;
                            if (active.id !== over?.id) {
                              const oldIndex =
                                subItemOrder[section.id]?.indexOf(
                                  active.id as string
                                ) ?? -1;
                              const newIndex =
                                subItemOrder[section.id]?.indexOf(
                                  over?.id as string
                                ) ?? -1;

                              if (oldIndex !== -1 && newIndex !== -1) {
                                reorderSubItems(section.id, oldIndex, newIndex);
                              }
                            }
                          }}>
                          <SortableContext
                            items={orderedSubItems.map((item) => item.id)}
                            strategy={verticalListSortingStrategy}>
                            {orderedSubItems.map((item) => (
                              <SidebarSubItem
                                key={item.id}
                                id={item.id}
                                label={item.label}
                                isVisible={
                                  !!subItemVisibility[section.id]?.[item.id]
                                }
                                onToggle={() =>
                                  handleSubItemToggle(section.id, item.id)
                                }
                              />
                            ))}
                          </SortableContext>
                        </DndContext>
                      )}
                    </SortableItem>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </aside>
  );
}
