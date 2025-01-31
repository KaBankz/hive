import type { DailyLog, DailyReport } from '@/types/dailyReport';

type Props = {
  project: DailyLog;
  report: DailyReport;
};

export function ReportInfo({ project, report }: Props) {
  return (
    <div className='overflow-hidden rounded-lg border border-gray-200 bg-white/50'>
      <table className='w-full'>
        <thead>
          <tr className='border-b border-gray-200 bg-gray-50/50'>
            <th className='p-3 text-center text-xs font-medium text-gray-600'>
              Date
            </th>
            <th className='p-3 text-center text-xs font-medium text-gray-600'>
              Project #
            </th>
            <th className='p-3 text-center text-xs font-medium text-gray-600'>
              Project Name
            </th>
            <th className='p-3 text-center text-xs font-medium text-gray-600'>
              Printed By
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='p-3 text-center text-xs font-medium text-gray-900'>
              {project.dailyLogDate}
            </td>
            <td className='p-3 text-center text-xs font-medium text-gray-900'>
              {project.projectNumber}
            </td>
            <td className='p-3 text-center text-xs font-medium text-gray-900'>
              {project.projectName}
            </td>
            <td className='p-3 text-center text-xs font-medium text-gray-900'>
              {report.printedBy}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
