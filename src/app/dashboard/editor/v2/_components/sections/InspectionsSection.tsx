import Image from 'next/image';

import type { DailyLog } from '@/types/dailyReport';

type Props = {
  inspections: NonNullable<DailyLog['inspections']>;
};

function InspectionRow({
  detail,
}: {
  detail: NonNullable<DailyLog['inspections']>['details'][number];
}) {
  return (
    <tr>
      <td className='p-3 text-xs text-gray-900'>{detail.itemNumber}</td>
      <td className='p-3 text-xs text-gray-900'>
        {detail.startTimeLocalString}
      </td>
      <td className='p-3 text-xs text-gray-900'>{detail.endTimeLocalString}</td>
      <td className='p-3 text-xs text-gray-900'>{detail.inspectionType}</td>
      <td className='p-3 text-xs text-gray-900'>{detail.inspectionEntity}</td>
      <td className='p-3 text-xs text-gray-900'>{detail.inspectorName}</td>
      <td className='p-3 text-xs text-gray-900'>{detail.inspectionLocation}</td>
      <td className='p-3 text-xs text-gray-900'>{detail.inspectionArea}</td>
      <td className='p-3 text-xs text-gray-500'>{detail.inspectionNotes}</td>
    </tr>
  );
}

function InspectionImages({
  images,
}: {
  images: NonNullable<DailyLog['inspections']>['images'];
}) {
  if (!images.length) return null;

  return (
    <div className='mt-4 grid grid-cols-2 gap-4 border-t border-gray-200 pt-4'>
      {images.map((image, idx) => (
        <div key={`inspection-image-${image.url}-${idx}`} className='space-y-2'>
          <div className='relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200'>
            <Image
              src={image.url}
              alt={image.label || 'Inspection Image'}
              fill
              className='object-cover'
              unoptimized
              crossOrigin='anonymous'
            />
          </div>
          {image.label && (
            <p className='text-[10px] text-gray-500'>{image.label}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export function InspectionsSection({ inspections }: Props) {
  return (
    <div className='overflow-hidden rounded-lg border border-gray-200 bg-white/50'>
      <div className='border-b border-gray-200 bg-gray-50/50 px-4 py-3'>
        <h2 className='text-center text-xs font-semibold uppercase text-gray-700'>
          Inspections
        </h2>
      </div>
      <div className='p-4'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-gray-200'>
              <th className='pb-2 text-center text-xs font-medium text-gray-600'>
                Item #
              </th>
              <th className='pb-2 text-center text-xs font-medium text-gray-600'>
                Start Time
              </th>
              <th className='pb-2 text-center text-xs font-medium text-gray-600'>
                End Time
              </th>
              <th className='pb-2 text-center text-xs font-medium text-gray-600'>
                Inspection Type
              </th>
              <th className='pb-2 text-center text-xs font-medium text-gray-600'>
                Inspection Entity
              </th>
              <th className='pb-2 text-center text-xs font-medium text-gray-600'>
                Inspector
              </th>
              <th className='pb-2 text-center text-xs font-medium text-gray-600'>
                Location
              </th>
              <th className='pb-2 text-center text-xs font-medium text-gray-600'>
                Area
              </th>
              <th className='pb-2 text-center text-xs font-medium text-gray-600'>
                Notes
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {inspections.details.map((detail) => (
              <InspectionRow key={`${detail.itemNumber}`} detail={detail} />
            ))}
          </tbody>
        </table>
        <InspectionImages images={inspections.images} />
      </div>
    </div>
  );
}
