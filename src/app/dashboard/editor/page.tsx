'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Cloud, FileText, ImageIcon, Tag, Truck, Users } from 'lucide-react';

import { usePdf } from '@/context/PdfContext';
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
  questions: boolean;
  quantities: boolean;
  deliveries: boolean;
  inspections: boolean;
  visitors: boolean;
  notes: boolean;
};

type SubItemVisibility = {
  weather: { [key: string]: boolean }; // key is forecastTimeTzFormatted
  labor: { [key: string]: boolean }; // key is crewName
  equipment: { [key: string]: boolean }; // key is equipName
  photos: { [key: string]: boolean }; // key is photo url
  questions: { [key: string]: boolean }; // key is fullName
  quantities: { [key: string]: boolean }; // key is itemNumber
  deliveries: { [key: string]: boolean }; // key is itemNumber
  inspections: { [key: string]: boolean }; // key is itemNumber
  visitors: { [key: string]: boolean }; // key is itemNumber
  notes: { [key: string]: boolean }; // key is itemNumber
};

type SectionConfig = {
  id: keyof SectionVisibility;
  label: string;
  icon: React.ReactNode;
};

// Helper function to sort items based on order
const sortByOrder = <T,>(
  items: T[],
  order: string[],
  getKey: (item: T) => string
): T[] => {
  return [...items].sort(
    (a, b) => order.indexOf(getKey(a)) - order.indexOf(getKey(b))
  );
};

// Add this after the existing type definitions
type SectionRef = {
  reportInfo?: HTMLDivElement | null;
  weather?: HTMLDivElement | null;
  labor?: HTMLDivElement | null;
  equipment?: HTMLDivElement | null;
  photos?: HTMLDivElement | null;
  questions?: HTMLDivElement | null;
  quantities?: HTMLDivElement | null;
  deliveries?: HTMLDivElement | null;
  inspections?: HTMLDivElement | null;
  visitors?: HTMLDivElement | null;
  notes?: HTMLDivElement | null;
};

export default function EditorPage() {
  const searchParams = useSearchParams();
  const projectIndex = parseInt(searchParams.get('project') || '0');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPageBreaks, setShowPageBreaks] = useState(true);
  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>(
    {
      reportInfo: true,
      weather: true,
      labor: true,
      equipment: true,
      photos: true,
      questions: false,
      quantities: false,
      deliveries: false,
      inspections: false,
      visitors: false,
      notes: false,
    }
  );

  const { setPdfBlob } = usePdf();

  // Initialize sub-item visibility
  const [subItemVisibility, setSubItemVisibility] = useState<SubItemVisibility>(
    () => {
      const selectedProject = dailyReportData.dailyLogs[projectIndex];
      return {
        weather:
          selectedProject.weather?.summary.reduce(
            (acc, item) => {
              acc[item.forecastTimeTzFormatted] = true;
              return acc;
            },
            {} as { [key: string]: boolean }
          ) || {},
        labor:
          selectedProject.labor?.details.reduce(
            (acc, item) => {
              acc[item.nameRow.nameCell.crewName] = true;
              return acc;
            },
            {} as { [key: string]: boolean }
          ) || {},
        equipment:
          selectedProject.equipment?.details.reduce(
            (acc, item) => {
              acc[item.nameRow.nameCell.equipName] = true;
              return acc;
            },
            {} as { [key: string]: boolean }
          ) || {},
        photos:
          selectedProject.images?.details.reduce(
            (acc, item, idx) => {
              acc[item.url || `photo-${idx}`] = true;
              return acc;
            },
            {} as { [key: string]: boolean }
          ) || {},
        questions:
          selectedProject.questions?.details.reduce(
            (acc, item) => {
              acc[item.fullName] = true;
              return acc;
            },
            {} as { [key: string]: boolean }
          ) || {},
        quantities:
          selectedProject.quantities?.details.reduce(
            (acc, item) => {
              acc[item.itemNumber] = true;
              return acc;
            },
            {} as { [key: string]: boolean }
          ) || {},
        deliveries:
          selectedProject.deliveries?.details.reduce(
            (acc, item) => {
              acc[item.itemNumber] = true;
              return acc;
            },
            {} as { [key: string]: boolean }
          ) || {},
        inspections:
          selectedProject.inspections?.details.reduce(
            (acc, item) => {
              acc[item.itemNumber] = true;
              return acc;
            },
            {} as { [key: string]: boolean }
          ) || {},
        visitors:
          selectedProject.visitors?.details.reduce(
            (acc, item) => {
              acc[item.itemNumber] = true;
              return acc;
            },
            {} as { [key: string]: boolean }
          ) || {},
        notes:
          selectedProject.notes?.details.reduce(
            (acc, item) => {
              acc[item.itemNumber] = true;
              return acc;
            },
            {} as { [key: string]: boolean }
          ) || {},
      };
    }
  );

  const selectedProject = dailyReportData.dailyLogs[projectIndex];

  // Filter sections based on available data
  const availableSections: SectionConfig[] = [
    {
      id: 'reportInfo',
      label: 'Report Information',
      icon: <FileText size={12} className='text-gray-500' />,
    },
    selectedProject.weather && {
      id: 'weather',
      label: 'Weather',
      icon: <Cloud size={12} className='text-gray-500' />,
    },
    (selectedProject.labor?.details?.length ?? 0) > 0 && {
      id: 'labor',
      label: 'Labor',
      icon: <Users size={12} className='text-gray-500' />,
    },
    (selectedProject.equipment?.details?.length ?? 0) > 0 && {
      id: 'equipment',
      label: 'Equipment',
      icon: <Truck size={12} className='text-gray-500' />,
    },
    (selectedProject.images?.details?.length ?? 0) > 0 && {
      id: 'photos',
      label: 'Photos',
      icon: <ImageIcon size={12} className='text-gray-500' />,
    },
    (selectedProject.questions?.details?.length ?? 0) > 0 && {
      id: 'questions',
      label: 'Questions',
      icon: <FileText size={12} className='text-gray-500' />,
    },
    (selectedProject.quantities?.details?.length ?? 0) > 0 && {
      id: 'quantities',
      label: 'Quantities',
      icon: <FileText size={12} className='text-gray-500' />,
    },
    (selectedProject.deliveries?.details?.length ?? 0) > 0 && {
      id: 'deliveries',
      label: 'Deliveries',
      icon: <FileText size={12} className='text-gray-500' />,
    },
    (selectedProject.inspections?.details?.length ?? 0) > 0 && {
      id: 'inspections',
      label: 'Inspections',
      icon: <FileText size={12} className='text-gray-500' />,
    },
    (selectedProject.visitors?.details?.length ?? 0) > 0 && {
      id: 'visitors',
      label: 'Visitors',
      icon: <FileText size={12} className='text-gray-500' />,
    },
    (selectedProject.notes?.details?.length ?? 0) > 0 && {
      id: 'notes',
      label: 'Notes',
      icon: <FileText size={12} className='text-gray-500' />,
    },
  ].filter(Boolean) as SectionConfig[];

  // Keep section order in sync with available sections
  const [sectionOrder, setSectionOrder] = useState<
    Array<keyof SectionVisibility>
  >(() => {
    const defaultOrder: Array<keyof SectionVisibility> = [
      'reportInfo',
      'weather',
      'labor',
      'equipment',
      'photos',
      'questions',
      'quantities',
      'deliveries',
      'inspections',
      'visitors',
      'notes',
    ];
    return defaultOrder.filter((id) =>
      availableSections.some((section) => section.id === id)
    );
  });

  // Track sub-item order
  const [subItemOrder, setSubItemOrder] = useState<{
    [K in keyof SubItemVisibility]: string[];
  }>(() => {
    const selectedProject = dailyReportData.dailyLogs[projectIndex];
    return {
      weather:
        selectedProject.weather?.summary.map(
          (w) => w.forecastTimeTzFormatted
        ) || [],
      labor:
        selectedProject.labor?.details.map(
          (l) => l.nameRow.nameCell.crewName
        ) || [],
      equipment:
        selectedProject.equipment?.details.map(
          (e) => e.nameRow.nameCell.equipName
        ) || [],
      photos:
        selectedProject.images?.details.map(
          (p, idx) => p.url || `photo-${idx}`
        ) || [],
      questions:
        selectedProject.questions?.details.map((q) => q.fullName) || [],
      quantities:
        selectedProject.quantities?.details.map((q) => q.itemNumber) || [],
      deliveries:
        selectedProject.deliveries?.details.map((d) => d.itemNumber) || [],
      inspections:
        selectedProject.inspections?.details.map((i) => i.itemNumber) || [],
      visitors:
        selectedProject.visitors?.details.map((v) => v.itemNumber) || [],
      notes: selectedProject.notes?.details.map((n) => n.itemNumber) || [],
    };
  });

  const orderedSections = sectionOrder
    .map((id) => availableSections.find((s) => s.id === id))
    .filter(Boolean) as SectionConfig[];

  // Add this section refs state
  const sectionRefs = useRef<SectionRef>({});

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    // Handle section reordering
    if (active.data.current?.type === 'section') {
      setSectionOrder((items) => {
        const oldIndex = items.indexOf(active.id as keyof SectionVisibility);
        const newIndex = items.indexOf(over.id as keyof SectionVisibility);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    // Handle sub-item reordering
    else if (
      active.data.current?.type === 'sub-item' &&
      active.data.current?.sectionId
    ) {
      const sectionId = active.data.current
        .sectionId as keyof SubItemVisibility;
      setSubItemOrder((prev) => ({
        ...prev,
        [sectionId]: arrayMove(
          prev[sectionId],
          prev[sectionId].indexOf(active.id as string),
          prev[sectionId].indexOf(over.id as string)
        ),
      }));
    }
  }

  const handleExportPDF = async () => {
    setIsGenerating(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
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

      // Generate PDF blob
      const pdf = await html2pdf().set(opt).from(element).output('blob');
      setPdfBlob(pdf);

      // Save the file
      const pdfUrl = URL.createObjectURL(pdf);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = opt.filename;
      link.click();
      URL.revokeObjectURL(pdfUrl);
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-generate PDF for chat context when content changes
  useEffect(() => {
    const generatePdfForChat = async () => {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('document-container');
      if (!element) return;

      const opt = {
        margin: [6, 12, 6, 12],
        image: { type: 'jpeg', quality: 0.8 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          scrollX: 0,
          scrollY: 0,
          width: element.offsetWidth,
        },
        jsPDF: {
          unit: 'pt',
          format: 'a4',
          orientation: 'portrait',
          compress: true,
        },
      };

      try {
        const pdf = await html2pdf().set(opt).from(element).output('blob');
        setPdfBlob(pdf);
      } catch (error) {
        console.error('Error generating PDF for chat:', error);
      }
    };

    // Debounce the PDF generation to avoid too frequent updates
    const timeoutId = setTimeout(generatePdfForChat, 1000);
    return () => clearTimeout(timeoutId);
  }, [
    sectionVisibility,
    subItemVisibility,
    sectionOrder,
    subItemOrder,
    setPdfBlob,
  ]);

  // Add toggle functions for sub-items
  const toggleSubItem = (section: keyof SubItemVisibility, itemKey: string) => {
    setSubItemVisibility((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [itemKey]: !prev[section][itemKey],
      },
    }));
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
                className='relative mx-auto w-[8.27in] rounded-lg bg-white px-8 py-4 shadow-lg ring-1 ring-black/[0.1]'>
                {/* Page break lines */}
                {showPageBreaks && (
                  <div
                    className='pointer-events-none absolute -inset-y-4 inset-x-0 z-10'
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(to bottom, transparent, transparent calc(11.69in + 2rem - 2px), #ef4444 calc(11.69in + 2rem - 2px), #ef4444 calc(11.69in + 2rem))',
                      backgroundSize: '100% calc(11.69in + 3rem)',
                    }}
                  />
                )}
                {/* Company Header */}
                <div className='mb-8 border-b border-gray-200 pb-4'>
                  <div className='flex items-center justify-between'>
                    <h1 className='text-lg font-semibold text-blue-500'>
                      {dailyReportData.companyName}
                    </h1>
                    <Image
                      src='/images/riskcast.png'
                      alt='Company Logo'
                      width={100}
                      height={24}
                      className='object-contain'
                      unoptimized
                      onError={(e) => {
                        // Use next.svg as fallback
                        const img = e.target as HTMLImageElement;
                        img.src = '/next.svg';
                      }}
                      priority
                    />
                  </div>
                </div>

                {/* Document Content */}
                <div className='space-y-8'>
                  {orderedSections.map((section) => {
                    if (!sectionVisibility[section.id]) return null;

                    // Add this wrapper div around each section
                    return (
                      <div
                        key={section.id}
                        ref={(el) => {
                          sectionRefs.current[section.id] = el;
                        }}
                        className='break-inside-avoid-page'
                        style={{
                          pageBreakInside: 'avoid',
                          breakInside: 'avoid-page',
                        }}>
                        {/* Existing section switch statement content */}
                        {(() => {
                          switch (section.id) {
                            case 'reportInfo':
                              return (
                                <div className='overflow-hidden rounded-lg border border-gray-200 bg-white/50'>
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
                                  <div className='overflow-hidden rounded-lg border border-gray-200 bg-white/50'>
                                    <div className='border-b border-gray-200 bg-gray-50/50 px-4 py-3'>
                                      <h2 className='text-center text-xs font-semibold uppercase text-gray-700'>
                                        Weather
                                      </h2>
                                    </div>
                                    <div className='grid grid-cols-3 divide-x divide-gray-200'>
                                      {sortByOrder(
                                        selectedProject.weather
                                          .summary as WeatherSummary[],
                                        subItemOrder.weather,
                                        (w) => w.forecastTimeTzFormatted
                                      ).map(
                                        (weather) =>
                                          subItemVisibility.weather[
                                            weather.forecastTimeTzFormatted
                                          ] && (
                                            <div
                                              key={
                                                weather.forecastTimeTzFormatted
                                              }
                                              className='p-4 text-center'>
                                              <div className='text-xs font-medium text-gray-600'>
                                                {
                                                  weather.forecastTimeTzFormatted
                                                }
                                              </div>
                                              <div className='mt-2 text-lg font-semibold text-blue-500'>
                                                <i
                                                  className={
                                                    weather.iconForecast
                                                  }></i>{' '}
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
                                          {sortByOrder(
                                            selectedProject.labor.details,
                                            subItemOrder.labor,
                                            (l) => l.nameRow.nameCell.crewName
                                          ).map(
                                            (labor: LaborDetail, idx: number) =>
                                              subItemVisibility.labor[
                                                labor.nameRow.nameCell.crewName
                                              ] && (
                                                <tr
                                                  key={
                                                    labor.nameRow.nameCell
                                                      .crewName
                                                  }
                                                  className={cn(
                                                    idx % 2 === 0
                                                      ? 'bg-gray-50/50'
                                                      : ''
                                                  )}>
                                                  <td className='py-3 pl-3'>
                                                    <div className='text-xs font-medium text-gray-900'>
                                                      {
                                                        labor.nameRow.nameCell
                                                          .crewName
                                                      }
                                                    </div>
                                                    <div className='mt-1 text-[10px] text-gray-500'>
                                                      {
                                                        labor.nameRow.nameCell
                                                          .crewHours
                                                      }
                                                    </div>
                                                    {labor.nameRow.nameCell
                                                      .signatureFileUrl && (
                                                      <div className='mt-2'>
                                                        <Image
                                                          src={
                                                            labor.nameRow
                                                              .nameCell
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
                                                            labor.nameRow
                                                              .nameCell
                                                              .signatureTimeStamp
                                                          }
                                                        </div>
                                                      </div>
                                                    )}
                                                  </td>
                                                  <td className='p-3'>
                                                    <div className='text-xs font-medium text-gray-900'>
                                                      {
                                                        labor.nameRow
                                                          .costCodeCell.costCode
                                                      }
                                                    </div>
                                                    <div className='mt-1 text-[10px] text-gray-500'>
                                                      {
                                                        labor.nameRow
                                                          .costCodeCell
                                                          .budgetCodeDescription
                                                      }
                                                    </div>
                                                  </td>
                                                  <td className='p-3 text-right text-xs text-gray-900'>
                                                    {
                                                      labor.nameRow.hoursCell
                                                        .hours
                                                    }
                                                  </td>
                                                  {selectedProject.labor
                                                    .hasNotes && (
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
                                              {
                                                selectedProject?.labor
                                                  ?.totalHours
                                              }
                                            </td>
                                            {selectedProject?.labor
                                              ?.hasNotes && <td></td>}
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
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              Name
                                            </th>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              Cost Code
                                            </th>
                                            <th className='pb-2 text-right text-xs font-medium text-gray-600'>
                                              {dailyReportData.hoursLabels}
                                            </th>
                                            {selectedProject.equipment
                                              .hasNotes && (
                                              <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                                Notes
                                              </th>
                                            )}
                                          </tr>
                                        </thead>
                                        <tbody className='divide-y divide-gray-200'>
                                          {sortByOrder(
                                            selectedProject.equipment.details,
                                            subItemOrder.equipment,
                                            (e) => e.nameRow.nameCell.equipName
                                          ).map(
                                            (
                                              equipment: EquipmentDetail,
                                              idx: number
                                            ) =>
                                              subItemVisibility.equipment[
                                                equipment.nameRow.nameCell
                                                  .equipName
                                              ] && (
                                                <Fragment
                                                  key={
                                                    equipment.nameRow.nameCell
                                                      .equipName
                                                  }>
                                                  <tr
                                                    className={cn(
                                                      idx % 2 === 0
                                                        ? 'bg-gray-50/50'
                                                        : ''
                                                    )}>
                                                    <td
                                                      className='p-3'
                                                      rowSpan={
                                                        equipment
                                                          .additionalCostCodeRows
                                                          ?.length
                                                          ? equipment
                                                              .additionalCostCodeRows
                                                              .length + 1
                                                          : 1
                                                      }>
                                                      <div className='text-xs font-medium text-gray-900'>
                                                        {
                                                          equipment.nameRow
                                                            .nameCell.equipName
                                                        }
                                                      </div>
                                                      <div className='mt-1 text-[10px] text-gray-500'>
                                                        {
                                                          equipment.nameRow
                                                            .nameCell.equipHours
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
                                                          equipment.nameRow
                                                            .costCodeCell
                                                            .costCode
                                                        }
                                                      </div>
                                                      <div className='mt-1 text-[10px] text-gray-500'>
                                                        {
                                                          equipment.nameRow
                                                            .costCodeCell
                                                            .budgetCodeDescription
                                                        }
                                                      </div>
                                                    </td>
                                                    <td className='p-3 text-right'>
                                                      <div className='text-xs text-gray-900'>
                                                        {
                                                          equipment.nameRow
                                                            .hoursCell.hours
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
                                                        {
                                                          equipment.nameRow
                                                            .notesCell
                                                        }
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
                                                            {
                                                              row.costCodeCell
                                                                .costCode
                                                            }
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
                                                        {selectedProject
                                                          .equipment
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
                                              {
                                                selectedProject?.equipment
                                                  ?.totalHours
                                              }
                                            </td>
                                            {selectedProject?.equipment
                                              ?.hasNotes && <td></td>}
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )
                              );
                            case 'photos':
                              return (
                                selectedProject.images?.details && (
                                  <div
                                    key='photos'
                                    className='break-inside-avoid-page overflow-hidden rounded-lg border border-gray-200 bg-white/50'
                                    style={{
                                      pageBreakInside: 'avoid',
                                      breakInside: 'avoid-page',
                                    }}>
                                    <div className='border-b border-gray-200 bg-gray-50/50 px-4 py-3'>
                                      <h2 className='text-center text-xs font-semibold uppercase text-gray-700'>
                                        Site Photos
                                      </h2>
                                    </div>
                                    <div className='grid grid-cols-2 gap-4 p-4'>
                                      {sortByOrder(
                                        selectedProject.images.details,
                                        subItemOrder.photos,
                                        (p) =>
                                          p.url ||
                                          `photo-${selectedProject.images.details.indexOf(p)}`
                                      ).map(
                                        (photo, idx) =>
                                          subItemVisibility.photos[
                                            photo.url || `photo-${idx}`
                                          ] && (
                                            <div
                                              key={photo.url || `photo-${idx}`}
                                              className='break-inside-avoid-page'
                                              style={{
                                                pageBreakInside: 'avoid',
                                                breakInside: 'avoid-page',
                                              }}>
                                              <div className='relative aspect-[4/3] w-full overflow-hidden rounded-lg'>
                                                <Image
                                                  src={
                                                    photo.url.startsWith(
                                                      'https'
                                                    )
                                                      ? photo.url
                                                      : `/${photo.url}`
                                                  }
                                                  alt={`Site photo ${idx + 1}`}
                                                  width={400}
                                                  height={300}
                                                  className='size-full object-cover'
                                                  unoptimized
                                                />
                                              </div>
                                              <p className='text-[10px] text-gray-500'>
                                                {photo.note}
                                              </p>
                                            </div>
                                          )
                                      )}
                                    </div>
                                  </div>
                                )
                              );
                            case 'questions':
                              return (
                                selectedProject.questions && (
                                  <div className='overflow-hidden rounded-lg border border-gray-200 bg-white/50'>
                                    <div className='border-b border-gray-200 bg-gray-50/50 px-4 py-3'>
                                      <h2 className='text-center text-xs font-semibold uppercase text-gray-700'>
                                        Questions
                                      </h2>
                                    </div>
                                    <div className='p-4'>
                                      {sortByOrder(
                                        selectedProject.questions.details,
                                        subItemOrder.questions,
                                        (q) => q.fullName
                                      ).map(
                                        (person) =>
                                          subItemVisibility.questions[
                                            person.fullName
                                          ] && (
                                            <div
                                              key={person.fullName}
                                              className='mb-6 last:mb-0'>
                                              <div className='mb-3 text-sm font-medium text-gray-900'>
                                                {person.fullName}
                                              </div>
                                              <table className='w-full table-fixed'>
                                                <thead>
                                                  <tr className='border-b border-gray-200'>
                                                    <th className='w-12 pb-2 text-left text-xs font-medium text-gray-600'>
                                                      #
                                                    </th>
                                                    <th className='w-[calc(50%-3rem)] pb-2 text-left text-xs font-medium text-gray-600'>
                                                      Question
                                                    </th>
                                                    <th className='w-[calc(50%-3rem)] pb-2 text-left text-xs font-medium text-gray-600'>
                                                      Response
                                                    </th>
                                                  </tr>
                                                </thead>
                                                <tbody className='divide-y divide-gray-200'>
                                                  {person.responses.map(
                                                    (response) => (
                                                      <tr
                                                        key={
                                                          response.questionSortOrder
                                                        }>
                                                        <td className='py-3 pr-4 text-xs text-gray-900'>
                                                          {
                                                            response.questionSortOrder
                                                          }
                                                        </td>
                                                        <td className='py-3 pr-4 text-xs text-gray-900'>
                                                          <div className='break-words'>
                                                            {
                                                              response.questionText
                                                            }
                                                          </div>
                                                        </td>
                                                        <td className='py-3 text-xs text-gray-900'>
                                                          <div className='break-words'>
                                                            {
                                                              response.responseValue
                                                            }
                                                          </div>
                                                          <div className='mt-1 text-[10px] text-gray-500'>
                                                            {
                                                              response.localTzResponseTimeStamp
                                                            }
                                                          </div>
                                                        </td>
                                                      </tr>
                                                    )
                                                  )}
                                                </tbody>
                                              </table>
                                            </div>
                                          )
                                      )}
                                    </div>
                                  </div>
                                )
                              );
                            case 'quantities':
                              return (
                                selectedProject.quantities && (
                                  <div className='overflow-hidden rounded-lg border border-gray-200 bg-white/50'>
                                    <div className='border-b border-gray-200 bg-gray-50/50 px-4 py-3'>
                                      <h2 className='text-center text-xs font-semibold uppercase text-gray-700'>
                                        Quantities
                                      </h2>
                                    </div>
                                    <div className='p-4'>
                                      <table className='w-full'>
                                        <thead>
                                          <tr className='border-b border-gray-200'>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              Item #
                                            </th>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              Project
                                            </th>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              Cost Code
                                            </th>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              UOM
                                            </th>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              Location
                                            </th>
                                            <th className='pb-2 text-right text-xs font-medium text-gray-600'>
                                              Period Qty
                                            </th>
                                            <th className='pb-2 text-right text-xs font-medium text-gray-600'>
                                              To Date Qty
                                            </th>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              Notes
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody className='divide-y divide-gray-200'>
                                          {sortByOrder(
                                            selectedProject.quantities.details,
                                            subItemOrder.quantities,
                                            (q) => q.itemNumber
                                          ).map(
                                            (quantity, idx) =>
                                              subItemVisibility.quantities[
                                                quantity.itemNumber
                                              ] && (
                                                <tr
                                                  key={quantity.itemNumber}
                                                  className={cn(
                                                    idx % 2 === 0
                                                      ? 'bg-gray-50/50'
                                                      : ''
                                                  )}>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {quantity.itemNumber}
                                                  </td>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {quantity._projectNumber}
                                                  </td>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {
                                                      quantity._costCodeAndDescription
                                                    }
                                                  </td>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {quantity._UOM}
                                                  </td>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {
                                                      quantity._projectLocationCode
                                                    }
                                                  </td>
                                                  <td className='py-3 text-right text-xs text-gray-900'>
                                                    {quantity._periodQty}
                                                  </td>
                                                  <td className='py-3 text-right text-xs text-gray-900'>
                                                    {quantity._toDateQty}
                                                  </td>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {quantity._note}
                                                  </td>
                                                </tr>
                                              )
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )
                              );
                            case 'deliveries':
                              return (
                                selectedProject.deliveries && (
                                  <div className='overflow-hidden rounded-lg border border-gray-200 bg-white/50'>
                                    <div className='border-b border-gray-200 bg-gray-50/50 px-4 py-3'>
                                      <h2 className='text-center text-xs font-semibold uppercase text-gray-700'>
                                        Deliveries
                                      </h2>
                                    </div>
                                    <div className='p-4'>
                                      <table className='w-full'>
                                        <thead>
                                          <tr className='border-b border-gray-200'>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              Item #
                                            </th>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              Time
                                            </th>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              From
                                            </th>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              Tracking #
                                            </th>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              Location
                                            </th>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              Contents
                                            </th>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              Notes
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody className='divide-y divide-gray-200'>
                                          {sortByOrder(
                                            selectedProject.deliveries.details,
                                            subItemOrder.deliveries,
                                            (d) => d.itemNumber
                                          ).map(
                                            (delivery, idx) =>
                                              subItemVisibility.deliveries[
                                                delivery.itemNumber
                                              ] && (
                                                <tr
                                                  key={delivery.itemNumber}
                                                  className={cn(
                                                    idx % 2 === 0
                                                      ? 'bg-gray-50/50'
                                                      : ''
                                                  )}>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {delivery.itemNumber}
                                                  </td>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {
                                                      delivery.deliveryTimeLocalString
                                                    }
                                                  </td>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {delivery.deliveryFrom}
                                                  </td>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {
                                                      delivery.deliveryTrackingNumber
                                                    }
                                                  </td>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {delivery.deliveryLocation}
                                                  </td>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {delivery.deliveryContents}
                                                  </td>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {delivery.deliveryNotes}
                                                  </td>
                                                </tr>
                                              )
                                          )}
                                        </tbody>
                                      </table>

                                      {selectedProject.deliveries.images &&
                                        selectedProject.deliveries.images
                                          .length > 0 && (
                                          <div className='mt-6 border-t border-gray-200 pt-6'>
                                            <h3 className='mb-4 text-xs font-medium text-gray-700'>
                                              Delivery Photos
                                            </h3>
                                            <div className='grid grid-cols-2 gap-4'>
                                              {selectedProject.deliveries.images.map(
                                                (image, idx) => (
                                                  <div
                                                    key={`${image.label}-${idx}`}
                                                    className='break-inside-avoid-page'
                                                    style={{
                                                      pageBreakInside: 'avoid',
                                                      breakInside: 'avoid-page',
                                                    }}>
                                                    <div className='relative aspect-[4/3] w-full overflow-hidden rounded-lg'>
                                                      <Image
                                                        src={
                                                          image.url.startsWith(
                                                            'https'
                                                          )
                                                            ? image.url
                                                            : `/${image.url}`
                                                        }
                                                        alt={`Delivery photo ${idx + 1}`}
                                                        width={400}
                                                        height={300}
                                                        className='size-full object-cover'
                                                        unoptimized
                                                      />
                                                    </div>
                                                    <p className='text-[10px] text-gray-500'>
                                                      {image.label}
                                                    </p>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                )
                              );
                            case 'inspections':
                              return (
                                selectedProject.inspections && (
                                  <div className='overflow-hidden rounded-lg border border-gray-200 bg-white/50'>
                                    <div className='border-b border-gray-200 bg-gray-50/50 px-4 py-3'>
                                      <h2 className='text-center text-xs font-semibold uppercase text-gray-700'>
                                        Inspections
                                      </h2>
                                    </div>
                                    <div className='p-4'>
                                      <table className='w-full'>
                                        <thead>
                                          <tr className='border-b border-gray-200'>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              Item #
                                            </th>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              Time
                                            </th>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              End Time
                                            </th>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              Type
                                            </th>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              Entity
                                            </th>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              Inspector
                                            </th>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              Location
                                            </th>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              Area
                                            </th>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              Notes
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody className='divide-y divide-gray-200'>
                                          {sortByOrder(
                                            selectedProject.inspections.details,
                                            subItemOrder.inspections,
                                            (i) => i.itemNumber
                                          ).map(
                                            (inspection, idx) =>
                                              subItemVisibility.inspections[
                                                inspection.itemNumber
                                              ] && (
                                                <tr
                                                  key={inspection.itemNumber}
                                                  className={cn(
                                                    idx % 2 === 0
                                                      ? 'bg-gray-50/50'
                                                      : ''
                                                  )}>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {inspection.itemNumber}
                                                  </td>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {
                                                      inspection.startTimeLocalString
                                                    }
                                                  </td>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {
                                                      inspection.endTimeLocalString
                                                    }
                                                  </td>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {inspection.inspectionType}
                                                  </td>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {
                                                      inspection.inspectionEntity
                                                    }
                                                  </td>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {inspection.inspectorName}
                                                  </td>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {
                                                      inspection.inspectionLocation
                                                    }
                                                  </td>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {inspection.inspectionArea}
                                                  </td>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {inspection.inspectionNotes}
                                                  </td>
                                                </tr>
                                              )
                                          )}
                                        </tbody>
                                      </table>

                                      {selectedProject.inspections.images &&
                                        selectedProject.inspections.images
                                          .length > 0 && (
                                          <div className='mt-6 border-t border-gray-200 pt-6'>
                                            <h3 className='mb-4 text-xs font-medium text-gray-700'>
                                              Inspection Photos
                                            </h3>
                                            <div className='grid grid-cols-2 gap-4'>
                                              {selectedProject.inspections.images.map(
                                                (image, idx) => (
                                                  <div
                                                    key={`${image.label}-${idx}`}
                                                    className='break-inside-avoid-page'
                                                    style={{
                                                      pageBreakInside: 'avoid',
                                                      breakInside: 'avoid-page',
                                                    }}>
                                                    <div className='relative aspect-[4/3] w-full overflow-hidden rounded-lg'>
                                                      <Image
                                                        src={
                                                          image.url.startsWith(
                                                            'https'
                                                          )
                                                            ? image.url
                                                            : `/${image.url}`
                                                        }
                                                        alt={`Inspection photo ${idx + 1}`}
                                                        width={400}
                                                        height={300}
                                                        className='size-full object-cover'
                                                        unoptimized
                                                      />
                                                    </div>
                                                    <p className='text-[10px] text-gray-500'>
                                                      {image.label}
                                                    </p>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                )
                              );
                            case 'visitors':
                              return (
                                selectedProject.visitors && (
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
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              Item #
                                            </th>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              Visitor Name
                                            </th>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              Start Time
                                            </th>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              End Time
                                            </th>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              Notes
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody className='divide-y divide-gray-200'>
                                          {sortByOrder(
                                            selectedProject.visitors.details,
                                            subItemOrder.visitors,
                                            (v) => v.itemNumber
                                          ).map(
                                            (visitor, idx) =>
                                              subItemVisibility.visitors[
                                                visitor.itemNumber
                                              ] && (
                                                <tr
                                                  key={visitor.itemNumber}
                                                  className={cn(
                                                    idx % 2 === 0
                                                      ? 'bg-gray-50/50'
                                                      : ''
                                                  )}>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {visitor.itemNumber}
                                                  </td>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {visitor.visitorName}
                                                  </td>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {
                                                      visitor.startTimeLocalString
                                                    }
                                                  </td>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {visitor.endTimeLocalString ||
                                                      '-'}
                                                  </td>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {visitor.visitorNotes ||
                                                      '-'}
                                                  </td>
                                                </tr>
                                              )
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )
                              );
                            case 'notes':
                              return (
                                selectedProject.notes && (
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
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              Item #
                                            </th>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              Location
                                            </th>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              Notes
                                            </th>
                                            <th className='pb-2 text-left text-xs font-medium text-gray-600'>
                                              User
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody className='divide-y divide-gray-200'>
                                          {sortByOrder(
                                            selectedProject.notes.details,
                                            subItemOrder.notes,
                                            (n) => n.itemNumber
                                          ).map(
                                            (note, idx) =>
                                              subItemVisibility.notes[
                                                note.itemNumber
                                              ] && (
                                                <tr
                                                  key={note.itemNumber}
                                                  className={cn(
                                                    idx % 2 === 0
                                                      ? 'bg-gray-50/50'
                                                      : ''
                                                  )}>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {note.itemNumber}
                                                  </td>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {note.noteLocation}
                                                  </td>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {note.notes}
                                                  </td>
                                                  <td className='py-3 text-xs text-gray-900'>
                                                    {note._userFullName || '-'}
                                                  </td>
                                                </tr>
                                              )
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )
                              );
                            default:
                              return null;
                          }
                        })()}
                      </div>
                    );
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
          subItemVisibility={subItemVisibility}
          onToggleSubItem={toggleSubItem}
          sectionOrder={sectionOrder}
          orderedSections={orderedSections}
          onDragEnd={handleDragEnd}
          showPageBreaks={showPageBreaks}
          onTogglePageBreaks={setShowPageBreaks}
          selectedProject={selectedProject}
          subItemOrder={subItemOrder}
        />
      </div>
    </div>
  );
}
