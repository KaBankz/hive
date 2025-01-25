'use client';

import { Clock, FileText } from 'lucide-react';

export function Footer() {
  return (
    <footer className='border-t border-gray-100 bg-white px-6 py-4'>
      <div className='mx-auto flex max-w-[1920px] items-center justify-between text-sm text-gray-500'>
        <div className='flex items-center space-x-2'>
          <FileText className='size-4 text-gray-400' />
          <span>Page 1 of 1</span>
        </div>
        <div className='flex items-center space-x-2'>
          <Clock className='size-4 text-gray-400' />
          <span>Last saved: March 15, 2025 10:30 AM</span>
        </div>
      </div>
    </footer>
  );
}
