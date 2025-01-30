import type { DailyLog } from '@/types/dailyReport';

type Props = {
  visitors: NonNullable<DailyLog['visitors']>;
};

function VisitorRow({
  detail,
  isEven,
}: {
  detail: NonNullable<DailyLog['visitors']>['details'][number];
  isEven: boolean;
}) {
  return (
    <tr className={isEven ? 'bg-gray-50/50' : undefined}>
      <td className='p-3 text-xs text-gray-900'>{detail.itemNumber}</td>
      <td className='p-3 text-xs text-gray-900'>{detail.visitorName}</td>
      <td className='p-3 text-xs text-gray-900'>
        {detail.startTimeLocalString}
      </td>
      <td className='p-3 text-xs text-gray-900'>{detail.endTimeLocalString}</td>
      <td className='p-3 text-xs text-gray-500'>{detail.visitorNotes}</td>
      <td className='p-3 text-xs text-gray-500'>{detail._userFullName}</td>
    </tr>
  );
}

export function VisitorsSection({ visitors }: Props) {
  return (
    <div className='overflow-hidden rounded-lg border border-gray-200 bg-white/50'>
      <div className='border-b border-gray-200 bg-gray-50/50 px-4 py-3'>
        <h2 className='text-center text-xs font-semibold uppercase text-gray-700'>
          Visitors
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
                Visitors
              </th>
              <th className='pb-2 text-center text-xs font-medium text-gray-600'>
                Start Time
              </th>
              <th className='pb-2 text-center text-xs font-medium text-gray-600'>
                End Time
              </th>
              <th className='pb-2 text-center text-xs font-medium text-gray-600'>
                Notes
              </th>
              <th className='pb-2 text-center text-xs font-medium text-gray-600'>
                Entered By
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {visitors.details.map((detail, idx) => (
              <VisitorRow
                key={`${detail.itemNumber}-${idx}`}
                detail={detail}
                isEven={idx % 2 === 0}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
