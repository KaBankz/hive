import { Tag as TagIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { DailyLog, Tag } from '@/types/dailyReport';

type Props = {
  equipment: NonNullable<DailyLog['equipment']>;
  hoursLabels: string;
};

function EquipmentTags({
  tags,
  align = 'left',
}: {
  tags: Tag[];
  align?: 'left' | 'right';
}) {
  if (!tags?.length) return null;

  return (
    <div
      className={cn(
        'mt-1 flex flex-wrap gap-1',
        align === 'right' && 'justify-end'
      )}>
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

function EquipmentRow({
  detail,
  hasNotes,
}: {
  detail: NonNullable<DailyLog['equipment']>['details'][number];
  hasNotes: NonNullable<DailyLog['equipment']>['hasNotes'];
}) {
  const { nameRow, additionalCostCodeRows } = detail;
  const { nameCell, costCodeCell, hoursCell, notesCell } = nameRow;
  const totalRows = additionalCostCodeRows.length + 1;

  return (
    <>
      <tr>
        <td className='py-3 pl-3' rowSpan={totalRows}>
          <div className='text-xs font-medium text-gray-900'>
            {nameCell.equipName}
          </div>
          <div className='mt-1 text-[10px] text-gray-500'>
            {nameCell.equipHours}
          </div>
          <EquipmentTags tags={nameCell.equipTags} />
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
          <EquipmentTags tags={hoursCell.hoursTags} align='right' />
        </td>
        {hasNotes && (
          <td className='p-3 text-[10px] text-gray-500'>{notesCell}</td>
        )}
      </tr>
      {additionalCostCodeRows?.map((row, idx) => (
        <tr key={`${costCodeCell.costCode}-${idx}`}>
          <td className='p-3'>
            <div className='text-xs font-medium text-gray-900'>
              {row.costCodeCell.costCode}
            </div>
            <div className='mt-1 text-[10px] text-gray-500'>
              {row.costCodeCell.budgetCodeDescription}
            </div>
          </td>
          <td className='p-3 text-right'>
            <div className='text-xs text-gray-900'>{row.hoursCell.hours}</div>
            <EquipmentTags tags={row.hoursCell.hoursTags} align='right' />
          </td>
          {hasNotes && (
            <td className='p-3 text-[10px] text-gray-500'>{row.notesCell}</td>
          )}
        </tr>
      ))}
    </>
  );
}

export function EquipmentSection({ equipment, hoursLabels }: Props) {
  return (
    <div className='overflow-hidden rounded-lg border border-gray-200 bg-white/50'>
      <div className='border-b border-gray-200 bg-gray-50/50 px-4 py-3'>
        <h2 className='text-center text-xs font-semibold uppercase text-gray-700'>
          Equipment
        </h2>
      </div>
      <div className='p-4'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-gray-200'>
              <th className='pb-2 text-center text-xs font-medium text-gray-600'>
                Equipment
              </th>
              <th className='pb-2 text-center text-xs font-medium text-gray-600'>
                Cost Code
              </th>
              <th className='pb-2 text-center text-xs font-medium text-gray-600'>
                {hoursLabels}
              </th>
              {equipment.hasNotes && (
                <th className='pb-2 text-center text-xs font-medium text-gray-600'>
                  Notes
                </th>
              )}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {equipment.details.map((detail, idx) => (
              <EquipmentRow
                key={`${detail.nameRow.nameCell.equipName}-${idx}`}
                detail={detail}
                hasNotes={equipment.hasNotes}
              />
            ))}
            <tr className='border-t border-gray-200 bg-gray-50/80'>
              <td
                colSpan={2}
                className='p-3 text-right text-xs font-medium text-gray-900'>
                TOTAL
              </td>
              <td className='p-3 text-right text-xs font-medium text-gray-900'>
                {equipment.totalHours}
              </td>
              {equipment.hasNotes && <td />}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
