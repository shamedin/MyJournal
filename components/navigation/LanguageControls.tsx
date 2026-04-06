'use client';

import { useLanguage } from '@/lib/language-context';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function LanguageControls() {
  const { language, setLanguage, t } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languageOptions = [
    { code: 'en', label: 'English' },
    { code: 'am', label: 'አማርኛ (Amharic)' },
    { code: 'af', label: 'Afan Oromo' },
  ];

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowLanguageMenu(!showLanguageMenu)}
        className="rounded-lg hover:bg-primary/20 w-12 h-12 flex items-center justify-center transition-all relative"
      >
        <Globe className="w-6 h-6 text-primary font-bold" />
      </Button>
      {showLanguageMenu && (
        <div className="absolute top-14 right-14 bg-card border border-border rounded-lg shadow-lg p-2 space-y-1 z-50">
          {languageOptions.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code as any);
                setShowLanguageMenu(false);
              }}
              className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                language === lang.code
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

export function DesktopLanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  const languageOptions = [
    { code: 'en', label: 'English' },
    { code: 'am', label: 'አማርኛ' },
    { code: 'af', label: 'Afan Oromo' },
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm text-sidebar-foreground/60 block px-4">{t('sidebar.selectLanguage')}</label>
      <div className="grid grid-cols-3 gap-2 px-2">
        {languageOptions.map((lang) => (
          <Button
            key={lang.code}
            onClick={() => setLanguage(lang.code as any)}
            variant={language === lang.code ? 'default' : 'outline'}
            size="sm"
            className="text-xs h-8"
          >
            {lang.code.toUpperCase()}
          </Button>
        ))}
      </div>
    </div>
  );
}
