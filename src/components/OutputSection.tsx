import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  FileCheck,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { CardRecord, ExportFormat, Language } from '../types/card';
import { translations } from '../utils/translations';
import { formatCardRecords } from '../utils/cardParser';

interface OutputSectionProps {
  language: Language;
  cleanedCards: CardRecord[];
  totalOriginalCount: number;
}

export const OutputSection: React.FC<OutputSectionProps> = ({
  language,
  cleanedCards,
  totalOriginalCount,
}) => {
  const t = translations[language];
  const [exportFormat, setExportFormat] = useState<ExportFormat>('original');
  const [customTemplate, setCustomTemplate] = useState<string>(
    '{card}|{mm}|{yyyy}|{cvv}'
  );
  const [copied, setCopied] = useState(false);

  const formattedOutput = formatCardRecords(
    cleanedCards,
    exportFormat,
    customTemplate
  );

  const handleCopy = () => {
    if (!formattedOutput) return;
    navigator.clipboard.writeText(formattedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (ext: 'txt' | 'csv' | 'json' | 'sql') => {
    if (!formattedOutput) return;
    let mime = 'text/plain;charset=utf-8;';
    if (ext === 'csv') mime = 'text/csv;charset=utf-8;';
    else if (ext === 'json') mime = 'application/json;charset=utf-8;';
    else if (ext === 'sql') mime = 'application/sql;charset=utf-8;';

    const blob = new Blob([formattedOutput], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cleaned_cards_${Date.now()}.${ext}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const purgedCount = Math.max(0, totalOriginalCount - cleanedCards.length);

  return (
    <div
      id="output-section"
      className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-750 p-4 sm:p-6 shadow-xs space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {t.exportHeading}
          </h2>
          <span className="text-xs font-mono tabular-nums text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md font-semibold">
            {cleanedCards.length}{' '}
            {language === 'bn' ? 'টি কার্যকর কার্ড' : 'clean cards'}
          </span>
          {purgedCount > 0 && (
            <span className="text-xs font-mono tabular-nums text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 px-2 py-0.5 rounded-md">
              -{purgedCount} {language === 'bn' ? 'অপসারিত' : 'removed'}
            </span>
          )}
        </div>

        {/* Format Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium hidden md:inline">
            {t.exportFormat}
          </span>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
            className="text-xs bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="original">
              {language === 'bn'
                ? 'মূল ফরম্যাট (Original Raw Lines)'
                : 'Original Raw Lines'}
            </option>
            <option value="standard_pipe">CARD|MM|YYYY|CVV</option>
            <option value="pipe_short">CARD|MM|YY|CVV</option>
            <option value="cards_only">
              {language === 'bn'
                ? 'শুধুমাত্র কার্ড নম্বর (Card Numbers Only)'
                : 'Card Numbers Only'}
            </option>
            <option value="custom">
              {language === 'bn' ? 'কাস্টম টেমপ্লেট ফরম্যাট' : 'Custom Template'}
            </option>
            <option value="csv">CSV (Comma Separated)</option>
            <option value="sql">SQL INSERT Statements</option>
            <option value="json">JSON Format</option>
          </select>
        </div>
      </div>

      {/* Custom Template Builder input if custom selected */}
      {exportFormat === 'custom' && (
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-750 space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
            <Sliders className="w-3.5 h-3.5 text-indigo-500" />
            <span>
              {language === 'bn'
                ? 'কাস্টম টেমপ্লেট প্যাটার্ন:'
                : 'Custom Template Pattern:'}
            </span>
          </div>
          <input
            type="text"
            value={customTemplate}
            onChange={(e) => setCustomTemplate(e.target.value)}
            placeholder="{card}|{mm}|{yyyy}|{cvv}"
            className="w-full px-3 py-1.5 font-mono text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 font-mono">
            <span>Tokens:</span>
            {['{card}', '{bin}', '{mm}', '{yyyy}', '{yy}', '{cvv}', '{brand}', '{bank}', '{country}'].map(
              (tok) => (
                <button
                  key={tok}
                  onClick={() => setCustomTemplate((prev) => prev + tok)}
                  className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 hover:bg-indigo-100 text-slate-700 dark:text-slate-300"
                >
                  {tok}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Output preview textarea */}
      <div className="relative">
        <textarea
          readOnly
          value={formattedOutput}
          placeholder={
            language === 'bn'
              ? 'কোনো কার্ড নেই...'
              : 'Cleaned output will appear here...'
          }
          rows={6}
          className="w-full p-3 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none resize-y leading-relaxed"
          spellCheck={false}
        />
      </div>

      {/* Output Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>
            {language === 'bn'
              ? 'ক্লিনড ডাটা সরাসরি যে কোনো ডাটাবেস বা স্প্রেডশীটে ব্যবহারযোগ্য।'
              : 'Cleaned output is ready to paste into any checker or spreadsheet.'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            disabled={!formattedOutput}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-white shadow-xs transition-all ${
              copied
                ? 'bg-emerald-600'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-98'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>{t.copiedSuccess}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{t.copyOutput}</span>
              </>
            )}
          </button>

          {/* Download TXT */}
          <button
            onClick={() => handleDownload('txt')}
            disabled={!formattedOutput}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={t.downloadTxt}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{t.downloadTxt}</span>
            <span className="sm:hidden">.TXT</span>
          </button>

          {/* Download CSV */}
          <button
            onClick={() => handleDownload('csv')}
            disabled={!formattedOutput}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={t.downloadCsv}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{t.downloadCsv}</span>
            <span className="sm:hidden">.CSV</span>
          </button>

          {/* Download JSON or SQL */}
          <button
            onClick={() =>
              handleDownload(exportFormat === 'sql' ? 'sql' : 'json')
            }
            disabled={!formattedOutput}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download JSON / SQL"
          >
            <Download className="w-4 h-4" />
            <span>{exportFormat === 'sql' ? '.SQL' : '.JSON'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
