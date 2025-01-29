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
import { Download, Eye, EyeOff, Layers, Scissors } from 'lucide-react';

import { SortableSection } from './SortableSection';

type SectionVisibility = {
  reportInfo: boolean;
  weather: boolean;
  labor: boolean;
  equipment: boolean;
  photos: boolean;
  questions: boolean;
  quantities: boolean;
  deliveries: boolean;
  inspections: boolean;
  visitors: boolean;
  notes: boolean;
};

type SubItemVisibility = {
  weather: { [key: string]: boolean }; // key is forecastTimeTzFormatted
  labor: { [key: string]: boolean }; // key is crewName
  equipment: { [key: string]: boolean }; // key is equipName
  photos: { [key: string]: boolean }; // key is photo url
  questions: { [key: string]: boolean }; // key is fullName
  quantities: { [key: string]: boolean }; // key is itemNumber
  deliveries: { [key: string]: boolean }; // key is itemNumber
  inspections: { [key: string]: boolean }; // key is itemNumber
  visitors: { [key: string]: boolean }; // key is itemNumber
  notes: { [key: string]: boolean }; // key is itemNumber
};

type SectionConfig = {
  id: keyof SectionVisibility;
  label: string;
  icon: React.ReactNode;
  subItems?: {
    id: string;
    label: string;
  }[];
};

// First, let's define proper types for the weather, labor, equipment etc. items
type WeatherItem = {
  forecastTimeTzFormatted: string;
  tempF: number;
};

type LaborItem = {
  nameRow: {
    nameCell: {
      crewName: string;
    };
  };
};

type EquipmentItem = {
  nameRow: {
    nameCell: {
      equipName: string;
    };
  };
};

type PhotoItem = {
  url: string;
  note: string;
};

type QuestionItem = {
  fullName: string;
};

type QuantityItem = {
  itemNumber: string;
  _costCodeAndDescription: string;
};

type DeliveryItem = {
  itemNumber: string;
  deliveryFrom: string;
  deliveryContents: string;
};

type InspectionItem = {
  itemNumber: string;
  inspectionType: string;
  inspectorName: string;
};

type VisitorItem = {
  itemNumber: string;
  visitorName: string;
  startTimeLocalString: string;
};

type NoteItem = {
  itemNumber: string;
  noteLocation: string;
  notes: string;
};

// Update the selectedProject type
type Project = {
  weather?: { summary: WeatherItem[] };
  labor?: { details: LaborItem[] };
  equipment?: { details: EquipmentItem[] };
  images?: { details: PhotoItem[] };
  questions?: { details: QuestionItem[] };
  quantities?: { details: QuantityItem[] };
  deliveries?: { details: DeliveryItem[] };
  inspections?: { details: InspectionItem[] };
  visitors?: { details: VisitorItem[] };
  notes?: { details: NoteItem[] };
};

type SidebarProps = {
  isGenerating: boolean;
  onExport: () => void;
  sectionVisibility: SectionVisibility;
  setSectionVisibility: (
    visibility:
      | SectionVisibility
      | ((prev: SectionVisibility) => SectionVisibility)
  ) => void;
  subItemVisibility: SubItemVisibility;
  onToggleSubItem: (section: keyof SubItemVisibility, itemKey: string) => void;
  sectionOrder: Array<keyof SectionVisibility>;
  orderedSections: SectionConfig[];
  onDragEnd: (event: DragEndEvent) => void;
  showPageBreaks?: boolean;
  onTogglePageBreaks?: (show: boolean) => void;
  selectedProject: Project;
  subItemOrder: { [K in keyof SubItemVisibility]: string[] };
};

export function Sidebar({
  isGenerating,
  onExport,
  sectionVisibility,
  setSectionVisibility,
  subItemVisibility,
  onToggleSubItem,
  sectionOrder,
  orderedSections,
  onDragEnd,
  showPageBreaks = true,
  onTogglePageBreaks,
  selectedProject,
  subItemOrder,
}: SidebarProps) {
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

  // Get sub-items for each section
  const getSubItems = (
    section: SectionConfig
  ): { id: string; label: string }[] => {
    const items = (() => {
      switch (section.id) {
        case 'weather':
          return (
            selectedProject.weather?.summary.map((w: WeatherItem) => ({
              id: w.forecastTimeTzFormatted,
              label: `${w.forecastTimeTzFormatted} - ${w.tempF}°F`,
            })) || []
          );
        case 'labor':
          return (
            selectedProject.labor?.details.map((l: any) => ({
              id: l.nameRow.nameCell.crewName,
              label: l.nameRow.nameCell.crewName,
            })) || []
          );
        case 'equipment':
          return (
            selectedProject.equipment?.details.map((e: any) => ({
              id: e.nameRow.nameCell.equipName,
              label: e.nameRow.nameCell.equipName,
            })) || []
          );
        case 'photos':
          return (
            selectedProject.images?.details.map((p: any, idx: number) => ({
              id: p.url || `photo-${idx}`,
              label: p.note || `Photo ${idx + 1}`,
            })) || []
          );
        case 'questions':
          return (
            selectedProject.questions?.details.map((q: any) => ({
              id: q.fullName,
              label: q.fullName,
            })) || []
          );
        case 'quantities':
          return (
            selectedProject.quantities?.details.map((q: any) => ({
              id: q.itemNumber,
              label: `Item ${q.itemNumber} - ${q._costCodeAndDescription || 'No Description'}`,
            })) || []
          );
        case 'deliveries':
          return (
            selectedProject.deliveries?.details.map((d: any) => ({
              id: d.itemNumber,
              label: `${d.deliveryFrom} - ${d.deliveryContents}`,
            })) || []
          );
        case 'inspections':
          return (
            selectedProject.inspections?.details.map((i: any) => ({
              id: i.itemNumber,
              label: `${i.inspectionType} - ${i.inspectorName}`,
            })) || []
          );
        case 'visitors':
          return (
            selectedProject.visitors?.details.map((v: any) => ({
              id: v.itemNumber,
              label: `${v.visitorName} - ${v.startTimeLocalString}`,
            })) || []
          );
        case 'notes':
          return (
            selectedProject.notes?.details.map((n: any) => ({
              id: n.itemNumber,
              label: `${n.noteLocation} - ${n.notes.substring(0, 30)}${n.notes.length > 30 ? '...' : ''}`,
            })) || []
          );
        default:
          return [];
      }
    })();

    // Update the sorting to use proper types
    if (subItemOrder[section.id as keyof SubItemVisibility]) {
      const order = subItemOrder[section.id as keyof SubItemVisibility];
      return items.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
    }

    return items;
  };

  return (
    <div className='w-80 flex-none border-l border-gray-200 bg-white/70 backdrop-blur-xl backdrop-saturate-150 dark:border-white/[0.1] dark:bg-black/30'>
      <div className='flex h-[calc(100vh-4rem)] flex-col'>
        {/* Fixed header */}
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
              <Scissors className='size-4 text-blue-500' />
              Page Breaks
            </h2>
            <button
              onClick={() => onTogglePageBreaks?.(!showPageBreaks)}
              className='inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors duration-200 hover:border-gray-300 hover:bg-gray-50 dark:border-white/[0.1] dark:text-zinc-400 dark:hover:border-white/[0.2] dark:hover:bg-white/[0.02]'>
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
                    ...prev,
                    reportInfo: !allVisible,
                    weather: !allVisible,
                    labor: !allVisible,
                    equipment: !allVisible,
                    photos: !allVisible,
                    questions: !allVisible,
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

        {/* Scrollable content */}
        <div className='flex-1 overflow-y-auto p-6'>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}>
            <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
              <div className='space-y-4'>
                {orderedSections.map((section) => {
                  const sectionSubItems = getSubItems(section);
                  return (
                    <div key={section.id}>
                      <SortableSection
                        section={section}
                        isVisible={sectionVisibility[section.id]}
                        onToggle={() => toggleSection(section.id)}
                        subItems={sectionSubItems}
                        subItemVisibility={
                          subItemVisibility[section.id as keyof SubItemVisibility]
                        }
                        onToggleSubItem={(itemId) =>
                          onToggleSubItem(
                            section.id as keyof SubItemVisibility,
                            itemId
                          )
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
