'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Check,
  ChevronDown,
  ChevronRight,
  Eye,
  GripVertical,
  Minus,
} from 'lucide-react';

import { cn } from '@/lib/utils';

type SortableItemProps = {
  id: string;
  title: string;
  isVisible: boolean;
  isExpanded: boolean;
  onToggle?: () => void;
  onToggleExpand?: () => void;
  hasPartialVisibility?: boolean;
  children?: React.ReactNode;
};

export function SortableItem({
  id,
  title,
  isVisible,
  isExpanded,
  onToggle,
  onToggleExpand,
  hasPartialVisibility = false,
  children,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    width: '100%',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn('touch-none', isDragging && 'relative z-10 opacity-50')}
      {...attributes}>
      <div
        className={cn('space-y-2', isDragging && 'bg-white dark:bg-black/30')}>
        <div
          className={cn(
            'group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition',
            isVisible
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
              : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900'
          )}>
          <button onClick={onToggle} className='flex flex-1 items-center gap-3'>
            <div {...listeners} className='cursor-grab active:cursor-grabbing'>
              <GripVertical className='size-4 text-gray-400 transition group-hover:text-gray-500 dark:text-gray-600 dark:group-hover:text-gray-500' />
            </div>
            <div
              className={cn(
                'flex size-5 items-center justify-center rounded-md border transition',
                isVisible
                  ? hasPartialVisibility
                    ? 'border-blue-300 bg-blue-300 text-white dark:border-blue-300/80 dark:bg-blue-300/80'
                    : 'border-blue-500 bg-blue-500 text-white dark:border-blue-400 dark:bg-blue-400'
                  : 'border-gray-300 group-hover:border-gray-400 dark:border-gray-700 dark:group-hover:border-gray-600'
              )}>
              {isVisible ? (
                hasPartialVisibility ? (
                  <Minus className='size-3' />
                ) : (
                  <Check className='size-3' />
                )
              ) : (
                <Eye className='size-3' />
              )}
            </div>
            {title}
          </button>
          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              className={cn(
                'rounded-md p-1 transition-colors',
                isVisible
                  ? 'hover:bg-blue-100 dark:hover:bg-blue-900'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              )}>
              {isExpanded ? (
                <ChevronDown
                  className={cn(
                    'size-4 transition-transform duration-200',
                    isVisible
                      ? 'text-blue-500 dark:text-blue-400'
                      : 'text-gray-400 dark:text-gray-600'
                  )}
                />
              ) : (
                <ChevronRight
                  className={cn(
                    'size-4 transition-transform duration-200',
                    isVisible
                      ? 'text-blue-500 dark:text-blue-400'
                      : 'text-gray-400 dark:text-gray-600'
                  )}
                />
              )}
            </button>
          )}
        </div>

        {/* Sub-items */}
        {isExpanded && <div className='ml-11 space-y-1'>{children}</div>}
      </div>
    </div>
  );
}
