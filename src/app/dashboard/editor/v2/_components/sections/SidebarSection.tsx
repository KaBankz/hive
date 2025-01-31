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
  X,
} from 'lucide-react';

import { cn } from '@/lib/utils';

type SidebarSectionProps = {
  title: string;
  isVisible: boolean;
  isExpanded: boolean;
  onToggle?: () => void;
  onToggleExpand?: () => void;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  hasPartialVisibility?: boolean;
};

export function SidebarSection({
  title,
  isVisible,
  isExpanded,
  onToggle,
  onToggleExpand,
  icon,
  children,
  hasPartialVisibility = false,
}: SidebarSectionProps) {
  return (
    <div className='touch-none'>
      <div className='space-y-2'>
        <div
          className={cn(
            'group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition',
            isVisible
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
              : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900'
          )}>
          <button onClick={onToggle} className='flex flex-1 items-center gap-3'>
            <div className='cursor-grab active:cursor-grabbing'>
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
                icon || <Eye className='size-3' />
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
    transform: CSS.Translate.toString(transform),
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
