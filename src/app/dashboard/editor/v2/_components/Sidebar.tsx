'use client';

export function Sidebar() {
  return (
    <aside className='h-[calc(100vh-4rem)] w-[400px] border-l border-gray-200 dark:border-gray-800'>
      <div className='flex h-full flex-col bg-white dark:bg-black/30'>
        <div className='border-b border-gray-200 px-4 py-3 dark:border-gray-800'>
          <h2 className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
            Editor
          </h2>
        </div>
        <div className='flex-1 overflow-auto px-4 py-3'>
          {/* Content will be added here */}
        </div>
      </div>
    </aside>
  );
}
