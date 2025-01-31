declare module 'html2pdf.js' {
  type JsPDFOptions = {
    orientation?: 'portrait' | 'landscape';
    unit?: 'pt' | 'mm' | 'cm' | 'in' | 'px' | 'pc' | 'em' | 'ex';
    format?: string | [number, number];
    compress?: boolean;
    precision?: number;
    userUnit?: number;
    hotfixes?: string[];
    encryption?: {
      userPassword?: string;
      ownerPassword?: string;
      userPermissions?: string[];
    };
    putOnlyUsedFonts?: boolean;
    floatPrecision?: number | 'smart';
  };

  type Html2CanvasOptions = {
    scale?: number;
    useCORS?: boolean;
    allowTaint?: boolean;
    logging?: boolean;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    scrollX?: number;
    scrollY?: number;
    windowWidth?: number;
    windowHeight?: number;
    backgroundColor?: string;
    foreignObjectRendering?: boolean;
    removeContainer?: boolean;
  };

  type ImageOptions = {
    type?: 'jpeg' | 'png' | 'webp';
    quality?: number;
  };

  type PageBreakOptions = {
    mode?: 'css' | 'legacy' | 'avoid-all' | string[];
    before?: string[];
    after?: string[];
    avoid?: string[];
  };

  type Html2PdfOptions = {
    margin?:
      | number
      | [number]
      | [number, number]
      | [number, number, number, number];
    filename?: string;
    image?: ImageOptions;
    enableLinks?: boolean;
    pagebreak?: PageBreakOptions;
    html2canvas?: Html2CanvasOptions;
    jsPDF?: JsPDFOptions;
  };

  type OutputType =
    | 'blob'
    | 'datauristring'
    | 'dataurlstring'
    | 'dataurlnewwindow'
    | string;
  type OutputOptions = {
    optionName: string;
    optionValue: unknown;
  };

  type Html2Pdf = {
    set: (opt: Html2PdfOptions) => Html2Pdf;
    from: (element: HTMLElement | string) => Html2Pdf;
    save: () => Promise<void>;
    output: (
      type: OutputType,
      options?: OutputOptions
    ) => Promise<string | Blob | Window>;
    outputPdf: (type?: OutputType) => Promise<unknown>;
    then: <T>(callback: (result: unknown) => T | Promise<T>) => Promise<T>;
    catch: <T>(callback: (error: Error) => T | Promise<T>) => Promise<T>;
    toPdf: () => Promise<unknown>;
    get: (property: string) => unknown;
  };

  const html2pdf: () => Html2Pdf;
  export = html2pdf;
}
