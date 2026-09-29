import React, { useState, useMemo } from 'react';
import {
  Copy,
  Check,
  Trash2,
  Eye,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  MapPin,
  Mail,
  ShieldAlert,
  Building,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { CardBrand, CardRecord, Language } from '../types/card';
import { translations } from '../utils/translations';

interface CardTableProps {
  language: Language;
  cards: CardRecord[];
  isMasked: boolean;
  onDeleteCard: (id: string) => void;
  onViewCard: (card: CardRecord) => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onDeleteSelected: () => void;
  onLoadDemo: () => void;
}

export const CardTable: React.FC<CardTableProps> = ({
  language,
  cards,
  isMasked,
  onDeleteCard,
  onViewCard,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onDeleteSelected,
  onLoadDemo,
}) => {
  const t = translations[language];
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Reset to page 1 if cards change drastically
  const totalPages = Math.max(1, Math.ceil(cards.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedCards = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return cards.slice(start, start + pageSize);
  }, [cards, safePage, pageSize]);

  const handleCopyCard = (card: CardRecord) => {
    const text = card.cleanLine || card.rawLine;
    navigator.clipboard.writeText(text);
    setCopiedId(card.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getBrandBadge = (brand: CardBrand) => {
    switch (brand) {
      case 'amex':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-cyan-100 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-800 shadow-2xs">
            AMEX 15D
          </span>
        );
      case 'visa':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            VISA
          </span>
        );
      case 'mastercard':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            MC
          </span>
        );
      case 'discover':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
            DISC
          </span>
        );
      case 'jcb':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            JCB
          </span>
        );
      case 'diners':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            DINERS
          </span>
        );
      case 'unionpay':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800">
            UNIONPAY
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium tracking-wider bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {brand.toUpperCase()}
          </span>
        );
    }
  };

  const getStatusBadge = (card: CardRecord) => {
    if (card.status === 'invalid') {
      return (
        <div className="flex flex-col gap-0.5">
          <div className="inline-flex items-center gap-1 text-purple-700 dark:text-purple-400 text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{language === 'bn' ? 'অকার্যকর' : 'Invalid'}</span>
          </div>
          {card.validationErrors.length > 0 && (
            <span className="text-[10px] text-purple-600 dark:text-purple-400 truncate max-w-[140px] font-mono">
              {card.validationErrors[0]}
            </span>
          )}
        </div>
      );
    }

    if (card.status === 'expired') {
      return (
        <div className="flex flex-col gap-0.5">
          <div className="inline-flex items-center gap-1 text-rose-700 dark:text-rose-400 text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{language === 'bn' ? 'মেয়াদ শেষ' : 'Expired'}</span>
          </div>
          <span className="text-[10px] text-rose-600 dark:text-rose-400 font-mono">
            {card.expiryText.replace('Expired (', '').replace(')', '')}
          </span>
        </div>
      );
    }

    if (card.status === 'expiring_soon') {
      return (
        <div className="flex flex-col gap-0.5">
          <div className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 text-xs font-medium">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{language === 'bn' ? 'চলতি মাস' : 'Ending Soon'}</span>
          </div>
          <span className="text-[10px] text-amber-600/90 dark:text-amber-400 font-mono">
            {card.monthsDiff === 0 ? '0 months' : `${card.monthsDiff}m left`}
          </span>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-0.5">
        <div className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{language === 'bn' ? 'কার্যকর' : 'Active'}</span>
        </div>
        <span className="text-[10px] text-emerald-600/80 dark:text-emerald-500 font-mono">
          {card.expiryText.replace('Valid (', '').replace(')', '')}
        </span>
      </div>
    );
  };

  if (cards.length === 0) {
    return (
      <div
        id="table-section"
        className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-750 p-12 text-center shadow-xs"
      >
        <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
          <CreditCard className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {t.noCardsFound}
        </p>
        <div className="mt-4">
          <button
            onClick={onLoadDemo}
            className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            {t.loadDemo}
          </button>
        </div>
      </div>
    );
  }

  const allSelected =
    cards.length > 0 && cards.every((c) => selectedIds.has(c.id));

  return (
    <div
      id="table-section"
      className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-750 shadow-xs overflow-hidden"
    >
      {/* Table Header Controls */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-750 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={onToggleSelectAll}
              className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700"
            />
            <span>
              {language === 'bn' ? 'সব নির্বাচন করুন' : 'Select All'} ({cards.length})
            </span>
          </label>

          {selectedIds.size > 0 && (
            <button
              onClick={onDeleteSelected}
              className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-medium px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900"
            >
              <Trash2 className="w-3 h-3" />
              <span>
                {language === 'bn' ? 'নির্বাচিত মুছুন' : 'Delete Selected'} (
                {selectedIds.size})
              </span>
            </button>
          )}
        </div>

        {/* Page size and counter */}
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
          <div className="flex items-center gap-1.5">
            <span>{language === 'bn' ? 'প্রতি পেজ:' : 'Show:'}</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={500}>500</option>
            </select>
          </div>

          <span className="text-slate-300 dark:text-slate-700">|</span>

          <span>
            {(safePage - 1) * pageSize + 1}-
            {Math.min(safePage * pageSize, cards.length)} of {cards.length}
          </span>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-medium">
              <th className="py-2.5 px-3 w-10 text-center">#</th>
              <th className="py-2.5 px-3">{t.tableColCard}</th>
              <th className="py-2.5 px-3">{t.tableColExpiry}</th>
              <th className="py-2.5 px-3">{t.tableColCvv}</th>
              <th className="py-2.5 px-3">{t.tableColStatus}</th>
              <th className="py-2.5 px-3 hidden md:table-cell">
                {t.tableColDetails}
              </th>
              <th className="py-2.5 px-3 text-right">{t.tableColAction}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedCards.map((card) => {
              const isSelected = selectedIds.has(card.id);
              const isExpired = card.status === 'expired';
              const isInvalid = card.status === 'invalid';
              const isAmex = card.brand === 'amex';

              return (
                <tr
                  key={card.id}
                  className={`transition-colors group hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                    isSelected ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                  } ${isExpired ? 'bg-rose-50/25 dark:bg-rose-950/10' : ''} ${
                    isInvalid ? 'bg-purple-50/25 dark:bg-purple-950/10' : ''
                  }`}
                >
                  {/* Select Checkbox */}
                  <td className="py-2.5 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(card.id)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700"
                    />
                  </td>

                  {/* Card Number & Brand */}
                  <td className="py-2.5 px-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        {getBrandBadge(card.brand)}
                        <span
                          className={`font-mono text-xs font-semibold tabular-nums ${
                            isExpired
                              ? 'text-rose-900 dark:text-rose-200 line-through opacity-85'
                              : isInvalid
                              ? 'text-purple-900 dark:text-purple-200'
                              : 'text-slate-800 dark:text-slate-100'
                          }`}
                        >
                          {isMasked ? card.maskedNumber : card.formattedNumber}
                        </span>
                        <button
                          onClick={() => handleCopyCard(card)}
                          title="Copy card line"
                          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                        >
                          {copiedId === card.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Diagnostic tags */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                        {card.isDuplicate && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-mono font-medium">
                            DUPLICATE
                          </span>
                        )}
                        {card.isLuhnValid === false && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-mono font-medium">
                            <ShieldAlert className="w-2.5 h-2.5" />
                            LUHN FAIL
                          </span>
                        )}
                        {!card.isLengthValid && (
                          <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-mono font-medium">
                            {card.cardNumber.replace(/\D/g, '').length}D (EXP{' '}
                            {card.expectedLength.join('/')})
                          </span>
                        )}
                        {isAmex && (
                          <span className="text-[10px] text-cyan-700 dark:text-cyan-400 font-medium">
                            CID 4-digit
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Expiry MM/YYYY */}
                  <td className="py-2.5 px-3">
                    <span
                      className={`font-mono text-xs tabular-nums font-semibold ${
                        isExpired
                          ? 'text-rose-600 dark:text-rose-400'
                          : card.status === 'expiring_soon'
                          ? 'text-amber-600 dark:text-amber-400'
                          : isInvalid
                          ? 'text-purple-600 dark:text-purple-400'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {card.month ? String(card.month).padStart(2, '0') : '??'}/
                      {card.yearFull || '????'}
                    </span>
                  </td>

                  {/* CVV */}
                  <td className="py-2.5 px-3 font-mono text-xs tabular-nums text-slate-600 dark:text-slate-400">
                    <span
                      className={
                        card.isCvvValid === false
                          ? 'text-rose-600 font-bold'
                          : 'text-slate-700 dark:text-slate-300'
                      }
                    >
                      {card.cvv || '-'}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-2.5 px-3">{getStatusBadge(card)}</td>

                  {/* Details (Bank, Country, Email, City) */}
                  <td className="py-2.5 px-3 hidden md:table-cell text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col gap-0.5 max-w-xs">
                      {card.metadata.bankName && (
                        <div className="flex items-center gap-1 font-medium text-slate-800 dark:text-slate-200 truncate">
                          <Building className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">
                            {card.metadata.bankName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ({card.cardLevel})
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-[11px] truncate">
                        {card.metadata.country && (
                          <span className="inline-flex items-center gap-0.5 px-1 py-0.2 bg-slate-100 dark:bg-slate-800 rounded font-mono font-medium text-slate-700 dark:text-slate-300">
                            <MapPin className="w-2.5 h-2.5 text-slate-400" />
                            {card.metadata.country}
                          </span>
                        )}
                        {card.metadata.city && (
                          <span className="truncate">{card.metadata.city}</span>
                        )}
                        {card.metadata.email && (
                          <span className="inline-flex items-center gap-0.5 text-slate-400 truncate">
                            <Mail className="w-2.5 h-2.5 shrink-0" />
                            {card.metadata.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Row Actions */}
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewCard(card)}
                        title="View Full Details"
                        className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteCard(card.id)}
                        title={t.deleteSingleCard}
                        className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-750 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono">
            {language === 'bn' ? `পৃষ্ঠা ${safePage} এর ${totalPages}` : `Page ${safePage} of ${totalPages}`}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1 font-mono">
              {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                let pageNum = idx + 1;
                if (totalPages > 5 && safePage > 3) {
                  pageNum = safePage - 2 + idx;
                  if (pageNum > totalPages) pageNum = totalPages - (4 - idx);
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-2 py-0.5 rounded text-xs transition-colors ${
                      safePage === pageNum
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
