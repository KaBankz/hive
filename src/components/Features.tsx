import { GripVertical } from "lucide-react";

import { Download, Settings2 } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: GripVertical,
      title: 'Drag & Drop Editor',
      description:
        'Easily reorganize report sections with intuitive drag-and-drop functionality.',
    },
    {
      icon: Download,
      title: 'PDF Export',
      description:
        'Generate professional PDF reports with a single click for easy sharing.',
    },
   
    {
      icon: Settings2,
      title: 'Section Controls',
      description:
        'Show or hide report sections instantly to create the perfect layout.',
    },

  ];
  return (
    <>
      <div className='mt-16 text-center'>
        <h1 className='text-4xl font-bold'>How Are we making it easier?</h1>
        <p className='text-lg text-gray-600 dark:text-zinc-400'>
          We are making it easier to create professional reports quickly and easily.
        </p>
      </div>
      <div className='grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3'>
        {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className='group rounded-2xl border border-gray-200 bg-white p-8 transition duration-200 hover:border-gray-300 hover:bg-gray-50 dark:border-white/[0.1] dark:bg-white/[0.02] dark:hover:border-white/[0.2] dark:hover:bg-white/[0.04]'>
                  <Icon className='mb-4 size-8 text-blue-500' />
                  <h3 className='mb-2 text-xl font-semibold text-gray-900 dark:text-white'>
                    {feature.title}
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-zinc-400'>
                    {feature.description}
                  </p>
            </div>
          );
        })}
    </div>
    </>
  );
}
