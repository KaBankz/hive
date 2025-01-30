'use client';

import { useSearchParams } from 'next/navigation';

import type { DailyReport } from '@/types/dailyReport';

import dailyReportData from '../../../../../public/dailyReportData.json';
import { DocumentPreview } from './_components/DocumentPreview';
import { Sidebar } from './_components/Sidebar';

export default function EditorV2Page() {
  const searchParams = useSearchParams();
  const projectIndex = parseInt(searchParams.get('project') || '0');
  const report = dailyReportData as unknown as DailyReport;

  return (
    <div className='min-h-screen pt-16'>
      <div className='flex h-full'>
        <div className='flex-1'>
          <div className='h-[calc(100vh-4rem)] overflow-auto'>
            <div className='mx-auto py-8'>
              <DocumentPreview report={report} projectIndex={projectIndex} />
            </div>
          </div>
        </div>

        <Sidebar />
      </div>
    </div>
  );
}
