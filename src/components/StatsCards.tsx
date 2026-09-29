import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Layers,
  CreditCard,
  ShieldAlert,
} from 'lucide-react';
import { CardBrand, FilterStatus, Language } from '../types/card';
import { translations } from '../utils/translations';

interface StatsCardsProps {
  language: Language;
  totalCount: number;
  validCount: number;
  expiredCount: number;
  expiringCount: number;
  invalidCount: number;
  luhnFailedCount: number;
  brandCounts: Record<CardBrand, number>;
  activeFilter: FilterStatus;
  selectedBrandFilter: string;
  onSelectFilter: (filter: FilterStatus) => void;
  onSelectBrandFilter: (brand: string) => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  language,
  totalCount,
  validCount,
  expiredCount,
  expiringCount,
  invalidCount,
  luhnFailedCount,
  brandCounts,
  activeFilter,
  selectedBrandFilter,
  onSelectFilter,
  onSelectBrandFilter,
}) => {
  const t = translations[language];

  const cards = [
    {
      key: 'all' as FilterStatus,
      label: t.totalCards,
      count: totalCount,
      icon: Layers,
      color: 'text-slate-700 dark:text-slate-200',
      bgColor: 'bg-white dark:bg-slate-850',
      borderColor:
        activeFilter === 'all'
          ? 'border-indigo-500 ring-2 ring-indigo-500/20'
          : 'border-slate-200 dark:border-slate-750',
    },
    {
      key: 'valid' as FilterStatus,
      label: t.activeCards,
      count: validCount,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-white dark:bg-slate-850',
      borderColor:
        activeFilter === 'valid'
          ? 'border-emerald-500 ring-2 ring-emerald-500/20'
          : 'border-slate-200 dark:border-slate-750',
    },
    {
      key: 'expired' as FilterStatus,
      label: t.expiredCards,
      count: expiredCount,
      icon: XCircle,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-white dark:bg-slate-850',
      borderColor:
        activeFilter === 'expired'
          ? 'border-rose-500 ring-2 ring-rose-500/20'
          : 'border-slate-200 dark:border-slate-750',
    },
    {
      key: 'expiring_soon' as FilterStatus,
      label: t.expiringSoon,
      count: expiringCount,
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-white dark:bg-slate-850',
      borderColor:
        activeFilter === 'expiring_soon'
          ? 'border-amber-500 ring-2 ring-amber-500/20'
          : 'border-slate-200 dark:border-slate-750',
    },
    {
      key: 'invalid' as FilterStatus,
      label: t.invalidLines,
      count: invalidCount,
      subInfo: luhnFailedCount > 0 ? `${luhnFailedCount} Luhn fails` : undefined,
      icon: AlertTriangle,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-white dark:bg-slate-850',
      borderColor:
        activeFilter === 'invalid'
          ? 'border-purple-500 ring-2 ring-purple-500/20'
          : 'border-slate-200 dark:border-slate-750',
    },
  ];

  const brandPills: { brand: CardBrand; label: string; badge: string }[] = [
    { brand: 'amex', label: 'Amex', badge: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-300' },
    { brand: 'visa', label: 'Visa', badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300' },
    { brand: 'mastercard', label: 'Mastercard', badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300' },
    { brand: 'discover', label: 'Discover', badge: 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-300' },
  ];

  return (
    <div className="space-y-3">
      {/* 5 Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((item) => {
          const Icon = item.icon;
          const isSelected = activeFilter === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelectFilter(item.key)}
              className={`flex flex-col text-left p-3.5 rounded-xl border transition-all cursor-pointer ${item.bgColor} ${item.borderColor} hover:shadow-xs`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                  {item.label}
                </span>
                <Icon className={`w-4 h-4 ${item.color} shrink-0`} />
              </div>
              <div className="flex items-baseline justify-between mt-auto">
                <span
                  className={`text-2xl font-bold font-mono tabular-nums tracking-tight ${item.color}`}
                >
                  {item.count.toLocaleString()}
                </span>
                {totalCount > 0 && item.key !== 'all' && (
                  <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                    {Math.round((item.count / totalCount) * 100)}%
                  </span>
                )}
              </div>
              {item.subInfo && (
                <div className="mt-1 text-[10px] text-purple-600 dark:text-purple-400 font-mono font-medium flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  <span>{item.subInfo}</span>
                </div>
              )}
              {isSelected && (
                <div className="w-full mt-2 h-0.5 bg-indigo-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Brand Intelligence Bar */}
      {totalCount > 0 && (
        <div className="bg-white dark:bg-slate-850 p-3 rounded-xl border border-slate-200 dark:border-slate-750 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
            <CreditCard className="w-4 h-4 text-indigo-500" />
            <span>{t.brandDistributionTitle}:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => onSelectBrandFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedBrandFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {language === 'bn' ? 'সব ব্র্যান্ড' : 'All Brands'}
            </button>

            {brandPills.map((bp) => {
              const count = brandCounts[bp.brand] || 0;
              const isSelected = selectedBrandFilter === bp.brand;
              return (
                <button
                  key={bp.brand}
                  onClick={() => onSelectBrandFilter(isSelected ? 'all' : bp.brand)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
                    bp.badge
                  } ${
                    isSelected
                      ? 'ring-2 ring-indigo-500 scale-105 shadow-xs'
                      : 'opacity-85 hover:opacity-100'
                  }`}
                >
                  <span>{bp.label}</span>
                  <span className="font-mono tabular-nums px-1 rounded bg-black/10 dark:bg-white/10 text-[10px]">
                    {count}
                  </span>
                </button>
              );
            })}

            {/* Other brands count */}
            {brandCounts.unknown > 0 && (
              <span className="text-[11px] text-slate-400 font-mono pl-1">
                +{brandCounts.unknown} {language === 'bn' ? 'অন্যান্য' : 'other'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
