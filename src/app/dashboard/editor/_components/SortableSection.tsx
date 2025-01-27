import { useState } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';

import { cn } from '@/utils/cn';

type SectionVisibility = {
  reportInfo: boolean;
  weather: boolean;
  labor: boolean;
  equipment: boolean;
  photos: boolean;
};

type SectionConfig = {
  id: keyof SectionVisibility;
  label: string;
  icon: React.ReactNode;
  subItems?: {
    id: string;
    label: string;
  }[];
};

type SortableSectionProps = {
  section: SectionConfig;
  isVisible: boolean;
  onToggle: () => void;
  subItems?: {
    id: string;
    label: string;
  }[];
  subItemVisibility?: { [key: string]: boolean };
  onToggleSubItem?: (itemId: string) => void;
};

export function SortableSection({
  section,
  isVisible,
  onToggle,
  subItems,
  subItemVisibility,
  onToggleSubItem,
}: SortableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const hasSubItems = subItems && subItems.length > 0;

  return (
    <div ref={setNodeRef} style={style} className='touch-none'>
      <div className='space-y-2'>
        <button
          onClick={() => {
            onToggle();
            if (hasSubItems && !isExpanded) {
              setIsExpanded(true);
            }
          }}
          className={cn(
            'group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition',
            isVisible
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
              : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900'
          )}>
          <div className='flex items-center gap-3'>
            <div
              {...attributes}
              {...listeners}
              className='cursor-grab active:cursor-grabbing'>
              <GripVertical
                size={16}
                className='text-gray-400 transition group-hover:text-gray-500 dark:text-gray-600 dark:group-hover:text-gray-500'
              />
            </div>
            <div
              className={cn(
                'flex size-5 items-center justify-center rounded-md border transition',
                isVisible
                  ? 'border-blue-500 bg-blue-500 text-white dark:border-blue-400 dark:bg-blue-400'
                  : 'border-gray-300 group-hover:border-gray-400 dark:border-gray-700 dark:group-hover:border-gray-600'
              )}>
              {isVisible ? <Check size={12} /> : section.icon}
            </div>
            {section.label}
          </div>
          <div className='flex items-center gap-2'>
            {hasSubItems && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className='cursor-pointer rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800'>
                {isExpanded ? (
                  <ChevronDown
                    size={16}
                    className={cn(
                      'transition',
                      isVisible
                        ? 'text-blue-500 dark:text-blue-400'
                        : 'text-gray-400 dark:text-gray-600'
                    )}
                  />
                ) : (
                  <ChevronRight
                    size={16}
                    className={cn(
                      'transition',
                      isVisible
                        ? 'text-blue-500 dark:text-blue-400'
                        : 'text-gray-400 dark:text-gray-600'
                    )}
                  />
                )}
              </div>
            )}
          </div>
        </button>

        {/* Sub-items */}
        {hasSubItems && isExpanded && isVisible && (
          <div className='ml-11 space-y-1'>
            {subItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onToggleSubItem?.(item.id)}
                className={cn(
                  'flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs transition',
                  subItemVisibility?.[item.id]
                    ? 'bg-blue-50/50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-900'
                )}>
                <span className='mr-2 break-words text-left'>{item.label}</span>
                <div
                  className={cn(
                    'flex size-4 flex-none items-center justify-center rounded-md border transition',
                    subItemVisibility?.[item.id]
                      ? 'border-blue-500 bg-blue-500 text-white dark:border-blue-400 dark:bg-blue-400'
                      : 'border-gray-300 group-hover:border-gray-400 dark:border-gray-700 dark:group-hover:border-gray-600'
                  )}>
                  {subItemVisibility?.[item.id] && <Check size={10} />}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
