'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

import type { DailyReport } from '@/types/dailyReport';

import dailyReportData from '../../../../../public/dailyReportData.json';
import { DocumentPreview } from './_components/DocumentPreview';
import { Sidebar } from './_components/Sidebar';

export default function EditorV2Page() {
  const searchParams = useSearchParams();
  const projectIndex = parseInt(searchParams.get('project') || '0');
  const report = dailyReportData as unknown as DailyReport;
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPageBreaks, setShowPageBreaks] = useState(true);

  const handleExportPDF = async () => {
    setIsGenerating(true);
    try {
      // PDF export logic will be added here
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className='min-h-screen pt-16'>
      <div className='flex h-full'>
        <div className='flex-1'>
          <div className='h-[calc(100vh-4rem)] overflow-auto'>
            <div className='mx-auto py-8'>
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
                <DocumentPreview report={report} projectIndex={projectIndex} />
              </div>
            </div>
          </div>
        </div>

        <Sidebar
          isGenerating={isGenerating}
          showPageBreaks={showPageBreaks}
          onTogglePageBreaks={setShowPageBreaks}
          onExport={handleExportPDF}
        />
      </div>
    </div>
  );
}
