'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, GripVertical, X } from 'lucide-react';

import { cn } from '@/lib/utils';

type SidebarSubItemProps = {
  id: string;
  label: string;
  isVisible: boolean;
  onToggle: () => void;
};

export function SidebarSubItem({
  id,
  label,
  isVisible,
  onToggle,
}: SidebarSubItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(isDragging && 'relative z-10')}>
      <div
        {...listeners}
        className={cn(
          'group flex cursor-grab items-center gap-3 rounded-lg px-3 py-2 text-sm transition active:cursor-grabbing',
          isVisible
            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
            : 'bg-gray-50/50 text-gray-600 hover:bg-gray-100/50 dark:bg-gray-900/50 dark:text-gray-400 dark:hover:bg-gray-800/50'
        )}>
        <GripVertical className='size-4 text-gray-400 transition group-hover:text-gray-500 dark:text-gray-600 dark:group-hover:text-gray-500' />

        <button
          onClick={onToggle}
          className={cn(
            'flex size-5 items-center justify-center rounded-md border transition',
            isVisible
              ? 'border-blue-500 bg-blue-500 text-white dark:border-blue-400 dark:bg-blue-400'
              : 'border-red-300 bg-red-50 text-red-500 hover:bg-red-100 dark:border-red-700 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900'
          )}>
          {isVisible ? <Check className='size-3' /> : <X className='size-3' />}
        </button>
        <span className='flex-1'>{label}</span>
      </div>
    </div>
  );
}
