import Image from 'next/image';

import type { DailyLog } from '@/types/dailyReport';

type Props = {
  deliveries: NonNullable<DailyLog['deliveries']>;
};

function DeliveryRow({
  detail,
  isEven,
}: {
  detail: NonNullable<DailyLog['deliveries']>['details'][number];
  isEven: boolean;
}) {
  return (
    <tr className={isEven ? 'bg-gray-50/50' : undefined}>
      <td className='p-3 text-xs text-gray-900'>{detail.itemNumber}</td>
      <td className='p-3 text-xs text-gray-900'>
        {detail.deliveryTimeLocalString}
      </td>
      <td className='p-3 text-xs text-gray-900'>{detail.deliveryFrom}</td>
      <td className='p-3 text-xs text-gray-900'>
        {detail.deliveryTrackingNumber}
      </td>
      <td className='p-3 text-xs text-gray-900'>{detail.deliveryLocation}</td>
      <td className='p-3 text-xs text-gray-900'>{detail.deliveryContents}</td>
      <td className='p-3 text-xs text-gray-500'>{detail.deliveryNotes}</td>
    </tr>
  );
}

function DeliveryImages({
  images,
}: {
  images: NonNullable<DailyLog['deliveries']>['images'];
}) {
  if (!images.length) return null;

  return (
    <div className='mt-4 grid grid-cols-2 gap-4 border-t border-gray-200 pt-4'>
      {images.map((image, idx) => (
        <div key={`delivery-image-${image.url}-${idx}`} className='space-y-2'>
          <div className='relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200'>
            <Image
              src={image.url}
              alt={image.label || 'Delivery Image'}
              fill
              className='object-cover'
              unoptimized
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

export function DeliveriesSection({ deliveries }: Props) {
  return (
    <div className='overflow-hidden rounded-lg border border-gray-200 bg-white/50'>
      <div className='border-b border-gray-200 bg-gray-50/50 px-4 py-3'>
        <h2 className='text-center text-xs font-semibold uppercase text-gray-700'>
          Deliveries
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
                Time
              </th>
              <th className='pb-2 text-center text-xs font-medium text-gray-600'>
                Delivery From
              </th>
              <th className='pb-2 text-center text-xs font-medium text-gray-600'>
                Tracking #
              </th>
              <th className='pb-2 text-center text-xs font-medium text-gray-600'>
                Location
              </th>
              <th className='pb-2 text-center text-xs font-medium text-gray-600'>
                Contents
              </th>
              <th className='pb-2 text-center text-xs font-medium text-gray-600'>
                Notes
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {deliveries.details.map((detail, idx) => (
              <DeliveryRow
                key={`${detail.itemNumber}-${idx}`}
                detail={detail}
                isEven={idx % 2 === 0}
              />
            ))}
          </tbody>
        </table>
        <DeliveryImages images={deliveries.images} />
      </div>
    </div>
  );
}
