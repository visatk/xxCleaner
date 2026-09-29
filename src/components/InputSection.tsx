import React, { useRef, useState } from 'react';
import {
  FileText,
  Upload,
  ClipboardPaste,
  Trash2,
  Sparkles,
  Info,
  Wand2,
  CalendarCheck,
  PlusCircle,
} from 'lucide-react';
import { Language, CardBrand } from '../types/card';
import { translations } from '../utils/translations';
import { USER_EXACT_SAMPLE, EXTENDED_DEMO_SAMPLE } from '../utils/sampleData';

interface InputSectionProps {
  language: Language;
  inputText: string;
  onInputChange: (val: string) => void;
  onClear: () => void;
  onDeepExtract: () => void;
  onNormalizeYears: () => void;
  onAddTestCard: (brand: CardBrand) => void;
  lineCount: number;
  autoSplitMultiCards: boolean;
  onToggleAutoSplit: (val: boolean) => void;
  refMonth: number;
  refYear: number;
}

export const InputSection: React.FC<InputSectionProps> = ({
  language,
  inputText,
  onInputChange,
  onClear,
  onDeepExtract,
  onNormalizeYears,
  onAddTestCard,
  lineCount,
  autoSplitMultiCards,
  onToggleAutoSplit,
  refMonth,
  refYear,
}) => {
  const t = translations[language];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTestMenu, setShowTestMenu] = useState(false);

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onInputChange(text);
      }
    } catch {
      // Fallback
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onInputChange(content);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div
      id="input-section"
      className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-750 p-4 sm:p-6 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {t.inputHeading}
          </h2>
          <span className="text-xs font-mono tabular-nums text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
            {lineCount} {language === 'bn' ? 'টি লাইন' : 'lines'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Deep Extract from Messy Chat / HTML */}
          <button
            onClick={onDeepExtract}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800/60 shadow-2xs"
            title="Extract all card lines from messy text, HTML logs, or chat history"
          >
            <Wand2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>
              {language === 'bn'
                ? 'ডীপ এক্সট্র্যাক্ট (Deep Extract)'
                : 'Deep Extract'}
            </span>
          </button>

          {/* Normalize 2-digit years to 4-digit */}
          <button
            onClick={onNormalizeYears}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Convert all 2-digit years (28) to 4-digit (2028)"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {language === 'bn' ? 'বছর নরমালাইজ (YYYY)' : 'Normalize Years'}
            </span>
          </button>

          {/* Test Card Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowTestMenu(!showTestMenu)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg transition-colors border border-indigo-200 dark:border-indigo-800/40"
              title="Add sandbox test card"
            >
              <PlusCircle className="w-3.5 h-3.5 text-indigo-500" />
              <span>{language === 'bn' ? '+ টেস্ট কার্ড' : '+ Test Card'}</span>
            </button>

            {showTestMenu && (
              <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-30 text-xs animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    onAddTestCard('visa');
                    setShowTestMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium text-slate-700 dark:text-slate-200"
                >
                  Visa (16-digit)
                </button>
                <button
                  onClick={() => {
                    onAddTestCard('mastercard');
                    setShowTestMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium text-slate-700 dark:text-slate-200"
                >
                  Mastercard (16-digit)
                </button>
                <button
                  onClick={() => {
                    onAddTestCard('amex');
                    setShowTestMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium text-slate-700 dark:text-slate-200 text-cyan-700 dark:text-cyan-400"
                >
                  Amex (15-digit CID)
                </button>
                <button
                  onClick={() => {
                    onAddTestCard('discover');
                    setShowTestMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium text-slate-700 dark:text-slate-200"
                >
                  Discover (16-digit)
                </button>
              </div>
            )}
          </div>

          {/* Load User Exact Sample */}
          <button
            onClick={() => onInputChange(USER_EXACT_SAMPLE)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg transition-colors border border-indigo-200 dark:border-indigo-800/60"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>{t.loadDemo}</span>
          </button>

          {/* Load Extended Sample */}
          <button
            onClick={() => onInputChange(EXTENDED_DEMO_SAMPLE)}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            {language === 'bn' ? '১০টি কার্ডের ডেমো' : '10 Sample Cards'}
          </button>

          {/* Paste */}
          <button
            onClick={handlePasteClipboard}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title={t.pasteClipboard}
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.pasteClipboard}</span>
          </button>

          {/* Upload File */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.csv,.log,.html"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title={t.uploadFile}
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.uploadFile}</span>
          </button>

          {/* Clear */}
          {inputText && (
            <button
              onClick={onClear}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-lg transition-colors"
              title={t.clearAll}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clearAll}</span>
            </button>
          )}
        </div>
      </div>

      {/* Textarea */}
      <div className="mt-3 relative">
        <textarea
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={t.inputPlaceholder}
          rows={6}
          className="w-full p-3 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y leading-relaxed"
          spellCheck={false}
        />
      </div>

      {/* Helper Footer */}
      <div className="mt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-700 dark:text-slate-300 font-medium">
            <input
              type="checkbox"
              checked={autoSplitMultiCards}
              onChange={(e) => onToggleAutoSplit(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700"
            />
            <span>{t.splitMultiCards}</span>
          </label>
          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
            |
          </span>
          <span className="text-[11px] text-slate-500 hidden md:inline">
            {t.splitMultiCardsDesc}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
          <Info className="w-3 h-3 text-indigo-400" />
          <span>
            {language === 'bn'
              ? `রেফারেন্স তারিখ: ${String(refMonth).padStart(2, '0')}/${refYear}`
              : `Reference Date: ${String(refMonth).padStart(2, '0')}/${refYear}`}
          </span>
        </div>
      </div>
    </div>
  );
};
