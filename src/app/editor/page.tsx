'use client';

import { Fragment, useState } from 'react';
import Image from 'next/image';

// @ts-expect-error - html2pdf.js doesn't have type definitions
import html2pdf from 'html2pdf.js';
import {
  Check,
  ChevronRight,
  Cloud,
  Download,
  Eye,
  EyeOff,
  FileText,
  ImageIcon,
  Layers,
  Settings2,
  Tag,
  Truck,
  Users,
} from 'lucide-react';

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

interface SectionVisibility {
  reportInfo: boolean;
  weather: boolean;
  labor: boolean;
  equipment: boolean;
  photos: boolean;
}

export default function EditorPage() {
  const data = dailyReportData;
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
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

  const selectedProject = data.dailyLogs[selectedProjectIndex];

  const toggleSection = (section: keyof SectionVisibility) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleExportPDF = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById('document-container');
      if (!element) return;

      const opt = {
        margin: [40, 40, 60, 40], // Slightly larger bottom margin
        filename: `daily-report-${selectedProject.projectNumber}-${selectedProject.dailyLogDate}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          width: 794, // 8.27 inches (A4 width) * 96 DPI
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
    <div className='h-screen overflow-hidden bg-gray-50'>
      {/* Header Bar */}
      <div className='sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm'>
        <div className='mx-auto flex max-w-[1400px] items-center justify-between px-8 py-4'>
          <div className='flex items-center gap-3'>
            <Layers className='h-5 w-5 text-blue-600' />
            <h1 className='text-lg font-semibold text-gray-900'>
              Daily Report Editor
            </h1>
          </div>
          <div className='flex items-center gap-4'>
            <select
              className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-black shadow-sm transition hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
              value={selectedProjectIndex}
              onChange={(e) => setSelectedProjectIndex(Number(e.target.value))}>
              {data.dailyLogs.map((log, index) => (
                <option key={index} value={index}>
                  Project {log.projectNumber} - {log.dailyLogDate}
                </option>
              ))}
            </select>

            <button
              onClick={handleExportPDF}
              disabled={isGenerating}
              className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50'>
              <Download size={16} />
              <span>{isGenerating ? 'Generating PDF...' : 'Export PDF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className='flex h-[calc(100vh-73px)]'>
        {/* Document Preview */}
        <div className='flex-1 overflow-auto'>
          <div className='mx-auto max-w-[1400px] p-8'>
            <div className='overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-900/5'>
              <div className='border-b border-gray-200 bg-gray-50/80 px-8 py-4'>
                <div className='flex items-center justify-between'>
                  <h2 className='flex items-center gap-2 font-medium text-gray-700'>
                    <Eye className='h-4 w-4 text-gray-500' />
                    Document Preview
                  </h2>
                  <div className='flex items-center gap-2 text-sm text-gray-500'>
                    <Settings2 className='h-4 w-4' />
                    Configure sections in sidebar
                  </div>
                </div>
              </div>
              <div className='p-8'>
                <div
                  id='document-container'
                  className='mx-auto w-[8.27in] overflow-hidden rounded-lg bg-white p-6 shadow-md ring-1 ring-black/5'>
                  {/* Company Header */}
                  <div className='mb-12 border-b border-gray-100 pb-6'>
                    <div className='flex items-center justify-between'>
                      <h1 className='text-xl font-semibold text-green-600'>
                        {data.companyName}
                      </h1>
                      <Image
                        src={data.companyLogo}
                        alt='Company Logo'
                        className='h-8'
                        width={100}
                        height={100}
                      />
                    </div>
                  </div>

                  {/* Document Content */}
                  <div className='space-y-12'>
                    {/* Report Information */}
                    {sectionVisibility.reportInfo && (
                      <div className='rounded-lg border border-gray-200 bg-white'>
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
                                {data.printedBy}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Weather Section */}
                    {sectionVisibility.weather && selectedProject.weather && (
                      <div className='overflow-hidden rounded-lg border border-gray-200 bg-white'>
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
                                <div className='mt-2 text-2xl font-semibold text-green-600'>
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
                    )}

                    {/* Labor Section - Allow breaks between rows */}
                    {sectionVisibility.labor &&
                      selectedProject.labor &&
                      selectedProject.labor.details && (
                        <div className='overflow-hidden rounded-lg border border-gray-200 bg-white'>
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
                                    {data.hoursLabels}
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
                                      className={
                                        idx % 2 === 0 ? 'bg-gray-50/50' : ''
                                      }>
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
                                          {labor.nameRow.costCodeCell.costCode}
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
                      )}

                    {/* Equipment Section - Allow breaks between rows */}
                    {sectionVisibility.equipment &&
                      selectedProject.equipment &&
                      selectedProject.equipment.details && (
                        <div className='overflow-hidden rounded-lg border border-gray-200 bg-white'>
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
                                    {data.hoursLabels}
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
                                  (equipment: EquipmentDetail, idx: number) => (
                                    <Fragment key={`equip-${idx}`}>
                                      <tr
                                        className={
                                          idx % 2 === 0 ? 'bg-gray-50/50' : ''
                                        }>
                                        <td
                                          className='p-4'
                                          rowSpan={
                                            equipment.additionalCostCodeRows
                                              ?.length
                                              ? equipment.additionalCostCodeRows
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
                                                style={{ color: tag.color }}>
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
                                            {equipment.nameRow.hoursCell.hours}
                                          </div>
                                          {equipment.nameRow.hoursCell.hoursTags?.map(
                                            (tag, tagIdx) => (
                                              <span
                                                key={tagIdx}
                                                className='mt-2 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium'
                                                style={{ color: tag.color }}>
                                                <Tag size={12} />
                                                {tag.label}
                                              </span>
                                            )
                                          )}
                                        </td>
                                        {selectedProject.equipment.hasNotes && (
                                          <td className='p-4 text-sm text-gray-500'>
                                            {equipment.nameRow.notesCell}
                                          </td>
                                        )}
                                      </tr>
                                      {equipment.additionalCostCodeRows?.map(
                                        (row, rowIdx) => (
                                          <tr
                                            key={`equip-${idx}-row-${rowIdx}`}
                                            className={
                                              idx % 2 === 0
                                                ? 'bg-gray-50/50'
                                                : ''
                                            }>
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
                      )}

                    {/* Photos Section - Keep photos together */}
                    {sectionVisibility.photos && (
                      <div className='overflow-hidden rounded-lg border border-gray-200 bg-white'>
                        <div className='border-b border-gray-200 bg-gray-50/50 px-6 py-4'>
                          <h2 className='text-center text-sm font-semibold uppercase text-gray-700'>
                            Photos
                          </h2>
                        </div>
                        <div className='p-6'>
                          <div className='grid grid-cols-2 gap-6'>
                            {[1, 2, 3, 4].map((num) => (
                              <div
                                key={num}
                                className='photo-card group relative aspect-video overflow-hidden rounded-lg bg-gray-100'>
                                <Image
                                  src={`/site${num}.jpeg`}
                                  alt={`Site photo ${num}`}
                                  fill
                                  className='object-cover transition duration-300 group-hover:scale-105'
                                />
                                <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4'>
                                  <div className='flex items-center gap-2 text-white'>
                                    <ImageIcon
                                      size={16}
                                      className='opacity-75'
                                    />
                                    <span className='text-sm font-medium'>
                                      Site photo {num}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className='w-80 flex-none border-l border-gray-200 bg-white'>
          <div className='flex h-full flex-col'>
            <div className='border-b border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <h2 className='flex items-center gap-2 text-sm font-medium text-gray-900'>
                  <Layers className='h-4 w-4 text-blue-600' />
                  Document Sections
                </h2>
                <button
                  onClick={() =>
                    setSectionVisibility((prev) => {
                      const allVisible = Object.values(prev).every(Boolean);
                      return {
                        reportInfo: !allVisible,
                        weather: !allVisible,
                        labor: !allVisible,
                        equipment: !allVisible,
                        photos: !allVisible,
                      };
                    })
                  }
                  className='flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50'>
                  {Object.values(sectionVisibility).every(Boolean) ? (
                    <>
                      <EyeOff className='h-3.5 w-3.5' />
                      Hide All
                    </>
                  ) : (
                    <>
                      <Eye className='h-3.5 w-3.5' />
                      Show All
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className='flex-1 overflow-y-auto p-6'>
              <div className='space-y-4'>
                <div className='space-y-1'>
                  <button
                    onClick={() => toggleSection('reportInfo')}
                    className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                      sectionVisibility.reportInfo
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}>
                    <div className='flex items-center gap-3'>
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${
                          sectionVisibility.reportInfo
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-300 group-hover:border-gray-400'
                        }`}>
                        {sectionVisibility.reportInfo ? (
                          <Check size={12} />
                        ) : (
                          <FileText size={12} className='text-gray-500' />
                        )}
                      </div>
                      Report Information
                    </div>
                    <ChevronRight
                      size={16}
                      className={`transition ${
                        sectionVisibility.reportInfo
                          ? 'text-blue-500'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                </div>

                <div className='space-y-1'>
                  <button
                    onClick={() => toggleSection('weather')}
                    className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                      sectionVisibility.weather
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}>
                    <div className='flex items-center gap-3'>
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${
                          sectionVisibility.weather
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-300 group-hover:border-gray-400'
                        }`}>
                        {sectionVisibility.weather ? (
                          <Check size={12} />
                        ) : (
                          <Cloud size={12} className='text-gray-500' />
                        )}
                      </div>
                      Weather
                    </div>
                    <ChevronRight
                      size={16}
                      className={`transition ${
                        sectionVisibility.weather
                          ? 'text-blue-500'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                </div>

                <div className='space-y-1'>
                  <button
                    onClick={() => toggleSection('labor')}
                    className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                      sectionVisibility.labor
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}>
                    <div className='flex items-center gap-3'>
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${
                          sectionVisibility.labor
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-300 group-hover:border-gray-400'
                        }`}>
                        {sectionVisibility.labor ? (
                          <Check size={12} />
                        ) : (
                          <Users size={12} className='text-gray-500' />
                        )}
                      </div>
                      Labor
                    </div>
                    <ChevronRight
                      size={16}
                      className={`transition ${
                        sectionVisibility.labor
                          ? 'text-blue-500'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                </div>

                <div className='space-y-1'>
                  <button
                    onClick={() => toggleSection('equipment')}
                    className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                      sectionVisibility.equipment
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}>
                    <div className='flex items-center gap-3'>
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${
                          sectionVisibility.equipment
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-300 group-hover:border-gray-400'
                        }`}>
                        {sectionVisibility.equipment ? (
                          <Check size={12} />
                        ) : (
                          <Truck size={12} className='text-gray-500' />
                        )}
                      </div>
                      Equipment
                    </div>
                    <ChevronRight
                      size={16}
                      className={`transition ${
                        sectionVisibility.equipment
                          ? 'text-blue-500'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                </div>

                <div className='space-y-1'>
                  <button
                    onClick={() => toggleSection('photos')}
                    className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                      sectionVisibility.photos
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}>
                    <div className='flex items-center gap-3'>
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${
                          sectionVisibility.photos
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-300 group-hover:border-gray-400'
                        }`}>
                        {sectionVisibility.photos ? (
                          <Check size={12} />
                        ) : (
                          <ImageIcon size={12} className='text-gray-500' />
                        )}
                      </div>
                      Photos
                    </div>
                    <ChevronRight
                      size={16}
                      className={`transition ${
                        sectionVisibility.photos
                          ? 'text-blue-500'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
