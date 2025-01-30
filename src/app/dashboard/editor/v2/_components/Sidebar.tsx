'use client';

import { Eye, EyeOff, FileDown, Layers, Scissors } from 'lucide-react';

import { Button } from '@/components/Button';

type SidebarProps = {
  isGenerating?: boolean;
  showPageBreaks?: boolean;
  onTogglePageBreaks?: (show: boolean) => void;
  onExport?: () => void;
};

export function Sidebar({
  isGenerating = false,
  showPageBreaks = true,
  onTogglePageBreaks,
  onExport,
}: SidebarProps) {
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
                onClick={() => onTogglePageBreaks?.(!showPageBreaks)}>
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
              <Button variant='toggle'>
                <EyeOff className='size-3.5' />
                Hide All
              </Button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className='flex-1 overflow-y-auto p-6'>
          <div className='space-y-4'>
            {/* Section Items will be rendered here */}
          </div>
        </div>
      </div>
    </aside>
  );
}
