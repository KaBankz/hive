import Image from 'next/image';

import type { DailyLog } from '@/types/dailyReport';

type Props = {
  images: NonNullable<DailyLog['images']>;
};

export function ImagesSection({ images }: Props) {
  if (!images.details.length) return null;

  return (
    <div className='overflow-hidden rounded-lg border border-gray-200 bg-white/50'>
      <div className='border-b border-gray-200 bg-gray-50/50 px-4 py-3'>
        <h2 className='text-center text-xs font-semibold uppercase text-gray-700'>
          Images
        </h2>
      </div>
      <div className='p-4'>
        <div className='grid grid-cols-2 gap-4'>
          {images.details.map((image, idx) => (
            <div key={`image-${image.url}-${idx}`} className='space-y-2'>
              <div className='relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200'>
                <Image
                  src={image.url}
                  alt={image.note || 'Project Image'}
                  fill
                  className='object-cover'
                  unoptimized
                />
              </div>
              {image.note && (
                <p className='text-[10px] text-gray-500'>{image.note}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
