import Image from 'next/image';

import { useEditor } from '@/context/EditorContext';

import { DeliveriesSection } from './sections/DeliveriesSection';
import { EquipmentSection } from './sections/EquipmentSection';
import { InspectionsSection } from './sections/InspectionsSection';
import { LaborSection } from './sections/LaborSection';
import { NotesSection } from './sections/NotesSection';
import { PhotosSection } from './sections/PhotosSection';
import { QuantitiesSection } from './sections/QuantitiesSection';
import { QuestionsSection } from './sections/QuestionsSection';
import { ReportInfo } from './sections/ReportInfo';
import { VisitorsSection } from './sections/VisitorsSection';
import { WeatherSection } from './sections/WeatherSection';

export function DocumentPreview() {
  const {
    report,
    selectedProject,
    showPageBreaks,
    sectionVisibility,
    subItemVisibility,
  } = useEditor();

  // Helper to filter visible items
  const filterVisibleItems = <T extends { id: string }>(
    items: T[] | undefined,
    sectionId: string
  ): T[] => {
    if (!items) return [];
    return items.filter((item) => subItemVisibility[sectionId]?.[item.id]);
  };

  return (
    <div className='relative'>
      {/* Page break lines */}
      {showPageBreaks && (
        <div
          className='pointer-events-none absolute -inset-y-4 inset-x-0 z-10'
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent, transparent calc(11.69in + 2rem - 2px), #ef4444 calc(11.69in + 2rem - 2px), #ef4444 calc(11.69in + 2rem))',
            backgroundSize: '100% calc(11.69in + 3rem)',
          }}
        />
      )}
      <div className='relative mx-auto w-[8.27in] rounded-lg bg-white px-8 py-4 shadow-lg ring-1 ring-black/[0.1]'>
        {/* Company Header */}
        <div className='mb-8 border-b border-gray-200 pb-4'>
          <div className='flex items-center justify-between'>
            <h1 className='text-lg font-semibold text-blue-500'>
              {report.companyName}
            </h1>
            <Image
              src={report.companyLogo}
              alt='Company Logo'
              width={100}
              height={24}
              className='object-contain'
              unoptimized
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = '/next.svg';
              }}
              priority
            />
          </div>
        </div>

        <div className='space-y-6'>
          {sectionVisibility.reportInfo && (
            <ReportInfo project={selectedProject} report={report} />
          )}

          {sectionVisibility.weather && selectedProject.weather && (
            <WeatherSection
              weather={{
                ...selectedProject.weather,
                summary: filterVisibleItems(
                  selectedProject.weather.summary.map((w) => ({
                    ...w,
                    id: w.forecastTimeTzFormatted,
                  })),
                  'weather'
                ),
              }}
            />
          )}

          {sectionVisibility.labor && selectedProject.labor && (
            <LaborSection
              labor={{
                ...selectedProject.labor,
                details: filterVisibleItems(
                  selectedProject.labor.details.map((l) => ({
                    ...l,
                    id: l.nameRow.nameCell.crewName,
                  })),
                  'labor'
                ),
              }}
              hoursLabels={report.hoursLabels}
            />
          )}

          {sectionVisibility.equipment && selectedProject.equipment && (
            <EquipmentSection
              equipment={{
                ...selectedProject.equipment,
                details: filterVisibleItems(
                  selectedProject.equipment.details.map((e) => ({
                    ...e,
                    id: e.nameRow.nameCell.equipName,
                  })),
                  'equipment'
                ),
              }}
              hoursLabels={report.hoursLabels}
            />
          )}

          {sectionVisibility.questions && selectedProject.questions && (
            <QuestionsSection
              questions={{
                ...selectedProject.questions,
                details: filterVisibleItems(
                  selectedProject.questions.details.map((q) => ({
                    ...q,
                    id: q.fullName,
                  })),
                  'questions'
                ),
              }}
            />
          )}

          {sectionVisibility.quantities && selectedProject.quantities && (
            <QuantitiesSection
              quantities={{
                ...selectedProject.quantities,
                details: filterVisibleItems(
                  selectedProject.quantities.details.map((q) => ({
                    ...q,
                    id: q.itemNumber,
                  })),
                  'quantities'
                ),
              }}
            />
          )}

          {sectionVisibility.deliveries && selectedProject.deliveries && (
            <DeliveriesSection
              deliveries={{
                ...selectedProject.deliveries,
                details: filterVisibleItems(
                  selectedProject.deliveries.details.map((d) => ({
                    ...d,
                    id: d.itemNumber,
                  })),
                  'deliveries'
                ),
              }}
            />
          )}

          {sectionVisibility.inspections && selectedProject.inspections && (
            <InspectionsSection
              inspections={{
                ...selectedProject.inspections,
                details: filterVisibleItems(
                  selectedProject.inspections.details.map((i) => ({
                    ...i,
                    id: i.itemNumber,
                  })),
                  'inspections'
                ),
              }}
            />
          )}

          {sectionVisibility.visitors && selectedProject.visitors && (
            <VisitorsSection
              visitors={{
                ...selectedProject.visitors,
                details: filterVisibleItems(
                  selectedProject.visitors.details.map((v) => ({
                    ...v,
                    id: v.itemNumber,
                  })),
                  'visitors'
                ),
              }}
            />
          )}

          {sectionVisibility.notes && selectedProject.notes && (
            <NotesSection
              notes={{
                ...selectedProject.notes,
                details: filterVisibleItems(
                  selectedProject.notes.details.map((n) => ({
                    ...n,
                    id: n.itemNumber,
                  })),
                  'notes'
                ),
              }}
            />
          )}

          {sectionVisibility.photos && selectedProject.images && (
            <PhotosSection
              images={{
                ...selectedProject.images,
                details: filterVisibleItems(
                  selectedProject.images.details.map((p, i) => ({
                    ...p,
                    id: p.url || `photo-${i}`,
                  })),
                  'photos'
                ),
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
