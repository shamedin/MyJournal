'use client';

import { LanguageProvider } from '@/lib/language-context';
import { Sidebar } from '@/components/navigation/Sidebar';

export function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <Sidebar />
      {children}
    </LanguageProvider>
  );
}
