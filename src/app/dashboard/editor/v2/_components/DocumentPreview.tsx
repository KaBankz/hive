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
  const { report, selectedProject, showPageBreaks } = useEditor();

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
          <ReportInfo project={selectedProject} report={report} />
          {selectedProject.weather && (
            <WeatherSection weather={selectedProject.weather} />
          )}
          {selectedProject.labor && (
            <LaborSection
              labor={selectedProject.labor}
              hoursLabels={report.hoursLabels}
            />
          )}
          {selectedProject.equipment && (
            <EquipmentSection
              equipment={selectedProject.equipment}
              hoursLabels={report.hoursLabels}
            />
          )}
          {selectedProject.questions && (
            <QuestionsSection questions={selectedProject.questions} />
          )}
          {selectedProject.quantities && (
            <QuantitiesSection quantities={selectedProject.quantities} />
          )}
          {selectedProject.deliveries && (
            <DeliveriesSection deliveries={selectedProject.deliveries} />
          )}
          {selectedProject.inspections && (
            <InspectionsSection inspections={selectedProject.inspections} />
          )}
          {selectedProject.visitors && (
            <VisitorsSection visitors={selectedProject.visitors} />
          )}
          {selectedProject.notes && (
            <NotesSection notes={selectedProject.notes} />
          )}
          {selectedProject.images && (
            <PhotosSection images={selectedProject.images} />
          )}
        </div>
      </div>
    </div>
  );
}
