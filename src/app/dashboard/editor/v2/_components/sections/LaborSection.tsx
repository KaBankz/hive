import Image from 'next/image';

import { Tag as TagIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { LaborDetail, Tag } from '@/types/dailyReport';

type LaborSectionProps = {
  labor: {
    details: LaborDetail[];
    totalHours: string;
    hasNotes: boolean;
  };
  hoursLabels: string;
};

function LaborTags({ tags }: { tags: Tag[] }) {
  if (!tags.length) return null;

  return (
    <div className='mt-1 flex flex-wrap gap-1'>
      {tags.map((tag, idx) => (
        <span
          key={`${tag.label}-${idx}`}
          className='inline-flex items-center gap-1 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium'
          style={{ color: tag.color }}>
          <TagIcon size={8} />
          {tag.label}
        </span>
      ))}
    </div>
  );
}

function LaborRow({
  detail,
  hasNotes,
  isEven,
}: {
  detail: LaborDetail;
  hasNotes: boolean;
  isEven: boolean;
}) {
  const { nameRow, additionalCostCodeRows } = detail;
  const { nameCell, costCodeCell, hoursCell, notesCell } = nameRow;

  return (
    <>
      <tr className={cn(isEven && 'bg-gray-50/50')}>
        <td className='py-3 pl-3'>
          <div className='text-xs font-medium text-gray-900'>
            {nameCell.crewName}
          </div>
          <div className='mt-1 text-[10px] text-gray-500'>
            {nameCell.crewHours}
          </div>
          {nameCell.signatureFileUrl && (
            <div className='mt-2'>
              <Image
                src={nameCell.signatureFileUrl}
                alt='Signature'
                width={100}
                height={32}
                className='object-contain'
                unoptimized
              />
              <div className='mt-1 text-[8px] text-gray-500'>
                Signed {nameCell.signatureTimeStamp}
              </div>
            </div>
          )}
          <LaborTags tags={nameCell.crewTags} />
        </td>
        <td className='p-3'>
          <div className='text-xs font-medium text-gray-900'>
            {costCodeCell.costCode}
          </div>
          <div className='mt-1 text-[10px] text-gray-500'>
            {costCodeCell.budgetCodeDescription}
          </div>
        </td>
        <td className='p-3 text-right'>
          <div className='text-xs text-gray-900'>{hoursCell.hours}</div>
          <LaborTags tags={hoursCell.hoursTags} />
        </td>
        {hasNotes && (
          <td className='p-3 text-[10px] text-gray-500'>{notesCell}</td>
        )}
      </tr>
      {additionalCostCodeRows.map((row, idx) => (
        <tr
          key={`${costCodeCell.costCode}-${idx}`}
          className={cn(isEven && 'bg-gray-50/50')}>
          <td className='p-3'>
            <div className='text-xs font-medium text-gray-900'>
              {row.costCodeCell.costCode}
            </div>
            <div className='mt-1 text-[10px] text-gray-500'>
              {row.costCodeCell.budgetCodeDescription}
            </div>
          </td>
          <td className='p-3 text-right text-xs text-gray-900'>
            {row.hoursCell.hours}
          </td>
          {hasNotes && (
            <td className='p-3 text-[10px] text-gray-500'>{row.notesCell}</td>
          )}
        </tr>
      ))}
    </>
  );
}

export function LaborSection({ labor, hoursLabels }: LaborSectionProps) {
  return (
    <div className='overflow-hidden rounded-lg border border-gray-200 bg-white/50'>
      <div className='border-b border-gray-200 bg-gray-50/50 px-4 py-3'>
        <h2 className='text-center text-xs font-semibold uppercase text-gray-700'>
          Labor
        </h2>
      </div>
      <div className='p-4'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-gray-200'>
              <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                Name
              </th>
              <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                Cost Code
              </th>
              <th className='pb-2 text-right text-xs font-medium text-gray-600'>
                {hoursLabels}
              </th>
              {labor.hasNotes && (
                <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                  Notes
                </th>
              )}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {labor.details.map((detail, idx) => (
              <LaborRow
                key={`${detail.nameRow.nameCell.crewName}-${idx}`}
                detail={detail}
                hasNotes={labor.hasNotes}
                isEven={idx % 2 === 0}
              />
            ))}
            <tr className='border-t border-gray-200 bg-gray-50/80'>
              <td
                colSpan={2}
                className='p-3 text-right text-xs font-medium text-gray-900'>
                TOTAL
              </td>
              <td className='p-3 text-right text-xs font-medium text-gray-900'>
                {labor.totalHours}
              </td>
              {labor.hasNotes && <td />}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
