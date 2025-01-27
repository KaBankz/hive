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
        margin: [40, 40, 60, 40],
        filename: `daily-report-${selectedProject.projectNumber}-${selectedProject.dailyLogDate}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          width: 794,
        },
        jsPDF: {
          unit: 'pt',
          format: 'a4',
          orientation: 'portrait',
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
          <div className='h-full overflow-auto'>
            <div className='mx-auto h-screen max-w-7xl'>
              <div
                id='document-container'
                className='mx-auto w-[8.27in] rounded-lg bg-white p-8 shadow-lg ring-1 ring-black/[0.1]'>
                {/* Company Header */}
                <div className='mb-12 border-b border-gray-200 pb-6'>
                  <div className='flex items-center justify-between'>
                    <h1 className='text-xl font-semibold text-blue-500'>
                      {dailyReportData.companyName}
                    </h1>
                    <Image
                      src={dailyReportData.companyLogo}
                      alt='Company Logo'
                      className='h-8'
                      width={100}
                      height={100}
                    />
                  </div>
                </div>

                {/* Document Content */}
                <div className='space-y-12'>
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
                                  <th className='p-4 text-left text-sm font-medium text-gray-600'>
                                    Date
                                  </th>
                                  <th className='p-4 text-left text-sm font-medium text-gray-600'>
                                    Project #
                                  </th>
                                  <th className='p-4 text-left text-sm font-medium text-gray-600'>
                                    Project Name
                                  </th>
                                  <th className='p-4 text-left text-sm font-medium text-gray-600'>
                                    Printed By
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className='p-4 font-medium text-gray-900'>
                                    {selectedProject.dailyLogDate}
                                  </td>
                                  <td className='p-4 font-medium text-gray-900'>
                                    {selectedProject.projectNumber}
                                  </td>
                                  <td className='p-4 font-medium text-gray-900'>
                                    {selectedProject.projectName}
                                  </td>
                                  <td className='p-4 font-medium text-gray-900'>
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
                              <div className='border-b border-gray-200 bg-gray-50/50 px-6 py-4'>
                                <h2 className='text-center text-sm font-semibold uppercase text-gray-700'>
                                  Weather
                                </h2>
                              </div>
                              <div className='grid grid-cols-3 divide-x divide-gray-200'>
                                {selectedProject.weather.summary.map(
                                  (weather: WeatherSummary, idx: number) => (
                                    <div key={idx} className='p-6 text-center'>
                                      <div className='text-sm font-medium text-gray-600'>
                                        {weather.forecastTimeTzFormatted}
                                      </div>
                                      <div className='mt-2 text-2xl font-semibold text-blue-500'>
                                        <i className={weather.iconForecast}></i>{' '}
                                        {weather.tempF}°
                                      </div>
                                      <div className='mt-2 text-xs text-gray-500'>
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
                              <div className='border-b border-gray-200 bg-gray-50/50 px-6 py-4'>
                                <h2 className='text-center text-sm font-semibold uppercase text-gray-700'>
                                  Labor
                                </h2>
                              </div>
                              <div className='p-6'>
                                <table className='w-full'>
                                  <thead>
                                    <tr className='border-b border-gray-200'>
                                      <th className='pb-3 text-left text-sm font-medium text-gray-600'>
                                        Name
                                      </th>
                                      <th className='pb-3 text-left text-sm font-medium text-gray-600'>
                                        Cost Code
                                      </th>
                                      <th className='pb-3 text-right text-sm font-medium text-gray-600'>
                                        {dailyReportData.hoursLabels}
                                      </th>
                                      {selectedProject.labor.hasNotes && (
                                        <th className='pb-3 text-left text-sm font-medium text-gray-600'>
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
                                          <td className='py-4 pl-4'>
                                            <div className='font-medium text-gray-900'>
                                              {labor.nameRow.nameCell.crewName}
                                            </div>
                                            <div className='mt-1 text-sm text-gray-500'>
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
                                                  className='h-12 w-24 object-contain'
                                                  width={100}
                                                  height={100}
                                                />
                                                <div className='mt-1 text-[10px] text-gray-500'>
                                                  Signed{' '}
                                                  {
                                                    labor.nameRow.nameCell
                                                      .signatureTimeStamp
                                                  }
                                                </div>
                                              </div>
                                            )}
                                          </td>
                                          <td className='p-4'>
                                            <div className='font-medium text-gray-900'>
                                              {
                                                labor.nameRow.costCodeCell
                                                  .costCode
                                              }
                                            </div>
                                            <div className='mt-1 text-sm text-gray-500'>
                                              {
                                                labor.nameRow.costCodeCell
                                                  .budgetCodeDescription
                                              }
                                            </div>
                                          </td>
                                          <td className='p-4 text-right text-sm text-gray-900'>
                                            {labor.nameRow.hoursCell.hours}
                                          </td>
                                          {selectedProject.labor.hasNotes && (
                                            <td className='p-4 text-sm text-gray-500'>
                                              {labor.nameRow.notesCell}
                                            </td>
                                          )}
                                        </tr>
                                      )
                                    )}
                                    <tr className='border-t border-gray-200 bg-gray-50/80'>
                                      <td
                                        colSpan={2}
                                        className='p-4 text-right font-medium text-gray-900'>
                                        TOTAL
                                      </td>
                                      <td className='p-4 text-right font-medium text-gray-900'>
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
                              <div className='border-b border-gray-200 bg-gray-50/50 px-6 py-4'>
                                <h2 className='text-center text-sm font-semibold uppercase text-gray-700'>
                                  Equipment
                                </h2>
                              </div>
                              <div className='p-6'>
                                <table className='w-full'>
                                  <thead>
                                    <tr className='border-b border-gray-200'>
                                      <th className='pb-3 text-left text-sm font-medium text-gray-600'>
                                        Name
                                      </th>
                                      <th className='pb-3 text-left text-sm font-medium text-gray-600'>
                                        Cost Code
                                      </th>
                                      <th className='pb-3 text-right text-sm font-medium text-gray-600'>
                                        {dailyReportData.hoursLabels}
                                      </th>
                                      {selectedProject.equipment.hasNotes && (
                                        <th className='pb-3 text-left text-sm font-medium text-gray-600'>
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
                                              className='p-4'
                                              rowSpan={
                                                equipment.additionalCostCodeRows
                                                  ?.length
                                                  ? equipment
                                                      .additionalCostCodeRows
                                                      .length + 1
                                                  : 1
                                              }>
                                              <div className='font-medium text-gray-900'>
                                                {
                                                  equipment.nameRow.nameCell
                                                    .equipName
                                                }
                                              </div>
                                              <div className='mt-1 text-sm text-gray-500'>
                                                {
                                                  equipment.nameRow.nameCell
                                                    .equipHours
                                                }
                                              </div>
                                              {equipment.nameRow.nameCell.equipTags?.map(
                                                (tag, tagIdx) => (
                                                  <span
                                                    key={tagIdx}
                                                    className='mt-2 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium'
                                                    style={{
                                                      color: tag.color,
                                                    }}>
                                                    <Tag size={12} />
                                                    {tag.label}
                                                  </span>
                                                )
                                              )}
                                            </td>
                                            <td className='p-4'>
                                              <div className='font-medium text-gray-900'>
                                                {
                                                  equipment.nameRow.costCodeCell
                                                    .costCode
                                                }
                                              </div>
                                              <div className='mt-1 text-sm text-gray-500'>
                                                {
                                                  equipment.nameRow.costCodeCell
                                                    .budgetCodeDescription
                                                }
                                              </div>
                                            </td>
                                            <td className='p-4 text-right'>
                                              <div className='text-sm text-gray-900'>
                                                {
                                                  equipment.nameRow.hoursCell
                                                    .hours
                                                }
                                              </div>
                                              {equipment.nameRow.hoursCell.hoursTags?.map(
                                                (tag, tagIdx) => (
                                                  <span
                                                    key={tagIdx}
                                                    className='mt-2 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium'
                                                    style={{
                                                      color: tag.color,
                                                    }}>
                                                    <Tag size={12} />
                                                    {tag.label}
                                                  </span>
                                                )
                                              )}
                                            </td>
                                            {selectedProject.equipment
                                              .hasNotes && (
                                              <td className='p-4 text-sm text-gray-500'>
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
                                                <td className='p-4'>
                                                  <div className='font-medium text-gray-900'>
                                                    {row.costCodeCell.costCode}
                                                  </div>
                                                  <div className='mt-1 text-sm text-gray-500'>
                                                    {
                                                      row.costCodeCell
                                                        .budgetCodeDescription
                                                    }
                                                  </div>
                                                </td>
                                                <td className='p-4 text-right text-sm text-gray-900'>
                                                  {row.hoursCell.hours}
                                                </td>
                                                {selectedProject.equipment
                                                  .hasNotes && (
                                                  <td className='p-4 text-sm text-gray-500'>
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
                                        className='p-4 text-right font-medium text-gray-900'>
                                        TOTAL
                                      </td>
                                      <td className='p-4 text-right font-medium text-gray-900'>
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
                            <div className='border-b border-gray-200 bg-gray-50/50 px-6 py-4'>
                              <h2 className='text-center text-sm font-semibold uppercase text-gray-700'>
                                Site Photos
                              </h2>
                            </div>
                            <div className='grid grid-cols-2 gap-6 p-6'>
                              {[
                                '/site1.jpeg',
                                '/site2.jpeg',
                                '/site3.jpeg',
                                '/site4.jpeg',
                              ].map((photo, idx) => (
                                <div key={idx} className='space-y-3'>
                                  <div className='relative aspect-[4/3] w-full overflow-hidden rounded-lg'>
                                    <Image
                                      src={photo}
                                      alt={`Site photo ${idx + 1}`}
                                      fill
                                      className='object-cover'
                                    />
                                  </div>
                                  <p className='text-sm text-gray-500'>
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
