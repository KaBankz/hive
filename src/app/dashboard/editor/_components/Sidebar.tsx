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
import { Download, Eye, EyeOff, Layers } from 'lucide-react';

import { SortableSection } from './SortableSection';

type SectionVisibility = {
  reportInfo: boolean;
  weather: boolean;
  labor: boolean;
  equipment: boolean;
  photos: boolean;
};

type SectionConfig = {
  id: keyof SectionVisibility;
  label: string;
  icon: React.ReactNode;
};

export function Sidebar({
  isGenerating,
  onExport,
  sectionVisibility,
  setSectionVisibility,
  sectionOrder,
  orderedSections,
  onDragEnd,
}: {
  isGenerating: boolean;
  onExport: () => void;
  sectionVisibility: SectionVisibility;
  setSectionVisibility: (
    visibility:
      | SectionVisibility
      | ((prev: SectionVisibility) => SectionVisibility)
  ) => void;
  sectionOrder: Array<keyof SectionVisibility>;
  orderedSections: SectionConfig[];
  onDragEnd: (event: DragEndEvent) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleSection = (section: keyof SectionVisibility) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className='w-80 flex-none border-l border-gray-200 bg-white/70 backdrop-blur-xl backdrop-saturate-150 dark:border-white/[0.1] dark:bg-black/30'>
      <div className='flex h-full flex-col'>
        <div className='flex-none space-y-6 border-b border-gray-200 p-6 dark:border-white/[0.1]'>
          <div className='space-y-4'>
            <button
              onClick={onExport}
              disabled={isGenerating}
              className='group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50'>
              <Download className='size-4' />
              <span>{isGenerating ? 'Generating PDF...' : 'Export PDF'}</span>
            </button>
          </div>
          <div className='h-px bg-gray-200 dark:bg-white/[0.1]' />
          <div className='flex items-center justify-between'>
            <h2 className='flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white'>
              <Layers className='size-4 text-blue-500' />
              Document Sections
            </h2>
            <button
              onClick={() =>
                setSectionVisibility((prev) => {
                  const allVisible = Object.values(prev).every(Boolean);
                  return {
                    reportInfo: !allVisible,
                    weather: !allVisible,
                    labor: !allVisible,
                    equipment: !allVisible,
                    photos: !allVisible,
                  };
                })
              }
              className='inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors duration-200 hover:border-gray-300 hover:bg-gray-50 dark:border-white/[0.1] dark:text-zinc-400 dark:hover:border-white/[0.2] dark:hover:bg-white/[0.02]'>
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
            </button>
          </div>
        </div>
        <div className='flex-1 overflow-y-auto p-6'>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}>
            <SortableContext
              items={sectionOrder}
              strategy={verticalListSortingStrategy}>
              <div className='space-y-4'>
                {orderedSections.map((section) => (
                  <SortableSection
                    key={section.id}
                    section={section}
                    isVisible={sectionVisibility[section.id]}
                    onToggle={() => toggleSection(section.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
