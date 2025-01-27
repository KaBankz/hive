import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, ChevronRight, GripVertical } from 'lucide-react';

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
};

export function SortableSection({
  section,
  isVisible,
  onToggle,
}: {
  section: SectionConfig;
  isVisible: boolean;
  onToggle: () => void;
}) {
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

  return (
    <div ref={setNodeRef} style={style} className='touch-none'>
      <button
        onClick={onToggle}
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
        <ChevronRight
          size={16}
          className={cn(
            'transition',
            isVisible
              ? 'text-blue-500 dark:text-blue-400'
              : 'text-gray-400 dark:text-gray-600'
          )}
        />
      </button>
    </div>
  );
}
