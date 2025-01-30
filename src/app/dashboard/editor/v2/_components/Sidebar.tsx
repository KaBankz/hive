'use client';

import { useState } from 'react';

import { Eye, EyeOff, FileDown, Layers, Scissors } from 'lucide-react';

import { Button } from '@/components/Button';
import { useEditor } from '@/context/EditorContext';

import { SidebarSection, SidebarSubItem } from './sections/SidebarSection';

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

type SidebarProps = {
  isGenerating?: boolean;
  onExport?: () => void;
};

export function Sidebar({ isGenerating = false, onExport }: SidebarProps) {
  const editorContext = useEditor();
  const {
    showPageBreaks,
    setShowPageBreaks,
    sectionVisibility,
    subItemVisibility,
    toggleSection,
    toggleSubItem,
  } = editorContext;

  // Track expanded state for each section
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(() => {
    // Initialize all sections as expanded
    return Object.values(SECTION_CONFIG).reduce(
      (acc, section) => ({
        ...acc,
        [section.id]: true,
      }),
      {}
    );
  });

  // Get available sections based on data
  const availableSections = Object.values(SECTION_CONFIG).filter((section) => {
    if (section.id === 'reportInfo') return true;
    const subItems = section.getSubItems?.(editorContext);
    return subItems && subItems.length > 0;
  });

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

  return (
    <aside className='h-[calc(100vh-4rem)] w-[400px] border-l border-gray-200 dark:border-gray-800'>
      <div className='flex h-full flex-col bg-white dark:bg-black/30'>
        {/* Fixed Header */}
        <div className='border-b border-gray-200 px-6 py-4 dark:border-gray-800'>
          <div className='space-y-6'>
            {/* Export Button */}
            <Button
              variant='default'
              size='full'
              disabled={isGenerating}
              onClick={onExport}
              className='group'>
              <FileDown className='size-4' />
              <span>{isGenerating ? 'Generating PDF...' : 'Export PDF'}</span>
            </Button>

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

            {/* Sections Control */}
            <div className='flex items-center justify-between'>
              <h2 className='flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100'>
                <Layers className='size-4 text-blue-500' />
                Document Sections
              </h2>
              <Button
                variant='toggle'
                onClick={() =>
                  toggleSection(
                    Object.values(sectionVisibility).every(Boolean)
                      ? 'hideAll'
                      : 'showAll'
                  )
                }>
                {Object.values(sectionVisibility).every(Boolean) ? (
                  <>
                    <EyeOff className='size-3.5' />
                    Hide All
                  </>
                ) : (
                  <>
                    <Eye className='size-3.5' />
                    Show All
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className='flex-1 overflow-y-auto p-6'>
          <div className='space-y-4'>
            {availableSections.map((section) => {
              const subItems = section.getSubItems?.(editorContext);
              const hasSubItems = subItems && subItems.length > 0;
              const isExpanded = expandedSections[section.id] ?? true;

              // Calculate if any sub-items are visible but not all
              const hasPartialVisibility = hasSubItems
                ? subItems.some(
                    (item) => subItemVisibility[section.id]?.[item.id]
                  ) &&
                  !subItems.every(
                    (item) => subItemVisibility[section.id]?.[item.id]
                  )
                : false;

              return (
                <SidebarSection
                  key={section.id}
                  title={section.label}
                  isVisible={sectionVisibility[section.id] ?? false}
                  isExpanded={isExpanded}
                  onToggle={() => handleSectionToggle(section.id)}
                  onToggleExpand={
                    hasSubItems ? () => toggleExpand(section.id) : undefined
                  }
                  hasPartialVisibility={hasPartialVisibility}>
                  {subItems?.map((item) => (
                    <SidebarSubItem
                      key={item.id}
                      label={item.label}
                      isVisible={
                        subItemVisibility[section.id]?.[item.id] ?? false
                      }
                      onToggle={() => handleSubItemToggle(section.id, item.id)}
                    />
                  ))}
                </SidebarSection>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
