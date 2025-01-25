'use client';

import { Fragment, useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
  GripVertical,
  ImageIcon,
  Layers,
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

interface SectionConfig {
  id: keyof SectionVisibility;
  label: string;
  icon: React.ReactNode;
}

const SortableSection = ({
  section,
  isVisible,
  onToggle,
}: {
  section: SectionConfig;
  isVisible: boolean;
  onToggle: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className='touch-none'>
      <button
        onClick={onToggle}
        className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
          isVisible
            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
            : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900'
        }`}>
        <div className='flex items-center gap-3'>
          <div
            {...attributes}
            {...listeners}
            className='cursor-grab active:cursor-grabbing'>
            <GripVertical
              size={16}
              className='text-gray-400 transition group-hover:text-gray-500 dark:text-gray-600 dark:group-hover:text-gray-500'
            />
          </div>
          <div
            className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${
              isVisible
                ? 'border-blue-500 bg-blue-500 text-white dark:border-blue-400 dark:bg-blue-400'
                : 'border-gray-300 group-hover:border-gray-400 dark:border-gray-700 dark:group-hover:border-gray-600'
            }`}>
            {isVisible ? <Check size={12} /> : section.icon}
          </div>
          {section.label}
        </div>
        <ChevronRight
          size={16}
          className={`transition ${
            isVisible
              ? 'text-blue-500 dark:text-blue-400'
              : 'text-gray-400 dark:text-gray-600'
          }`}
        />
      </button>
    </div>
  );
};

const Sidebar = ({
  isGenerating,
  onExport,
  sectionVisibility,
  setSectionVisibility,
  sectionOrder,
  orderedSections,
  onDragEnd,
}: {
  isGenerating: boolean;
  onExport: () => void;
  sectionVisibility: SectionVisibility;
  setSectionVisibility: (
    visibility:
      | SectionVisibility
      | ((prev: SectionVisibility) => SectionVisibility)
  ) => void;
  sectionOrder: Array<keyof SectionVisibility>;
  orderedSections: SectionConfig[];
  onDragEnd: (event: DragEndEvent) => void;
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleSection = (section: keyof SectionVisibility) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className='w-80 flex-none border-l border-gray-200 bg-white/70 backdrop-blur-xl backdrop-saturate-150 dark:border-white/[0.1] dark:bg-black/30'>
      <div className='flex h-full flex-col'>
        <div className='flex-none space-y-6 border-b border-gray-200 p-6 dark:border-white/[0.1]'>
          <div className='space-y-4'>
            <button
              onClick={onExport}
              disabled={isGenerating}
              className='group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50'>
              <Download className='size-4' />
              <span>{isGenerating ? 'Generating PDF...' : 'Export PDF'}</span>
            </button>
          </div>
          <div className='h-px bg-gray-200 dark:bg-white/[0.1]' />
          <div className='flex items-center justify-between'>
            <h2 className='flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white'>
              <Layers className='size-4 text-blue-500' />
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
              className='inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors duration-200 hover:border-gray-300 hover:bg-gray-50 dark:border-white/[0.1] dark:text-zinc-400 dark:hover:border-white/[0.2] dark:hover:bg-white/[0.02]'>
              {Object.values(sectionVisibility).every(Boolean) ? (
                <>
                  <EyeOff className='size-3.5' />
                  Hide All
                </>
              ) : (
                <>
                  <Eye className='size-3.5' />
                  Show All
                </>
              )}
            </button>
          </div>
        </div>
        <div className='flex-1 overflow-y-auto p-6'>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}>
            <SortableContext
              items={sectionOrder}
              strategy={verticalListSortingStrategy}>
              <div className='space-y-4'>
                {orderedSections.map((section) => (
                  <SortableSection
                    key={section.id}
                    section={section}
                    isVisible={sectionVisibility[section.id]}
                    onToggle={() => toggleSection(section.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
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
    <div className='inset-0 min-h-screen pt-16'>
      <div className='flex h-full'>
        {/* Document Preview */}
        <div className='flex-1'>
          <div className='h-full overflow-auto'>
            <div className='mx-auto h-screen max-w-7xl p-8'>
              <div
                id='document-container'
                className='mx-auto w-[8.27in] rounded-lg bg-white p-8 shadow-lg ring-1 ring-black/[0.1] dark:bg-black dark:ring-white/[0.1]'>
                {/* Company Header */}
                <div className='mb-12 border-b border-gray-200 pb-6 dark:border-white/[0.1]'>
                  <div className='flex items-center justify-between'>
                    <h1 className='text-xl font-semibold text-blue-500 dark:text-blue-400'>
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
                            className='overflow-hidden rounded-lg border border-gray-200 bg-white/50 dark:border-white/[0.1] dark:bg-white/[0.02]'>
                            <table className='w-full'>
                              <thead>
                                <tr className='border-b border-gray-200 bg-gray-50/50 dark:border-white/[0.1] dark:bg-black/20'>
                                  <th className='p-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300'>
                                    Date
                                  </th>
                                  <th className='p-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300'>
                                    Project #
                                  </th>
                                  <th className='p-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300'>
                                    Project Name
                                  </th>
                                  <th className='p-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300'>
                                    Printed By
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className='p-4 font-medium text-gray-900 dark:text-white'>
                                    {selectedProject.dailyLogDate}
                                  </td>
                                  <td className='p-4 font-medium text-gray-900 dark:text-white'>
                                    {selectedProject.projectNumber}
                                  </td>
                                  <td className='p-4 font-medium text-gray-900 dark:text-white'>
                                    {selectedProject.projectName}
                                  </td>
                                  <td className='p-4 font-medium text-gray-900 dark:text-white'>
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
                              className='overflow-hidden rounded-lg border border-gray-200 bg-white/50 dark:border-white/[0.1] dark:bg-white/[0.02]'>
                              <div className='border-b border-gray-200 bg-gray-50/50 px-6 py-4 dark:border-white/[0.1] dark:bg-black/20'>
                                <h2 className='text-center text-sm font-semibold uppercase text-gray-700 dark:text-gray-300'>
                                  Weather
                                </h2>
                              </div>
                              <div className='grid grid-cols-3 divide-x divide-gray-200 dark:divide-white/[0.1]'>
                                {selectedProject.weather.summary.map(
                                  (weather: WeatherSummary, idx: number) => (
                                    <div key={idx} className='p-6 text-center'>
                                      <div className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                                        {weather.forecastTimeTzFormatted}
                                      </div>
                                      <div className='mt-2 text-2xl font-semibold text-blue-500 dark:text-blue-400'>
                                        <i className={weather.iconForecast}></i>{' '}
                                        {weather.tempF}°
                                      </div>
                                      <div className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
                                        <span className='font-medium text-gray-700 dark:text-gray-300'>
                                          Wind:
                                        </span>{' '}
                                        {weather.wind} &nbsp;
                                        <span className='font-medium text-gray-700 dark:text-gray-300'>
                                          Precip:
                                        </span>{' '}
                                        {weather.precip} &nbsp;
                                        <span className='font-medium text-gray-700 dark:text-gray-300'>
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
                              className='overflow-hidden rounded-lg border border-gray-200 bg-white/50 dark:border-white/[0.1] dark:bg-white/[0.02]'>
                              <div className='border-b border-gray-200 bg-gray-50/50 px-6 py-4 dark:border-white/[0.1] dark:bg-black/20'>
                                <h2 className='text-center text-sm font-semibold uppercase text-gray-700 dark:text-gray-300'>
                                  Labor
                                </h2>
                              </div>
                              <div className='p-6'>
                                <table className='w-full'>
                                  <thead>
                                    <tr className='border-b border-gray-200 dark:border-white/[0.1]'>
                                      <th className='pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300'>
                                        Name
                                      </th>
                                      <th className='pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300'>
                                        Cost Code
                                      </th>
                                      <th className='pb-3 text-right text-sm font-medium text-gray-600 dark:text-gray-300'>
                                        {dailyReportData.hoursLabels}
                                      </th>
                                      {selectedProject.labor.hasNotes && (
                                        <th className='pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300'>
                                          Notes
                                        </th>
                                      )}
                                    </tr>
                                  </thead>
                                  <tbody className='divide-y divide-gray-200 dark:divide-white/[0.1]'>
                                    {selectedProject.labor.details.map(
                                      (labor: LaborDetail, idx: number) => (
                                        <tr
                                          key={idx}
                                          className={
                                            idx % 2 === 0
                                              ? 'bg-gray-50/50 dark:bg-white/[0.02]'
                                              : ''
                                          }>
                                          <td className='py-4 pl-4'>
                                            <div className='font-medium text-gray-900 dark:text-white'>
                                              {labor.nameRow.nameCell.crewName}
                                            </div>
                                            <div className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
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
                                                <div className='mt-1 text-[10px] text-gray-500 dark:text-gray-400'>
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
                                            <div className='font-medium text-gray-900 dark:text-white'>
                                              {
                                                labor.nameRow.costCodeCell
                                                  .costCode
                                              }
                                            </div>
                                            <div className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                                              {
                                                labor.nameRow.costCodeCell
                                                  .budgetCodeDescription
                                              }
                                            </div>
                                          </td>
                                          <td className='p-4 text-right text-sm text-gray-900 dark:text-white'>
                                            {labor.nameRow.hoursCell.hours}
                                          </td>
                                          {selectedProject.labor.hasNotes && (
                                            <td className='p-4 text-sm text-gray-500 dark:text-gray-400'>
                                              {labor.nameRow.notesCell}
                                            </td>
                                          )}
                                        </tr>
                                      )
                                    )}
                                    <tr className='border-t border-gray-200 bg-gray-50/80 dark:border-white/[0.1] dark:bg-black/20'>
                                      <td
                                        colSpan={2}
                                        className='p-4 text-right font-medium text-gray-900 dark:text-white'>
                                        TOTAL
                                      </td>
                                      <td className='p-4 text-right font-medium text-gray-900 dark:text-white'>
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
                              className='overflow-hidden rounded-lg border border-gray-200 bg-white/50 dark:border-white/[0.1] dark:bg-white/[0.02]'>
                              <div className='border-b border-gray-200 bg-gray-50/50 px-6 py-4 dark:border-white/[0.1] dark:bg-black/20'>
                                <h2 className='text-center text-sm font-semibold uppercase text-gray-700 dark:text-gray-300'>
                                  Equipment
                                </h2>
                              </div>
                              <div className='p-6'>
                                <table className='w-full'>
                                  <thead>
                                    <tr className='border-b border-gray-200 dark:border-white/[0.1]'>
                                      <th className='pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300'>
                                        Name
                                      </th>
                                      <th className='pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300'>
                                        Cost Code
                                      </th>
                                      <th className='pb-3 text-right text-sm font-medium text-gray-600 dark:text-gray-300'>
                                        {dailyReportData.hoursLabels}
                                      </th>
                                      {selectedProject.equipment.hasNotes && (
                                        <th className='pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300'>
                                          Notes
                                        </th>
                                      )}
                                    </tr>
                                  </thead>
                                  <tbody className='divide-y divide-gray-200 dark:divide-white/[0.1]'>
                                    {selectedProject.equipment.details.map(
                                      (
                                        equipment: EquipmentDetail,
                                        idx: number
                                      ) => (
                                        <Fragment key={`equip-${idx}`}>
                                          <tr
                                            className={
                                              idx % 2 === 0
                                                ? 'bg-gray-50/50 dark:bg-white/[0.02]'
                                                : ''
                                            }>
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
                                              <div className='font-medium text-gray-900 dark:text-white'>
                                                {
                                                  equipment.nameRow.nameCell
                                                    .equipName
                                                }
                                              </div>
                                              <div className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                                                {
                                                  equipment.nameRow.nameCell
                                                    .equipHours
                                                }
                                              </div>
                                              {equipment.nameRow.nameCell.equipTags?.map(
                                                (tag, tagIdx) => (
                                                  <span
                                                    key={tagIdx}
                                                    className='mt-2 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium dark:bg-white/[0.1]'
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
                                              <div className='font-medium text-gray-900 dark:text-white'>
                                                {
                                                  equipment.nameRow.costCodeCell
                                                    .costCode
                                                }
                                              </div>
                                              <div className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                                                {
                                                  equipment.nameRow.costCodeCell
                                                    .budgetCodeDescription
                                                }
                                              </div>
                                            </td>
                                            <td className='p-4 text-right'>
                                              <div className='text-sm text-gray-900 dark:text-white'>
                                                {
                                                  equipment.nameRow.hoursCell
                                                    .hours
                                                }
                                              </div>
                                              {equipment.nameRow.hoursCell.hoursTags?.map(
                                                (tag, tagIdx) => (
                                                  <span
                                                    key={tagIdx}
                                                    className='mt-2 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium dark:bg-white/[0.1]'
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
                                              <td className='p-4 text-sm text-gray-500 dark:text-gray-400'>
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
                                                    ? 'bg-gray-50/50 dark:bg-white/[0.02]'
                                                    : ''
                                                }>
                                                <td className='p-4'>
                                                  <div className='font-medium text-gray-900 dark:text-white'>
                                                    {row.costCodeCell.costCode}
                                                  </div>
                                                  <div className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                                                    {
                                                      row.costCodeCell
                                                        .budgetCodeDescription
                                                    }
                                                  </div>
                                                </td>
                                                <td className='p-4 text-right text-sm text-gray-900 dark:text-white'>
                                                  {row.hoursCell.hours}
                                                </td>
                                                {selectedProject.equipment
                                                  .hasNotes && (
                                                  <td className='p-4 text-sm text-gray-500 dark:text-gray-400'>
                                                    {row.notesCell}
                                                  </td>
                                                )}
                                              </tr>
                                            )
                                          )}
                                        </Fragment>
                                      )
                                    )}
                                    <tr className='border-t border-gray-200 bg-gray-50/80 dark:border-white/[0.1] dark:bg-black/20'>
                                      <td
                                        colSpan={2}
                                        className='p-4 text-right font-medium text-gray-900 dark:text-white'>
                                        TOTAL
                                      </td>
                                      <td className='p-4 text-right font-medium text-gray-900 dark:text-white'>
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
                        return null; // Remove photos section
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
