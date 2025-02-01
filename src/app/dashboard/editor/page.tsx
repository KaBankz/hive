'use client';

import { notFound, useSearchParams } from 'next/navigation';

import { EditorProvider } from '@/context/EditorContext';
import type { DailyReport } from '@/types/dailyReport';

import dailyReportData from '../../../../public/dailyReportData.json';
import { DocumentPreview } from './_components/DocumentPreview';
import { Sidebar } from './_components/Sidebar';

export default function EditorPage() {
  const searchParams = useSearchParams();
  const projectIndex = parseInt(searchParams.get('project') || '');
  const report = dailyReportData as unknown as DailyReport;

  if (!report.dailyLogs[projectIndex]) notFound();

  return (
    <EditorProvider report={report} projectIndex={projectIndex}>
      <div className='min-h-screen touch-none lg:touch-auto'>
        <div className='fixed inset-0 z-50 touch-none lg:hidden'>
          <div className='absolute inset-0 touch-none bg-black/80 backdrop-blur-sm' />
          <div className='relative flex h-full items-center justify-center px-4'>
            <div className='w-full max-w-sm rounded-lg bg-white p-6 text-center dark:bg-zinc-900'>
              <h2 className='mb-2 text-xl font-semibold text-gray-900 dark:text-white'>
                Desktop Only
              </h2>
              <p className='text-gray-600 dark:text-gray-400'>
                The editor is optimized for desktop screens. Please use a larger
                device to access the editor.
              </p>
            </div>
          </div>
        </div>

        <div className='flex h-full pt-16'>
          <div className='flex-1'>
            <div className='h-[calc(100vh-4rem)] overflow-auto'>
              <div className='mx-auto py-8'>
                <DocumentPreview />
              </div>
            </div>
          </div>

          <Sidebar />
        </div>
      </div>
    </EditorProvider>
  );
}
