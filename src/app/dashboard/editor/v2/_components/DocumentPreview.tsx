import Image from 'next/image';

import type { DailyReport } from '@/types/dailyReport';

import { ReportInfo } from './sections/ReportInfo';
import { WeatherSection } from './sections/WeatherSection';

type DocumentPreviewProps = {
  report: DailyReport;
  projectIndex: number;
};

export function DocumentPreview({
  report,
  projectIndex,
}: DocumentPreviewProps) {
  const project = report.dailyLogs[projectIndex];

  return (
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
        <ReportInfo project={project} />
        {project.weather && <WeatherSection weather={project.weather} />}
      </div>
    </div>
  );
}
