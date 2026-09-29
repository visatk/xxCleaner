import React from 'react';
import {
  Trash2,
  CheckCircle,
  Copy,
  Search,
  Eye,
  EyeOff,
  RotateCcw,
  ShieldAlert,
  CreditCard,
  ArrowUpDown,
  Shuffle,
  Globe,
} from 'lucide-react';
import { FilterStatus, Language, SortOption } from '../types/card';
import { translations } from '../utils/translations';

interface ActionToolbarProps {
  language: Language;
  expiredCount: number;
  invalidCount: number;
  duplicateCount: number;
  amexCount: number;
  luhnFailedCount: number;
  onRemoveExpired: () => void;
  onKeepOnlyValid: () => void;
  onRemoveInvalid: () => void;
  onRemoveDuplicates: () => void;
  onKeepOnlyAmex: () => void;
  onResetOriginal: () => void;
  canReset: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeFilter: FilterStatus;
  onFilterChange: (f: FilterStatus) => void;
  sortOption: SortOption;
  onSortChange: (s: SortOption) => void;
  isMasked: boolean;
  onToggleMask: () => void;
  onShuffle: () => void;
  binFilter: string;
  onBinFilterChange: (bin: string) => void;
  onEnrichBinData?: () => void;
  isEnriching?: boolean;
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({
  language,
  expiredCount,
  invalidCount,
  duplicateCount,
  amexCount,
  luhnFailedCount,
  onRemoveExpired,
  onKeepOnlyValid,
  onRemoveInvalid,
  onRemoveDuplicates,
  onKeepOnlyAmex,
  onResetOriginal,
  canReset,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  sortOption,
  onSortChange,
  isMasked,
  onToggleMask,
  onShuffle,
  binFilter,
  onBinFilterChange,
  onEnrichBinData,
  isEnriching
}) => {
  const t = translations[language];

  return (
    <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-750 p-4 sm:p-5 shadow-xs space-y-4">
      {/* Primary Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Core Purge Action */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onRemoveExpired}
            disabled={expiredCount === 0}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-white shadow-xs transition-all ${
              expiredCount > 0
                ? 'bg-rose-600 hover:bg-rose-700 active:scale-98 cursor-pointer ring-2 ring-rose-500/20'
                : 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60'
            }`}
            title={t.removeExpiredDesc}
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            <span>{t.removeExpiredBtn}</span>
            {expiredCount > 0 && (
              <span className="bg-rose-800/80 text-white font-mono text-xs px-1.5 py-0.5 rounded-md tabular-nums">
                {expiredCount}
              </span>
            )}
          </button>

          {/* Keep Only Valid */}
          <button
            onClick={onKeepOnlyValid}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800/60 transition-colors"
          >
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t.keepOnlyValidBtn}</span>
          </button>

          {/* Remove Invalid (Luhn, wrong length, bad month/year) */}
          {invalidCount > 0 && (
            <button
              onClick={onRemoveInvalid}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800/60 transition-colors"
              title={
                language === 'bn'
                  ? 'ভুল দৈর্ঘ্য, অবৈধ লুন বা তারিখের কার্ড মুছুন'
                  : 'Remove invalid checksum/length cards'
              }
            >
              <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
              <span>{t.removeInvalidBtn}</span>
              <span className="font-mono text-xs font-bold tabular-nums">
                ({invalidCount})
              </span>
            </button>
          )}

          {/* Keep Only Amex Quick Button */}
          {amexCount > 0 && (
            <button
              onClick={onKeepOnlyAmex}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-cyan-800 dark:text-cyan-200 bg-cyan-50 dark:bg-cyan-950/40 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 border border-cyan-200 dark:border-cyan-800/60 transition-colors"
              title="Filter to keep only American Express cards"
            >
              <CreditCard className="w-3.5 h-3.5 text-cyan-600" />
              <span>
                {language === 'bn' ? 'শুধু Amex রাখুন' : 'Keep Amex Only'}
              </span>
              <span className="font-mono text-xs font-bold tabular-nums">
                ({amexCount})
              </span>
            </button>
          )}

          {/* Remove Duplicates */}
          {duplicateCount > 0 && (
            <button
              onClick={onRemoveDuplicates}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800/60 transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.removeDuplicatesBtn}</span>
              <span className="font-mono text-xs font-bold tabular-nums">
                ({duplicateCount})
              </span>
            </button>
          )}

          {/* Enrich BIN Data */}
          {onEnrichBinData && (
            <button
              onClick={onEnrichBinData}
              disabled={isEnriching}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors border ${
                isEnriching
                  ? 'text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20 cursor-not-allowed border-indigo-100/50 dark:border-indigo-800/30'
                  : 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border-indigo-200 dark:border-indigo-800/60'
              }`}
              title="Fetch live BIN details (Bank, Country, Level) from binlist.net"
            >
              <Globe className={`w-3.5 h-3.5 ${isEnriching ? 'text-indigo-400 animate-spin' : 'text-indigo-600'}`} />
              <span>
                {isEnriching
                  ? (language === 'bn' ? 'তথ্য আনা হচ্ছে...' : 'Fetching...')
                  : (language === 'bn' ? 'লাইভ বিন তথ্য' : 'Live BIN Data')}
              </span>
            </button>
          )}

          {/* Reset button if edited */}
          {canReset && (
            <button
              onClick={onResetOriginal}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t.resetAllBtn}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.resetAllBtn}</span>
            </button>
          )}

          {/* Shuffle Cards */}
          <button
            onClick={onShuffle}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800/60 transition-colors"
            title={t.shuffleBtn}
          >
            <Shuffle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">{t.shuffleBtn}</span>
          </button>
        </div>

        {/* Mask Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleMask}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title={t.maskToggle}
          >
            {isMasked ? (
              <>
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>{language === 'bn' ? 'নম্বর দেখান' : 'Show Numbers'}</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                <span>{language === 'bn' ? 'নম্বর লুকান' : 'Mask Numbers'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Tabs, Sort Dropdown and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto max-w-full">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t.filterAll}
          </button>
          <button
            onClick={() => onFilterChange('valid')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeFilter === 'valid'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t.filterValid}
          </button>
          <button
            onClick={() => onFilterChange('expired')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeFilter === 'expired'
                ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t.filterExpired}
          </button>
          <button
            onClick={() => onFilterChange('expiring_soon')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeFilter === 'expiring_soon'
                ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t.filterExpiring}
          </button>
          <button
            onClick={() => onFilterChange('invalid')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeFilter === 'invalid'
                ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t.filterInvalid}
          </button>
          {luhnFailedCount > 0 && (
            <button
              onClick={() => onFilterChange('luhn_failed')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                activeFilter === 'luhn_failed'
                  ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {t.filterLuhnFailed} ({luhnFailedCount})
            </button>
          )}
        </div>

        {/* Sort & Search Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* BIN Filter */}
          <div className="relative">
            <input
              type="text"
              value={binFilter}
              onChange={(e) => onBinFilterChange(e.target.value.replace(/\D/g, ''))}
              placeholder={t.binFilterPlaceholder}
              className="w-28 md:w-36 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
              maxLength={8}
            />
            {binFilter && (
              <button
                onClick={() => onBinFilterChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sorter */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 px-2.5 py-1.5 rounded-xl text-xs shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none text-xs cursor-pointer"
            >
              <option value="none">
                {language === 'bn' ? 'সাজানো: ডিফল্ট' : 'Sort: Default'}
              </option>
              <option value="expiry_asc">
                {language === 'bn'
                  ? 'মেয়াদ: পুরানো আগে (Oldest)'
                  : 'Expiry: Oldest First'}
              </option>
              <option value="expiry_desc">
                {language === 'bn'
                  ? 'মেয়াদ: নতুন আগে (Newest)'
                  : 'Expiry: Newest First'}
              </option>
              <option value="brand_asc">
                {language === 'bn' ? 'ব্র্যান্ড: A-Z' : 'Brand: A-Z'}
              </option>
              <option value="bank_asc">
                {language === 'bn' ? 'ব্যাংক: A-Z' : 'Bank: A-Z'}
              </option>
              <option value="country_asc">
                {t.sortCountry}
              </option>
              <option value="status_order">
                {language === 'bn' ? 'স্ট্যাটাস অনুযায়ী' : 'By Status'}
              </option>
            </select>
          </div>

          {/* Live Search Input */}
          <div className="relative flex-1 md:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
