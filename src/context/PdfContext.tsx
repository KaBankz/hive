'use client';

import { createContext, useContext, useState } from 'react';

type PdfContextType = {
  pdfBlob: Blob | null;
  setPdfBlob: (blob: Blob | null) => void;
};

const PdfContext = createContext<PdfContextType | undefined>(undefined);

export function PdfProvider({ children }: { children: React.ReactNode }) {
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  return (
    <PdfContext.Provider value={{ pdfBlob, setPdfBlob }}>
      {children}
    </PdfContext.Provider>
  );
}

export function usePdf() {
  const context = useContext(PdfContext);
  if (context === undefined) {
    throw new Error('usePdf must be used within a PdfProvider');
  }
  return context;
}
