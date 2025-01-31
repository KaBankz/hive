'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronRight, GripVertical, Minus, X } from 'lucide-react';

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
        className={cn(
          children && 'space-y-2',
          isDragging && 'bg-white dark:bg-black/30'
        )}>
        <div
          {...listeners}
          className={cn(
            'group flex w-full cursor-grab items-center gap-3 rounded-lg px-3 py-2 text-sm transition active:cursor-grabbing',
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
                ? hasPartialVisibility
                  ? 'border-yellow-400 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-400 dark:hover:bg-yellow-900'
                  : 'border-blue-500 bg-blue-500 text-white dark:border-blue-400 dark:bg-blue-400'
                : 'border-red-300 bg-red-50 text-red-500 hover:bg-red-100 dark:border-red-700 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900'
            )}>
            {isVisible ? (
              hasPartialVisibility ? (
                <Minus className='size-3' />
              ) : (
                <Check className='size-3' />
              )
            ) : (
              <X className='size-3' />
            )}
          </button>

          <span className='flex-1'>{title}</span>

          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              className={cn(
                'rounded-md p-1 transition-colors',
                isVisible
                  ? 'hover:bg-blue-100 dark:hover:bg-blue-900'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              )}>
              <motion.div
                initial={false}
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}>
                <ChevronRight
                  className={cn(
                    'size-4',
                    isVisible
                      ? 'text-blue-500 dark:text-blue-400'
                      : 'text-gray-400 dark:text-gray-600'
                  )}
                />
              </motion.div>
            </button>
          )}
        </div>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className='overflow-hidden'>
              <div className='ml-11 space-y-1'>{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
