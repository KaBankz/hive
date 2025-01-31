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
      <div className='min-h-screen pt-16'>
        <div className='flex h-full'>
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
