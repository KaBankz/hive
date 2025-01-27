'use client';

import { Fragment, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
// @ts-expect-error - html2pdf.js doesn't have type definitions
import html2pdf from 'html2pdf.js';
import { Cloud, FileText, ImageIcon, Tag, Truck, Users } from 'lucide-react';

import { cn } from '@/utils/cn';

import dailyReportData from '../../../../public/dailyReportData.json';
import { Sidebar } from './_components/Sidebar';

type WeatherSummary = {
  forecastTimeTzFormatted: string;
  tempF: string;
  wind?: string;
  precip?: string;
  humidity?: string;
  iconForecast: string;
  _wind?: string;
  _precip?: string;
  _humidity?: string;
};

type LaborDetail = {
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
};

type EquipmentDetail = {
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
};

type SectionVisibility = {
  reportInfo: boolean;
  weather: boolean;
  labor: boolean;
  equipment: boolean;
  photos: boolean;
};

type SectionConfig = {
  id: keyof SectionVisibility;
  label: string;
  icon: React.ReactNode;
};

export default function EditorPage() {
  const searchParams = useSearchParams();
  const projectIndex = parseInt(searchParams.get('project') || '0');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>(
    {
      reportInfo: true,
      weather: true,
      labor: true,
      equipment: true,
      photos: true,
    }
  );
  const [sectionOrder, setSectionOrder] = useState<
    Array<keyof SectionVisibility>
  >(['reportInfo', 'weather', 'labor', 'equipment', 'photos']);

  const selectedProject = dailyReportData.dailyLogs[projectIndex];

  const sections: SectionConfig[] = [
    {
      id: 'reportInfo',
      label: 'Report Information',
      icon: <FileText size={12} className='text-gray-500' />,
    },
    {
      id: 'weather',
      label: 'Weather',
      icon: <Cloud size={12} className='text-gray-500' />,
    },
    {
      id: 'labor',
      label: 'Labor',
      icon: <Users size={12} className='text-gray-500' />,
    },
    {
      id: 'equipment',
      label: 'Equipment',
      icon: <Truck size={12} className='text-gray-500' />,
    },
    {
      id: 'photos',
      label: 'Photos',
      icon: <ImageIcon size={12} className='text-gray-500' />,
    },
  ];

  const orderedSections = sectionOrder.map((id) =>
    sections.find((s) => s.id === id)
  ) as SectionConfig[];

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setSectionOrder((items) => {
        const oldIndex = items.indexOf(active.id as keyof SectionVisibility);
        const newIndex = items.indexOf(over?.id as keyof SectionVisibility);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const handleExportPDF = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById('document-container');
      if (!element) return;

      const opt = {
        margin: [6, 12, 6, 12],
        filename: `daily-report-${selectedProject.projectNumber}-${selectedProject.dailyLogDate}.pdf`,
        image: {
          type: 'jpeg',
          quality: 1,
        },
        html2canvas: {
          scale: 3,
          useCORS: true,
          letterRendering: true,
          scrollX: 0,
          scrollY: 0,
          imageTimeout: 0,
          width: element.offsetWidth,
        },
        jsPDF: {
          unit: 'pt',
          format: 'a4',
          orientation: 'portrait',
          precision: 16,
          compress: true,
        },
      };

      await html2pdf().set(opt).from(element).save();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className='min-h-screen pt-16'>
      <div className='flex h-full'>
        {/* Document Preview */}
        <div className='flex-1'>
          <div className='h-[calc(100vh-4rem)] overflow-auto'>
            <div className='mx-auto py-8'>
              <div
                id='document-container'
                className='mx-auto w-[7.9in] rounded-lg bg-white px-8 py-4 shadow-lg ring-1 ring-black/[0.1]'>
                {/* Company Header */}
                <div className='mb-8 border-b border-gray-200 pb-4'>
                  <div className='flex items-center justify-between'>
                    <h1 className='text-lg font-semibold text-blue-500'>
                      {dailyReportData.companyName}
                    </h1>
                    <Image
                      src={dailyReportData.companyLogo}
                      alt='Company Logo'
                      width={100}
                      height={24}
                      className='object-contain'
                      unoptimized
                    />
                  </div>
                </div>

                {/* Document Content */}
                <div className='space-y-8'>
                  {/* Render sections in order */}
                  {orderedSections.map((section) => {
                    if (!sectionVisibility[section.id]) return null;

                    switch (section.id) {
                      case 'reportInfo':
                        return (
                          <div
                            key='reportInfo'
                            className='overflow-hidden rounded-lg border border-gray-200 bg-white/50'>
                            <table className='w-full'>
                              <thead>
                                <tr className='border-b border-gray-200 bg-gray-50/50'>
                                  <th className='p-3 text-left text-xs font-medium text-gray-600'>
                                    Date
                                  </th>
                                  <th className='p-3 text-left text-xs font-medium text-gray-600'>
                                    Project #
                                  </th>
                                  <th className='p-3 text-left text-xs font-medium text-gray-600'>
                                    Project Name
                                  </th>
                                  <th className='p-3 text-left text-xs font-medium text-gray-600'>
                                    Printed By
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className='p-3 text-xs font-medium text-gray-900'>
                                    {selectedProject.dailyLogDate}
                                  </td>
                                  <td className='p-3 text-xs font-medium text-gray-900'>
                                    {selectedProject.projectNumber}
                                  </td>
                                  <td className='p-3 text-xs font-medium text-gray-900'>
                                    {selectedProject.projectName}
                                  </td>
                                  <td className='p-3 text-xs font-medium text-gray-900'>
                                    {dailyReportData.printedBy}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        );
                      case 'weather':
                        return (
                          selectedProject.weather && (
                            <div
                              key='weather'
                              className='overflow-hidden rounded-lg border border-gray-200 bg-white/50'>
                              <div className='border-b border-gray-200 bg-gray-50/50 px-4 py-3'>
                                <h2 className='text-center text-xs font-semibold uppercase text-gray-700'>
                                  Weather
                                </h2>
                              </div>
                              <div className='grid grid-cols-3 divide-x divide-gray-200'>
                                {selectedProject.weather.summary.map(
                                  (weather: WeatherSummary, idx: number) => (
                                    <div key={idx} className='p-4 text-center'>
                                      <div className='text-xs font-medium text-gray-600'>
                                        {weather.forecastTimeTzFormatted}
                                      </div>
                                      <div className='mt-2 text-lg font-semibold text-blue-500'>
                                        <i className={weather.iconForecast}></i>{' '}
                                        {weather.tempF}°
                                      </div>
                                      <div className='mt-2 text-[10px] text-gray-500'>
                                        <span className='font-medium text-gray-700'>
                                          Wind:
                                        </span>{' '}
                                        {weather.wind} &nbsp;
                                        <span className='font-medium text-gray-700'>
                                          Precip:
                                        </span>{' '}
                                        {weather.precip} &nbsp;
                                        <span className='font-medium text-gray-700'>
                                          Humidity:
                                        </span>{' '}
                                        {weather.humidity}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )
                        );
                      case 'labor':
                        return (
                          selectedProject.labor &&
                          selectedProject.labor.details && (
                            <div
                              key='labor'
                              className='overflow-hidden rounded-lg border border-gray-200 bg-white/50'>
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
                                        {dailyReportData.hoursLabels}
                                      </th>
                                      {selectedProject.labor.hasNotes && (
                                        <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                          Notes
                                        </th>
                                      )}
                                    </tr>
                                  </thead>
                                  <tbody className='divide-y divide-gray-200'>
                                    {selectedProject.labor.details.map(
                                      (labor: LaborDetail, idx: number) => (
                                        <tr
                                          key={idx}
                                          className={cn(
                                            idx % 2 === 0 ? 'bg-gray-50/50' : ''
                                          )}>
                                          <td className='py-3 pl-3'>
                                            <div className='text-xs font-medium text-gray-900'>
                                              {labor.nameRow.nameCell.crewName}
                                            </div>
                                            <div className='mt-1 text-[10px] text-gray-500'>
                                              {labor.nameRow.nameCell.crewHours}
                                            </div>
                                            {labor.nameRow.nameCell
                                              .signatureFileUrl && (
                                              <div className='mt-2'>
                                                <Image
                                                  src={
                                                    labor.nameRow.nameCell
                                                      .signatureFileUrl
                                                  }
                                                  alt='Signature'
                                                  width={100}
                                                  height={32}
                                                  className='object-contain'
                                                  unoptimized
                                                />
                                                <div className='mt-1 text-[8px] text-gray-500'>
                                                  Signed{' '}
                                                  {
                                                    labor.nameRow.nameCell
                                                      .signatureTimeStamp
                                                  }
                                                </div>
                                              </div>
                                            )}
                                          </td>
                                          <td className='p-3'>
                                            <div className='text-xs font-medium text-gray-900'>
                                              {
                                                labor.nameRow.costCodeCell
                                                  .costCode
                                              }
                                            </div>
                                            <div className='mt-1 text-[10px] text-gray-500'>
                                              {
                                                labor.nameRow.costCodeCell
                                                  .budgetCodeDescription
                                              }
                                            </div>
                                          </td>
                                          <td className='p-3 text-right text-xs text-gray-900'>
                                            {labor.nameRow.hoursCell.hours}
                                          </td>
                                          {selectedProject.labor.hasNotes && (
                                            <td className='p-3 text-[10px] text-gray-500'>
                                              {labor.nameRow.notesCell}
                                            </td>
                                          )}
                                        </tr>
                                      )
                                    )}
                                    <tr className='border-t border-gray-200 bg-gray-50/80'>
                                      <td
                                        colSpan={2}
                                        className='p-3 text-right text-xs font-medium text-gray-900'>
                                        TOTAL
                                      </td>
                                      <td className='p-3 text-right text-xs font-medium text-gray-900'>
                                        {selectedProject?.labor?.totalHours}
                                      </td>
                                      {selectedProject?.labor?.hasNotes && (
                                        <td></td>
                                      )}
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )
                        );
                      case 'equipment':
                        return (
                          selectedProject.equipment &&
                          selectedProject.equipment.details && (
                            <div
                              key='equipment'
                              className='overflow-hidden rounded-lg border border-gray-200 bg-white/50'>
                              <div className='border-b border-gray-200 bg-gray-50/50 px-4 py-3'>
                                <h2 className='text-center text-xs font-semibold uppercase text-gray-700'>
                                  Equipment
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
                                        {dailyReportData.hoursLabels}
                                      </th>
                                      {selectedProject.equipment.hasNotes && (
                                        <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                          Notes
                                        </th>
                                      )}
                                    </tr>
                                  </thead>
                                  <tbody className='divide-y divide-gray-200'>
                                    {selectedProject.equipment.details.map(
                                      (
                                        equipment: EquipmentDetail,
                                        idx: number
                                      ) => (
                                        <Fragment key={`equip-${idx}`}>
                                          <tr
                                            className={cn(
                                              idx % 2 === 0
                                                ? 'bg-gray-50/50'
                                                : ''
                                            )}>
                                            <td
                                              className='p-3'
                                              rowSpan={
                                                equipment.additionalCostCodeRows
                                                  ?.length
                                                  ? equipment
                                                      .additionalCostCodeRows
                                                      .length + 1
                                                  : 1
                                              }>
                                              <div className='text-xs font-medium text-gray-900'>
                                                {
                                                  equipment.nameRow.nameCell
                                                    .equipName
                                                }
                                              </div>
                                              <div className='mt-1 text-[10px] text-gray-500'>
                                                {
                                                  equipment.nameRow.nameCell
                                                    .equipHours
                                                }
                                              </div>
                                              {equipment.nameRow.nameCell.equipTags?.map(
                                                (tag, tagIdx) => (
                                                  <span
                                                    key={tagIdx}
                                                    className='mt-1 inline-flex items-center gap-1 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium'
                                                    style={{
                                                      color: tag.color,
                                                    }}>
                                                    <Tag size={8} />
                                                    {tag.label}
                                                  </span>
                                                )
                                              )}
                                            </td>
                                            <td className='p-3'>
                                              <div className='text-xs font-medium text-gray-900'>
                                                {
                                                  equipment.nameRow.costCodeCell
                                                    .costCode
                                                }
                                              </div>
                                              <div className='mt-1 text-[10px] text-gray-500'>
                                                {
                                                  equipment.nameRow.costCodeCell
                                                    .budgetCodeDescription
                                                }
                                              </div>
                                            </td>
                                            <td className='p-3 text-right'>
                                              <div className='text-xs text-gray-900'>
                                                {
                                                  equipment.nameRow.hoursCell
                                                    .hours
                                                }
                                              </div>
                                              {equipment.nameRow.hoursCell.hoursTags?.map(
                                                (tag, tagIdx) => (
                                                  <span
                                                    key={tagIdx}
                                                    className='mt-1 inline-flex items-center gap-1 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium'
                                                    style={{
                                                      color: tag.color,
                                                    }}>
                                                    <Tag size={8} />
                                                    {tag.label}
                                                  </span>
                                                )
                                              )}
                                            </td>
                                            {selectedProject.equipment
                                              .hasNotes && (
                                              <td className='p-3 text-[10px] text-gray-500'>
                                                {equipment.nameRow.notesCell}
                                              </td>
                                            )}
                                          </tr>
                                          {equipment.additionalCostCodeRows?.map(
                                            (row, rowIdx) => (
                                              <tr
                                                key={`equip-${idx}-row-${rowIdx}`}
                                                className={cn(
                                                  idx % 2 === 0
                                                    ? 'bg-gray-50/50'
                                                    : ''
                                                )}>
                                                <td className='p-3'>
                                                  <div className='text-xs font-medium text-gray-900'>
                                                    {row.costCodeCell.costCode}
                                                  </div>
                                                  <div className='mt-1 text-[10px] text-gray-500'>
                                                    {
                                                      row.costCodeCell
                                                        .budgetCodeDescription
                                                    }
                                                  </div>
                                                </td>
                                                <td className='p-3 text-right text-xs text-gray-900'>
                                                  {row.hoursCell.hours}
                                                </td>
                                                {selectedProject.equipment
                                                  .hasNotes && (
                                                  <td className='p-3 text-[10px] text-gray-500'>
                                                    {row.notesCell}
                                                  </td>
                                                )}
                                              </tr>
                                            )
                                          )}
                                        </Fragment>
                                      )
                                    )}
                                    <tr className='border-t border-gray-200 bg-gray-50/80'>
                                      <td
                                        colSpan={2}
                                        className='p-3 text-right text-xs font-medium text-gray-900'>
                                        TOTAL
                                      </td>
                                      <td className='p-3 text-right text-xs font-medium text-gray-900'>
                                        {selectedProject?.equipment?.totalHours}
                                      </td>
                                      {selectedProject?.equipment?.hasNotes && (
                                        <td></td>
                                      )}
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )
                        );
                      case 'photos':
                        return (
                          <div
                            key='photos'
                            className='overflow-hidden rounded-lg border border-gray-200 bg-white/50'>
                            <div className='border-b border-gray-200 bg-gray-50/50 px-4 py-3'>
                              <h2 className='text-center text-xs font-semibold uppercase text-gray-700'>
                                Site Photos
                              </h2>
                            </div>
                            <div className='grid grid-cols-2 gap-4 p-4'>
                              {[
                                '/site1.jpeg',
                                '/site2.jpeg',
                                '/site3.jpeg',
                                '/site4.jpeg',
                              ].map((photo, idx) => (
                                <div key={idx} className='space-y-2'>
                                  <div className='relative aspect-[4/3] w-full overflow-hidden rounded-lg'>
                                    <Image
                                      src={photo}
                                      alt={`Site photo ${idx + 1}`}
                                      width={400}
                                      height={300}
                                      className='size-full object-cover'
                                      unoptimized
                                    />
                                  </div>
                                  <p className='text-[10px] text-gray-500'>
                                    Construction progress photo {idx + 1}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                    }
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Sidebar
          isGenerating={isGenerating}
          onExport={handleExportPDF}
          sectionVisibility={sectionVisibility}
          setSectionVisibility={setSectionVisibility}
          sectionOrder={sectionOrder}
          orderedSections={orderedSections}
          onDragEnd={handleDragEnd}
        />
      </div>
    </div>
  );
}
