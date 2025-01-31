import { useCallback } from 'react';

import { usePdf } from '@/context/PdfContext';

type PdfExportOptions = {
  margin?: [number, number, number, number];
  filename: string;
  imageQuality?: number;
  scale?: number;
};

export function usePdfExport() {
  const { setPdfBlob } = usePdf();

  const exportToPdf = useCallback(
    async (element: HTMLElement, options: PdfExportOptions) => {
      const html2pdf = (await import('html2pdf.js')).default;

      const opt = {
        margin: options.margin ?? [6, 12, 6, 12],
        filename: options.filename,
        image: {
          type: 'jpeg' as const,
          quality: options.imageQuality ?? 1,
        },
        html2canvas: {
          scale: options.scale ?? 3,
          useCORS: true,
          letterRendering: true,
          scrollX: 0,
          scrollY: 0,
          imageTimeout: 0,
          width: element.offsetWidth,
        },
        jsPDF: {
          unit: 'pt' as const,
          format: 'a4',
          orientation: 'portrait' as const,
          precision: 16,
          compress: true,
        },
      };

      // Generate PDF blob
      const pdfBlob = (await html2pdf()
        .set(opt)
        .from(element)
        .output('blob')) as Blob;
      setPdfBlob(pdfBlob);

      // Save the file
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = opt.filename;
      link.click();
      URL.revokeObjectURL(pdfUrl);

      return pdfBlob;
    },
    [setPdfBlob]
  );

  return { exportToPdf };
}
