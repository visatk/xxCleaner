import React from 'react';
import {
  X,
  CreditCard,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Mail,
  Phone,
  Globe,
  DollarSign,
  Copy,
  Check,
  Building,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { CardRecord, Language } from '../types/card';
import { translations } from '../utils/translations';

interface CardDetailModalProps {
  language: Language;
  card: CardRecord | null;
  onClose: () => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  language,
  card,
  onClose,
}) => {
  const t = translations[language];
  const [copied, setCopied] = React.useState(false);

  if (!card) return null;

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(card.rawLine);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isExpired = card.status === 'expired';
  const isInvalid = card.status === 'invalid';
  const isAmex = card.brand === 'amex';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-750 max-w-lg w-full shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t.cardDetailsModalTitle}
              </h3>
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                {card.brand.toUpperCase()} · BIN {card.bin} · {card.cardType.toUpperCase()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {/* Amex Alert Banner */}
          {isAmex && (
            <div className="p-3 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 rounded-xl text-cyan-900 dark:text-cyan-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">{t.amexDetectedNotice}</span>
                <span className="text-[11px] opacity-90">
                  Standard format: 4-6-5 digits · 4-digit CID security code on front.
                </span>
              </div>
            </div>
          )}

          {/* Validation Errors Box */}
          {card.validationErrors.length > 0 && (
            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl text-purple-900 dark:text-purple-200 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-purple-800 dark:text-purple-300">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>
                  {language === 'bn'
                    ? 'শনাক্তকৃত অসঙ্গতি / ত্রুটি:'
                    : 'Validation Issues Detected:'}
                </span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-purple-700 dark:text-purple-300">
                {card.validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Status banner */}
          <div
            className={`p-3 rounded-xl border flex items-center justify-between ${
              isExpired
                ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200'
                : isInvalid
                ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900 text-purple-800 dark:text-purple-200'
                : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="font-semibold">{card.expiryText}</span>
            </div>
            <span className="font-mono text-[11px]">
              Exp: {card.month ? String(card.month).padStart(2, '0') : '--'}/
              {card.yearFull || '----'}
            </span>
          </div>

          {/* Core Card Specs Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                {language === 'bn' ? 'কার্ড নম্বর' : 'Card Number'}
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100 block">
                {card.formattedNumber}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Length: {card.cardNumber.replace(/\D/g, '').length} digits (expected{' '}
                {card.expectedLength.join('/')})
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                CVV / CID
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100 block">
                {card.cvv || 'None'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {isAmex ? '4-digit CID' : '3-digit CVV2'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                {t.cardTypeLabel} / {t.cardLevelLabel}
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 block uppercase">
                {card.cardType} · {card.cardLevel}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                BIN: {card.bin}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                {language === 'bn' ? 'লুন অ্যালগরিদম' : 'Luhn Check'}
              </span>
              <div className="flex items-center gap-1 font-semibold">
                {card.isLuhnValid === true ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Passed Checksum</span>
                  </>
                ) : card.isLuhnValid === false ? (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    <span className="text-rose-600">Failed Checksum</span>
                  </>
                ) : (
                  <span className="text-slate-400">Masked (N/A)</span>
                )}
              </div>
            </div>
          </div>

          {/* Issuer details */}
          {card.metadata.bankName && (
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-500" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    {t.bankNameLabel}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {card.metadata.bankName}
                  </span>
                </div>
              </div>
              {card.metadata.country && (
                <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {card.metadata.country}
                </span>
              )}
            </div>
          )}

          {/* Extended Metadata if available */}
          {(card.metadata.addressLine1 ||
            card.metadata.city ||
            card.metadata.country ||
            card.metadata.email ||
            card.metadata.ip ||
            card.metadata.phone) && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                {language === 'bn' ? 'অতিরিক্ত তথ্য (Metadata)' : 'Extracted Metadata'}
              </span>

              <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {card.metadata.addressLine1 && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      {card.metadata.addressLine1}
                      {card.metadata.addressLine2
                        ? `, ${card.metadata.addressLine2}`
                        : ''}
                      {card.metadata.city ? `, ${card.metadata.city}` : ''}
                      {card.metadata.state ? `, ${card.metadata.state}` : ''}
                      {card.metadata.postalCode ? ` ${card.metadata.postalCode}` : ''}
                      {card.metadata.country ? ` (${card.metadata.country})` : ''}
                    </span>
                  </div>
                )}

                {card.metadata.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono">{card.metadata.email}</span>
                  </div>
                )}

                {card.metadata.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono">{card.metadata.phone}</span>
                  </div>
                )}

                {card.metadata.ip && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-slate-500">
                      IP: {card.metadata.ip}
                    </span>
                  </div>
                )}

                {card.metadata.amount && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Amount: {card.metadata.amount}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Raw Line Codebox */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                {language === 'bn' ? 'আসল লাইন (Raw Line)' : 'Raw Line'}
              </span>
              <button
                onClick={handleCopyRaw}
                className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-lg text-[11px] font-mono break-all whitespace-pre-wrap text-slate-700 dark:text-slate-300">
              {card.rawLine}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
