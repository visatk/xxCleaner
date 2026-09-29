import React from 'react';
import { CreditCard, Globe, Calendar, RefreshCw } from 'lucide-react';
import { Language } from '../types/card';
import { translations } from '../utils/translations';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  refMonth: number;
  refYear: number;
  onRefDateChange: (month: number, year: number) => void;
  onResetDate: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  refMonth,
  refYear,
  onRefDateChange,
  onResetDate,
}) => {
  const t = translations[language];

  const monthNames = [
    '01 - Jan', '02 - Feb', '03 - Mar', '04 - Apr',
    '05 - May', '06 - Jun', '07 - Jul', '08 - Aug',
    '09 - Sep', '10 - Oct', '11 - Nov', '12 - Dec',
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-inner">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
              {language === 'bn' ? 'কার্ড ক্লিনার প্রো' : 'Card Cleaner Pro'}
            </h1>
            <p className="text-[11px] text-slate-400 font-mono tracking-tight hidden sm:block">
              {language === 'bn' ? 'এক্সপায়ারড কার্ড রিমুভার' : 'Batch Expired Card Purger'}
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links / Anchor jump */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a href="#input-section" className="hover:text-white transition-colors">
            {language === 'bn' ? 'ইনপুট ডাটা' : 'Input'}
          </a>
          <a href="#table-section" className="hover:text-white transition-colors">
            {language === 'bn' ? 'কার্ড তালিকা' : 'Card Grid'}
          </a>
          <a href="#output-section" className="hover:text-white transition-colors">
            {language === 'bn' ? 'ক্লিনড আউটপুট' : 'Export'}
          </a>
        </nav>

        {/* Zone 3: Controls (Date Picker & Language Switcher) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Reference Date Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs">
            <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0 hidden sm:inline" />
            <span className="text-slate-400 font-medium hidden sm:inline">
              {language === 'bn' ? 'চেক তারিখ:' : 'Ref:'}
            </span>
            <select
              value={refMonth}
              onChange={(e) => onRefDateChange(Number(e.target.value), refYear)}
              className="bg-slate-900 text-white rounded px-1.5 py-0.5 border border-slate-700 font-mono text-xs focus:outline-none focus:border-indigo-500"
              aria-label="Reference Month"
            >
              {monthNames.map((name, i) => (
                <option key={i + 1} value={i + 1}>
                  {name}
                </option>
              ))}
            </select>
            <select
              value={refYear}
              onChange={(e) => onRefDateChange(refMonth, Number(e.target.value))}
              className="bg-slate-900 text-white rounded px-1.5 py-0.5 border border-slate-700 font-mono text-xs focus:outline-none focus:border-indigo-500"
              aria-label="Reference Year"
            >
              {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
            <button
              onClick={onResetDate}
              title={t.useCurrentDate}
              className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => onLanguageChange(language === 'bn' ? 'en' : 'bn')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
            title="Switch Language / ভাষা পরিবর্তন করুন"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'bn' ? 'বাংলা' : 'EN'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
