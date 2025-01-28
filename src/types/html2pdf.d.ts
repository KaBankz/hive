declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number[];
    filename?: string;
    image?: { type: string; quality: number };
    html2canvas?: Record<string, any>;
    jsPDF?: Record<string, any>;
  }

  interface Html2Pdf {
    set: (opt: Html2PdfOptions) => Html2Pdf;
    from: (element: HTMLElement) => Html2Pdf;
    output: (type: string) => Promise<Blob>;
    outputPdf: (type: string) => Promise<Blob>;
  }

  const html2pdf: () => Html2Pdf;
  export = html2pdf;
}
