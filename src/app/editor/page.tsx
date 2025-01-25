import Image from 'next/image';

import { ImageIcon, Tag } from 'lucide-react';

import dailyReportData from '../../../public/dailyReportData.json';

interface WeatherSummary {
  forecastTimeTzFormatted: string;
  tempF: string;
  wind?: string;
  precip?: string;
  humidity?: string;
  iconForecast: string;
  _wind?: string;
  _precip?: string;
  _humidity?: string;
}

interface LaborDetail {
  nameRow: {
    nameCell: {
      crewName: string;
      crewHours: string;
      signatureFileUrl?: string;
      signatureTimeStamp?: string;
    };
    costCodeCell: {
      costCode: string;
      budgetCodeDescription: string;
    };
    hoursCell: {
      hours: string;
    };
    notesCell?: string;
  };
}

interface EquipmentDetail {
  nameRow: {
    nameCell: {
      equipName: string;
      equipHours: string;
      equipTags?: Array<{ color: string; label: string }>;
    };
    costCodeCell: {
      costCode: string;
      budgetCodeDescription: string;
    };
    hoursCell: {
      hours: string;
      hoursTags?: Array<{ color: string; label: string }>;
    };
    notesCell?: string;
  };
  additionalCostCodeRows?: Array<{
    costCodeCell: {
      costCode: string;
      budgetCodeDescription: string;
    };
    hoursCell: {
      hours: string;
      hoursTags?: Array<{ color: string; label: string }>;
    };
    notesCell?: string;
  }>;
}

export default function EditorPage() {
  const data = dailyReportData;

  return (
    <div className='h-screen overflow-hidden bg-gray-200'>
      <div className='h-full overflow-y-auto p-4'>
        <div className='mx-auto max-w-7xl text-black'>
          {/* Company Logo */}
          <div className='mb-4 flex items-center justify-between bg-white p-4'>
            <div>
              <h1 className='text-xl font-semibold text-green-600'>
                {data.companyName}
              </h1>
            </div>
            <div>
              <Image
                src={data.companyLogo}
                alt='Company Logo'
                className='h-7'
                width={100}
                height={100}
              />
            </div>
          </div>

          {data.dailyLogs.map((log, index) => (
            <div key={index} className='space-y-4'>
              {/* Report Information */}
              <div className='bg-white p-4'>
                <table className='w-full'>
                  <thead>
                    <tr>
                      <th className='text-left text-sm text-gray-600'>Date</th>
                      <th className='text-left text-sm text-gray-600'>
                        Project #
                      </th>
                      <th className='text-left text-sm text-gray-600'>
                        Project Name
                      </th>
                      <th className='text-left text-sm text-gray-600'>
                        Printed By
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className='font-medium text-gray-800'>
                        {log.dailyLogDate}
                      </td>
                      <td className='font-medium text-gray-800'>
                        {log.projectNumber}
                      </td>
                      <td className='font-medium text-gray-800'>
                        {log.projectName}
                      </td>
                      <td className='font-medium text-gray-800'>
                        {data.printedBy}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Weather Section */}
              {log.weather && (
                <div className='bg-white p-4'>
                  <h2 className='mb-4 text-center font-semibold uppercase text-gray-700'>
                    Weather
                  </h2>
                  <div className='grid grid-cols-3 gap-4'>
                    {log.weather.summary.map(
                      (weather: WeatherSummary, idx: number) => (
                        <div key={idx} className='text-center'>
                          <div className='text-sm text-gray-600'>
                            {weather.forecastTimeTzFormatted}
                          </div>
                          <div className='text-lg text-green-600'>
                            <i className={weather.iconForecast}></i>{' '}
                            {weather.tempF}°
                          </div>
                          <div className='text-xs text-gray-500'>
                            <strong>Wind:</strong> {weather.wind} &nbsp;
                            <strong>Precip:</strong> {weather.precip} &nbsp;
                            <strong>Humidity:</strong> {weather.humidity}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Labor Section */}
              {log.labor && log.labor.details && (
                <div className='bg-white p-4'>
                  <h2 className='mb-4 text-center font-semibold uppercase text-gray-700'>
                    Labor
                  </h2>
                  <table className='w-full'>
                    <thead>
                      <tr>
                        <th className='text-left'>Name</th>
                        <th className='text-left'>Cost Code</th>
                        <th className='text-right'>{data.hoursLabels}</th>
                        {log.labor.hasNotes && (
                          <th className='text-left'>Notes</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {log.labor.details.map(
                        (labor: LaborDetail, idx: number) => (
                          <tr
                            key={idx}
                            className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                            <td className='p-2'>
                              <div className='text-sm font-semibold'>
                                {labor.nameRow.nameCell.crewName}
                              </div>
                              <div className='text-xs'>
                                {labor.nameRow.nameCell.crewHours}
                              </div>
                              {labor.nameRow.nameCell.signatureFileUrl && (
                                <div>
                                  <Image
                                    src={
                                      labor.nameRow.nameCell.signatureFileUrl
                                    }
                                    alt='Signature'
                                    className='h-12 w-24 object-contain'
                                    width={100}
                                    height={100}
                                  />
                                  <div className='text-[10px]'>
                                    Signed{' '}
                                    {labor.nameRow.nameCell.signatureTimeStamp}
                                  </div>
                                </div>
                              )}
                            </td>
                            <td className='p-2'>
                              <div className='font-semibold'>
                                {labor.nameRow.costCodeCell.costCode}
                              </div>
                              <div className='text-xs'>
                                {
                                  labor.nameRow.costCodeCell
                                    .budgetCodeDescription
                                }
                              </div>
                            </td>
                            <td className='p-2 text-right text-xs'>
                              {labor.nameRow.hoursCell.hours}
                            </td>
                            {log.labor.hasNotes && (
                              <td className='p-2 text-xs'>
                                {labor.nameRow.notesCell}
                              </td>
                            )}
                          </tr>
                        )
                      )}
                      <tr>
                        <td colSpan={2} className='text-right font-semibold'>
                          TOTAL
                        </td>
                        <td className='text-right'>{log.labor.totalHours}</td>
                        {log.labor.hasNotes && <td></td>}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Equipment Section */}
              {log.equipment && log.equipment.details && (
                <div className='border-b border-gray-400 bg-white p-4'>
                  <h2 className='mb-4 text-center text-sm font-semibold uppercase text-[#33424C]'>
                    Equipment
                  </h2>
                  <table className='w-full'>
                    <thead>
                      <tr>
                        <th className='w-[120px] p-1 text-left text-[9px] font-semibold text-[#231F20]'>
                          NAME
                        </th>
                        <th className='w-[120px] p-1 text-left text-[9px] font-semibold text-[#231F20]'>
                          COST CODE
                        </th>
                        <th className='w-[100px] p-1 text-right text-[9px] font-semibold text-[#231F20]'>
                          {data.hoursLabels}
                        </th>
                        {log.equipment.hasNotes && (
                          <th className='w-[150px] p-1 text-left text-[9px] font-semibold text-[#231F20]'>
                            NOTES
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {log.equipment.details.map(
                        (equipment: EquipmentDetail, idx: number) => (
                          <>
                            <tr
                              key={`equip-${idx}`}
                              className={idx % 2 === 0 ? 'bg-[#EEF7EF]' : ''}>
                              <td
                                className='p-2 align-top'
                                rowSpan={
                                  equipment.additionalCostCodeRows?.length
                                    ? equipment.additionalCostCodeRows.length +
                                      1
                                    : 1
                                }>
                                <div className='text-[11px] font-semibold'>
                                  {equipment.nameRow.nameCell.equipName}
                                </div>
                                <div className='text-[9px]'>
                                  {equipment.nameRow.nameCell.equipHours}
                                </div>
                                {equipment.nameRow.nameCell.equipTags?.map(
                                  (tag, tagIdx) => (
                                    <span
                                      key={tagIdx}
                                      className='mr-2 text-[9px]'>
                                      <Tag
                                        className='inline-block'
                                        size={12}
                                        style={{ color: tag.color }}
                                      />
                                      <span className='px-1'>{tag.label}</span>
                                    </span>
                                  )
                                )}
                              </td>
                              <td className='p-2'>
                                <div className='text-[9px] font-semibold'>
                                  {equipment.nameRow.costCodeCell.costCode}
                                </div>
                                <div className='text-[9px]'>
                                  {
                                    equipment.nameRow.costCodeCell
                                      .budgetCodeDescription
                                  }
                                </div>
                              </td>
                              <td className='p-2 text-right text-[9px]'>
                                {equipment.nameRow.hoursCell.hours}
                                {equipment.nameRow.hoursCell.hoursTags?.map(
                                  (tag, tagIdx) => (
                                    <div key={tagIdx}>
                                      <Tag
                                        className='inline-block'
                                        size={12}
                                        style={{ color: tag.color }}
                                      />
                                      <span className='px-1'>{tag.label}</span>
                                    </div>
                                  )
                                )}
                              </td>
                              {log.equipment.hasNotes && (
                                <td className='p-2 text-[9px]'>
                                  {equipment.nameRow.notesCell}
                                </td>
                              )}
                            </tr>
                            {equipment.additionalCostCodeRows?.map(
                              (row, rowIdx) => (
                                <tr
                                  key={`equip-${idx}-row-${rowIdx}`}
                                  className={
                                    idx % 2 === 0 ? 'bg-[#EEF7EF]' : ''
                                  }>
                                  <td className='p-2'>
                                    <div className='text-[9px] font-semibold'>
                                      {row.costCodeCell.costCode}
                                    </div>
                                    <div className='text-[9px]'>
                                      {row.costCodeCell.budgetCodeDescription}
                                    </div>
                                  </td>
                                  <td className='p-2 text-right text-[9px]'>
                                    {row.hoursCell.hours}
                                  </td>
                                  {log.equipment.hasNotes && (
                                    <td className='p-2 text-[9px]'>
                                      {row.notesCell}
                                    </td>
                                  )}
                                </tr>
                              )
                            )}
                          </>
                        )
                      )}
                      <tr>
                        <td
                          colSpan={2}
                          className='p-2 text-right text-[10px] font-semibold'>
                          TOTAL
                        </td>
                        <td className='p-2 text-right text-[10px]'>
                          {log.equipment.totalHours}
                        </td>
                        {log.equipment.hasNotes && <td></td>}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Images Section */}
              <div className='border-b border-gray-400 bg-white p-4'>
                <h2 className='mb-4 text-center text-sm font-semibold uppercase text-[#33424C]'>
                  Photos
                </h2>
                <div className='grid grid-cols-2 gap-4'>
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className='relative h-80 bg-gray-100'>
                      <Image
                        src={`/site${num}.jpeg`}
                        alt={`Site photo ${num}`}
                        fill
                        className='object-cover'
                      />
                      <div className='absolute inset-x-0 bottom-0 bg-white/50 p-1'>
                        <div className='flex items-center gap-1 text-[8px]'>
                          <ImageIcon size={12} />
                          <span>Site photo {num}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {!log.lastPage && <div className='page-break' />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
