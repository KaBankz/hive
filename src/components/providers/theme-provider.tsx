'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute='class'
      defaultTheme='dark'
      forcedTheme='dark'
      enableSystem={false}
      disableTransitionOnChange
    >
      <style jsx global>{`
        :root {
          color-scheme: dark;
        }
      `}</style>
      {children}
    </NextThemesProvider>
  );
} 