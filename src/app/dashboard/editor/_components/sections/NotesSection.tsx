import type { DailyLog } from '@/types/dailyReport';

type Props = {
  notes: NonNullable<DailyLog['notes']>;
};

function NoteRow({
  detail,
}: {
  detail: NonNullable<DailyLog['notes']>['details'][number];
}) {
  return (
    <tr>
      <td className='p-3 text-xs text-gray-900'>{detail.itemNumber}</td>
      <td className='p-3 text-xs text-gray-900'>{detail.noteLocation}</td>
      <td className='p-3 text-xs text-gray-500'>{detail.notes}</td>
      <td className='p-3 text-xs text-gray-500'>{detail._userFullName}</td>
    </tr>
  );
}

export function NotesSection({ notes }: Props) {
  return (
    <div className='overflow-hidden rounded-lg border border-gray-200 bg-white/50'>
      <div className='border-b border-gray-200 bg-gray-50/50 px-4 py-3'>
        <h2 className='text-center text-xs font-semibold uppercase text-gray-700'>
          Notes
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
                Location
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
            {notes.details.map((detail) => (
              <NoteRow key={`${detail.itemNumber}`} detail={detail} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
