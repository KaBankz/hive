import Image from 'next/image';

import type { DailyLog } from '@/types/dailyReport';

type Props = {
  quantities: NonNullable<DailyLog['quantities']>;
};

function QuantityRow({
  detail,
  isEven,
}: {
  detail: NonNullable<DailyLog['quantities']>['details'][number];
  isEven: boolean;
}) {
  return (
    <tr className={isEven ? 'bg-gray-50/50' : undefined}>
      <td className='p-3 text-xs text-gray-900'>{detail.itemNumber}</td>
      <td className='p-3 text-xs text-gray-900'>
        {detail._costCodeAndDescription}
      </td>
      <td className='p-3 text-xs text-gray-900'>{detail._UOM}</td>
      <td className='p-3 text-xs text-gray-900'>
        {detail._projectLocationCode}
      </td>
      <td className='p-3 text-right text-xs text-gray-900'>
        {detail._periodQty}
      </td>
      <td className='p-3 text-right text-xs text-gray-900'>
        {detail._toDateQty}
      </td>
      <td className='p-3 text-xs text-gray-500'>{detail._note}</td>
    </tr>
  );
}

function QuantityImages({
  images,
}: {
  images: NonNullable<DailyLog['quantities']>['images'];
}) {
  if (!images.length) return null;

  return (
    <div className='mt-4 grid grid-cols-2 gap-4 border-t border-gray-200 pt-4'>
      {images.map((image, idx) => (
        <div key={`quantity-image-${image.url}-${idx}`} className='space-y-2'>
          <div className='relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200'>
            <Image
              src={image.url}
              alt={image.label || 'Quantity Image'}
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

export function QuantitiesSection({ quantities }: Props) {
  return (
    <div className='overflow-hidden rounded-lg border border-gray-200 bg-white/50'>
      <div className='border-b border-gray-200 bg-gray-50/50 px-4 py-3'>
        <h2 className='text-center text-xs font-semibold uppercase text-gray-700'>
          Quantities
        </h2>
      </div>
      <div className='p-4'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-gray-200'>
              <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                Item #
              </th>
              <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                Cost Code
              </th>
              <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                UOM
              </th>
              <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                Location
              </th>
              <th className='pb-2 text-right text-xs font-medium text-gray-600'>
                Period Qty
              </th>
              <th className='pb-2 text-right text-xs font-medium text-gray-600'>
                To Date Qty
              </th>
              <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                Notes
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {quantities.details.map((detail, idx) => (
              <QuantityRow
                key={`${detail.itemNumber}-${idx}`}
                detail={detail}
                isEven={idx % 2 === 0}
              />
            ))}
          </tbody>
        </table>
        <QuantityImages images={quantities.images} />
      </div>
    </div>
  );
}
