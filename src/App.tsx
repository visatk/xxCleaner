/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { saveParsingHistory } from './utils/firestore';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { InputSection } from './components/InputSection';
import { ActionToolbar } from './components/ActionToolbar';
import { CardTable } from './components/CardTable';
import { OutputSection } from './components/OutputSection';
import { CardDetailModal } from './components/CardDetailModal';
import {
  FilterStatus,
  Language,
  CardRecord,
  CardBrand,
  SortOption,
} from './types/card';
import {
  parseBulkCards,
  splitInputLines,
  deepExtractCardsFromMessyText,
  normalizeAllYearsTo4Digits,
  generateSandboxTestCard,
  sortCardRecords,
} from './utils/cardParser';
import { USER_EXACT_SAMPLE } from './utils/sampleData';
import { translations } from './utils/translations';
import { fetchBinDetails, BinlistResponse, mapSchemeToBrand } from './utils/binlistApi';
import { CheckCircle2, Shield, Zap, Sparkles, CreditCard } from 'lucide-react';

export default function App() {
  // Language state (default to Bengali as user requested in Bengali)
  const [language, setLanguage] = useState<Language>('bn');
  const t = translations[language];

  // Reference date state (defaults to current date Sep 2026)
  const [refMonth, setRefMonth] = useState<number>(9);
  const [refYear, setRefYear] = useState<number>(2026);

  // Raw input text state (preloaded with sample for immediate testing)
  const [inputText, setInputText] = useState<string>(USER_EXACT_SAMPLE);
  const [originalBackup, setOriginalBackup] = useState<string | null>(null);

  // Settings
  const [autoSplitMultiCards, setAutoSplitMultiCards] = useState<boolean>(true);
  const [isMasked, setIsMasked] = useState<boolean>(false);

  // Filters, Sorting & Selection
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<SortOption>('none');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [binFilter, setBinFilter] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modal inspection
  const [inspectedCard, setInspectedCard] = useState<CardRecord | null>(null);

  // Live BIN enrichment state
  const [liveBinData, setLiveBinData] = useState<Record<string, BinlistResponse>>({});
  const [isEnriching, setIsEnriching] = useState<boolean>(false);

  // Flash message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Defer heavy parsing for silky smooth 60fps typing
  const deferredInputText = React.useDeferredValue(inputText);
  const deferredSearchQuery = React.useDeferredValue(searchQuery);

  // Parse cards whenever deferred input text or reference date changes
  const allParsedCards = useMemo(() => {
    return parseBulkCards(deferredInputText, refYear, refMonth, autoSplitMultiCards);
  }, [deferredInputText, refYear, refMonth, autoSplitMultiCards]);

  // Statistics and Brand Breakdown
  const stats = useMemo(() => {
    let valid = 0;
    let expired = 0;
    let expiring = 0;
    let invalid = 0;
    let luhnFailed = 0;
    let amex = 0;

    const brandCounts: Record<CardBrand, number> = {
      visa: 0,
      mastercard: 0,
      amex: 0,
      discover: 0,
      jcb: 0,
      diners: 0,
      unionpay: 0,
      rupay: 0,
      maestro: 0,
      mir: 0,
      elo: 0,
      unknown: 0,
    };

    const binCounts: Record<string, number> = {};
    const countryCounts: Record<string, number> = {};
    const bankCounts: Record<string, number> = {};
    const levelCounts: Record<string, number> = {};

    const seenCards = new Set<string>();
    let duplicates = 0;

    for (const card of allParsedCards) {
      if (card.status === 'valid') valid++;
      else if (card.status === 'expired') expired++;
      else if (card.status === 'expiring_soon') expiring++;
      else if (card.status === 'invalid') invalid++;

      if (card.isLuhnValid === false) {
        luhnFailed++;
      }

      if (card.brand === 'amex') {
        amex++;
      }

      if (card.brand in brandCounts) {
        brandCounts[card.brand]++;
      } else {
        brandCounts.unknown++;
      }

      // Track Bins
      if (card.bin) {
        binCounts[card.bin] = (binCounts[card.bin] || 0) + 1;
      }

      // Track metadata (Country, Bank, Level)
      if (card.metadata.country) {
        countryCounts[card.metadata.country] = (countryCounts[card.metadata.country] || 0) + 1;
      }
      if (card.metadata.bankName) {
        bankCounts[card.metadata.bankName] = (bankCounts[card.metadata.bankName] || 0) + 1;
      }
      if (card.cardLevel && card.cardLevel !== 'UNKNOWN') {
        levelCounts[card.cardLevel] = (levelCounts[card.cardLevel] || 0) + 1;
      }

      if (card.cardNumber) {
        if (seenCards.has(card.cardNumber)) {
          duplicates++;
        } else {
          seenCards.add(card.cardNumber);
        }
      }
    }

    // Helper to get top N from a record
    const getTopN = (record: Record<string, number>, n: number) => {
      return Object.entries(record)
        .sort((a, b) => b[1] - a[1])
        .slice(0, n)
        .reduce((acc, [key, val]) => {
          acc[key] = val;
          return acc;
        }, {} as Record<string, number>);
    };

    return {
      total: allParsedCards.length,
      valid,
      expired,
      expiring,
      invalid,
      luhnFailed,
      duplicates,
      amex,
      brandCounts,
      topBins: getTopN(binCounts, 10), // Top 10 Bins
      countries: getTopN(countryCounts, 10),
      banks: getTopN(bankCounts, 10),
      levels: getTopN(levelCounts, 10),
    };
  }, [allParsedCards]);

  // Filtered and Sorted cards for table view
  const visibleCards = useMemo(() => {
    const q = deferredSearchQuery.trim().toLowerCase();
    
    const filtered = allParsedCards.filter((card) => {
      // BIN filter
      if (binFilter && !card.cardNumber.startsWith(binFilter)) {
        return false;
      }

      // Brand filter
      if (selectedBrandFilter !== 'all' && card.brand !== selectedBrandFilter) {
        return false;
      }

      // Status filter
      if (activeFilter === 'luhn_failed') {
        if (card.isLuhnValid !== false) return false;
      } else if (activeFilter !== 'all' && card.status !== activeFilter) {
        return false;
      }

      // Search query filter
      if (q) {
        const numMatch = card.cardNumber.toLowerCase().includes(q);
        const binMatch = card.bin.toLowerCase().includes(q);
        const brandMatch = card.brand.toLowerCase().includes(q);
        const bankMatch = card.metadata.bankName?.toLowerCase().includes(q);
        const levelMatch = card.cardLevel.toLowerCase().includes(q);
        const countryMatch = card.metadata.country?.toLowerCase().includes(q);
        const cityMatch = card.metadata.city?.toLowerCase().includes(q);
        const emailMatch = card.metadata.email?.toLowerCase().includes(q);
        const ipMatch = card.metadata.ip?.toLowerCase().includes(q);
        const rawMatch = card.rawLine.toLowerCase().includes(q);

        return (
          numMatch ||
          binMatch ||
          brandMatch ||
          bankMatch ||
          levelMatch ||
          countryMatch ||
          cityMatch ||
          emailMatch ||
          ipMatch ||
          rawMatch
        );
      }

      return true;
    });

    // Enrich with live BIN data if available
    const enriched = filtered.map(card => {
      if (!card.bin) return card;
      const liveData = liveBinData[card.bin] || liveBinData[card.bin.substring(0,6)];
      if (liveData) {
        return {
          ...card,
          metadata: {
            ...card.metadata,
            bankName: liveData.bank?.name || card.metadata.bankName,
            country: liveData.country?.alpha2 || card.metadata.country,
          },
          cardLevel: liveData.brand || card.cardLevel,
          brand: mapSchemeToBrand(liveData.scheme) || card.brand
        };
      }
      return card;
    });

    return sortCardRecords(enriched, sortOption);
  }, [allParsedCards, activeFilter, selectedBrandFilter, searchQuery, sortOption, binFilter, liveBinData]);

  // Output cards (clean list of active / non-expired and valid cards)
  const cleanedCards = useMemo(() => {
    const cleanList = allParsedCards.filter(
      (c) => c.status !== 'expired' && c.status !== 'invalid'
    );
    
    const enriched = cleanList.map(card => {
      if (!card.bin) return card;
      const liveData = liveBinData[card.bin] || liveBinData[card.bin.substring(0,6)];
      if (liveData) {
        return {
          ...card,
          metadata: {
            ...card.metadata,
            bankName: liveData.bank?.name || card.metadata.bankName,
            country: liveData.country?.alpha2 || card.metadata.country,
          },
          cardLevel: liveData.brand || card.cardLevel,
          brand: mapSchemeToBrand(liveData.scheme) || card.brand
        };
      }
      return card;
    });

    return sortCardRecords(enriched, sortOption);
  }, [allParsedCards, sortOption, liveBinData]);

  // Automatically save parsing history to Firestore (with a 3-second debounce to avoid spam)
  useEffect(() => {
    if (stats.total === 0) return;

    const timer = setTimeout(() => {
      saveParsingHistory({
        totalCards: stats.total,
        valid: stats.valid,
        expired: stats.expired,
        expiring: stats.expiring,
        invalid: stats.invalid,
        luhnFailed: stats.luhnFailed,
        duplicates: stats.duplicates,
        amex: stats.amex,
        brandCounts: stats.brandCounts,
        topBins: stats.topBins,
        countries: stats.countries,
        banks: stats.banks,
        levels: stats.levels,
        language
      }).catch(err => console.error('Error auto-saving history:', err));
    }, 3000);

    return () => clearTimeout(timer);
  }, [stats, language]);

  // Helper to trigger feedback toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Action: Deep Extract Cards from Messy Text / HTML
  const handleDeepExtract = () => {
    const extracted = deepExtractCardsFromMessyText(inputText);
    if (extracted.length === 0) {
      showToast(
        language === 'bn'
          ? 'টেক্সট থেকে কোনো কার্ড সনাক্ত করা যায়নি।'
          : 'No valid card patterns detected in text.'
      );
      return;
    }

    if (!originalBackup) setOriginalBackup(inputText);

    setInputText(extracted.join('\n'));
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#10B981', '#6366F1'],
    });

    showToast(
      language === 'bn'
        ? `✨ সফলভাবে ${extracted.length}টি কার্ড আলাদা করে পরিষ্কার করা হয়েছে!`
        : `✨ Successfully extracted ${extracted.length} clean card records!`
    );
  };

  // Action: Normalize all 2-digit years into 4-digit years
  const handleNormalizeYears = () => {
    if (allParsedCards.length === 0) return;
    if (!originalBackup) setOriginalBackup(inputText);

    const normalized = normalizeAllYearsTo4Digits(allParsedCards);
    setInputText(normalized);
    showToast(
      language === 'bn'
        ? 'সব ২-ডিজিট বছর (YY) সফলভাবে ৪-ডিজিট ফরম্যাটে (YYYY) রূপান্তর করা হয়েছে।'
        : 'All 2-digit years converted to 4-digit YYYY format.'
    );
  };

  // Action: Add Sandbox Test Card
  const handleAddTestCard = (brand: CardBrand) => {
    const testCard = generateSandboxTestCard(brand);
    setInputText((prev) => (prev.trim() ? `${prev.trim()}\n${testCard.fullString}` : testCard.fullString));
    showToast(
      language === 'bn'
        ? `টেস্ট ${brand.toUpperCase()} কার্ড যোগ করা হয়েছে (Luhn Passed)।`
        : `Added sandbox test ${brand.toUpperCase()} card with valid Luhn checksum.`
    );
  };

  // Action: Remove All Expired Cards
  const handleRemoveExpired = () => {
    if (stats.expired === 0) return;

    if (!originalBackup) {
      setOriginalBackup(inputText);
    }

    const survivingCards = allParsedCards.filter((c) => c.status !== 'expired');
    const newText = survivingCards.map((c) => c.rawLine).join('\n');
    setInputText(newText);
    setSelectedIds(new Set());

    // Celebrate with confetti
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10B981', '#6366F1', '#F59E0B'],
    });

    showToast(t.cleanSummaryMsg(stats.expired, survivingCards.length));
  };

  // Action: Keep Only Valid Cards
  const handleKeepOnlyValid = () => {
    if (!originalBackup) {
      setOriginalBackup(inputText);
    }

    const survivingCards = allParsedCards.filter((c) => c.status === 'valid');
    const newText = survivingCards.map((c) => c.rawLine).join('\n');
    setInputText(newText);
    setSelectedIds(new Set());

    const removed = allParsedCards.length - survivingCards.length;
    showToast(
      language === 'bn'
        ? `মোট ${removed}টি অকার্যকর/এক্সপায়ারড কার্ড বাদ দিয়ে শুধু ${survivingCards.length}টি ভ্যালিড কার্ড রাখা হয়েছে।`
        : `Filtered down to ${survivingCards.length} strictly valid cards (${removed} purged).`
    );
  };

  // Action: Keep Only Amex Cards
  const handleKeepOnlyAmex = () => {
    if (stats.amex === 0) return;
    if (!originalBackup) setOriginalBackup(inputText);

    const amexCards = allParsedCards.filter((c) => c.brand === 'amex');
    setInputText(amexCards.map((c) => c.rawLine).join('\n'));
    setSelectedBrandFilter('amex');
    showToast(
      language === 'bn'
        ? `তালিকায় শুধুমাত্র ${amexCards.length}টি আমেরিকান এক্সপ্রেস (Amex) কার্ড ফিল্টার করা হয়েছে।`
        : `Filtered dataset to keep only ${amexCards.length} American Express (Amex) cards.`
    );
  };

  // Action: Remove Duplicates
  const handleRemoveDuplicates = () => {
    if (!originalBackup) setOriginalBackup(inputText);

    const seen = new Set<string>();
    const uniqueCards: CardRecord[] = [];

    for (const card of allParsedCards) {
      if (!seen.has(card.cardNumber)) {
        seen.add(card.cardNumber);
        uniqueCards.push(card);
      }
    }

    const removedCount = allParsedCards.length - uniqueCards.length;
    setInputText(uniqueCards.map((c) => c.rawLine).join('\n'));
    showToast(
      language === 'bn'
        ? `${removedCount}টি ডুপ্লিকেট কার্ড সরানো হয়েছে।`
        : `Removed ${removedCount} duplicate cards.`
    );
  };

  // Action: Fetch Live BIN Details
  const handleEnrichVisibleBins = async () => {
    if (isEnriching) return;
    setIsEnriching(true);
    showToast(language === 'bn' ? 'লাইভ বিন তথ্য আনা হচ্ছে...' : 'Fetching live BIN data from binlist.net...');

    const uniqueBins = new Set<string>();
    visibleCards.forEach(c => {
      if (c.bin && c.bin.length >= 6) uniqueBins.add(c.bin);
    });

    const binsToFetch = Array.from(uniqueBins).filter(b => !liveBinData[b] && !liveBinData[b.substring(0,6)]);
    
    if (binsToFetch.length === 0) {
      showToast(language === 'bn' ? 'সব কার্ডের বিন তথ্য আগেই আনা হয়েছে।' : 'All visible cards already have cached BIN data.');
      setIsEnriching(false);
      return;
    }

    let fetched = 0;
    const newBinData = { ...liveBinData };

    for (const bin of binsToFetch) {
      const data = await fetchBinDetails(bin);
      if (data) {
        newBinData[bin] = data;
        // Progressively update so UI updates during fetch
        setLiveBinData({ ...newBinData });
      }
      fetched++;
      // Sleep slightly to respect rate limit (approx 1 req/sec)
      await new Promise(r => setTimeout(r, 1000));
    }

    showToast(language === 'bn' ? `বিন তথ্য আনা সম্পন্ন হয়েছে (${fetched} টি)।` : `Enrichment complete. Fetched data for ${fetched} unique BIN(s).`);
    setIsEnriching(false);
  };

  // Action: Remove Invalid Cards (corrupted length, failed checksum, bad date)
  const handleRemoveInvalid = () => {
    if (!originalBackup) setOriginalBackup(inputText);
    const validOnes = allParsedCards.filter((c) => c.status !== 'invalid');
    const removedCount = allParsedCards.length - validOnes.length;
    setInputText(validOnes.map((c) => c.rawLine).join('\n'));
    showToast(
      language === 'bn'
        ? `${removedCount}টি ভুল ফরম্যাট, অমিল দৈর্ঘ্য ও লুন ব্যর্থ কার্ড সরানো হয়েছে।`
        : `Removed ${removedCount} invalid checksum/format cards.`
    );
  };

  // Action: Reset to Original
  const handleResetOriginal = () => {
    if (originalBackup !== null) {
      setInputText(originalBackup);
      setOriginalBackup(null);
      setSelectedBrandFilter('all');
      setActiveFilter('all');
      setSortOption('none');
      showToast(language === 'bn' ? 'পূর্বাবস্থায় ফিরে এসেছে।' : 'Restored original input.');
    }
  };

  // Action: Shuffle Cards
  const handleShuffle = () => {
    if (!originalBackup) setOriginalBackup(inputText);
    const shuffled = [...allParsedCards].sort(() => Math.random() - 0.5);
    setInputText(shuffled.map((c) => c.rawLine).join('\n'));
    showToast(language === 'bn' ? 'কার্ডগুলি এলোমেলো (Shuffle) করা হয়েছে।' : 'Cards randomly shuffled.');
  };

  // Action: Delete Single Card
  const handleDeleteCard = (id: string) => {
    const updated = allParsedCards.filter((c) => c.id !== id);
    setInputText(updated.map((c) => c.rawLine).join('\n'));
  };

  // Action: Delete Selected Cards
  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    const updated = allParsedCards.filter((c) => !selectedIds.has(c.id));
    setInputText(updated.map((c) => c.rawLine).join('\n'));
    setSelectedIds(new Set());
    showToast(
      language === 'bn'
        ? `${selectedIds.size}টি নির্বাচিত কার্ড মুছে ফেলা হয়েছে।`
        : `Deleted ${selectedIds.size} selected cards.`
    );
  };

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Toggle select all
  const handleToggleSelectAll = () => {
    if (visibleCards.length === 0) return;
    const allSelected = visibleCards.every((c) => selectedIds.has(c.id));
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(visibleCards.map((c) => c.id)));
    }
  };

  // Reset reference date to current system date (Sep 2026)
  const handleResetDate = () => {
    setRefMonth(9);
    setRefYear(2026);
    showToast(
      language === 'bn'
        ? 'রেফারেন্স তারিখ বর্তমান সময়ে (০৯/২০২৬) রিসেট করা হয়েছে।'
        : 'Reference date set to current (09/2026).'
    );
  };

  const lineCount = useMemo(() => {
    return splitInputLines(inputText, autoSplitMultiCards).length;
  }, [inputText, autoSplitMultiCards]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Bar */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        refMonth={refMonth}
        refYear={refYear}
        onRefDateChange={(m, y) => {
          setRefMonth(m);
          setRefYear(y);
        }}
        onResetDate={handleResetDate}
      />

      {/* Main Content Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Banner with user-friendly intro & verification explanation */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-850 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xs border border-indigo-800/60 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium border border-indigo-500/30">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {language === 'bn'
                  ? 'স্মার্ট এক্সপায়ারড ও অকার্যকর কার্ড ক্লিনার'
                  : 'Smart Expired & Invalid Card Purger'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {t.appTitle}
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
              {t.appSubtitle}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-indigo-300/80 font-mono">
              <span className="flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                {language === 'bn'
                  ? 'আমেরিকান এক্সপ্রেস (Amex ১৫-ডিজিট) স্পেশাল সাপোর্ট'
                  : 'Amex 15-digit & 4-CID support'}
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                {language === 'bn'
                  ? 'লুন Mod-10 ও দৈর্ঘ্য অ্যালগরিদম'
                  : 'Luhn Mod-10 & length algorithms'}
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {language === 'bn'
                  ? 'এক ক্লিকে মেয়াদোত্তীর্ণ ও ভুল কার্ড অপসরণ'
                  : '1-Click Expired/Invalid Purge'}
              </span>
            </div>
          </div>
        </div>

        {/* Toast Alert Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs sm:text-sm flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white text-xs ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Statistics Metric Cards & Brand Intelligence Bar */}
        <StatsCards
          language={language}
          totalCount={stats.total}
          validCount={stats.valid}
          expiredCount={stats.expired}
          expiringCount={stats.expiring}
          invalidCount={stats.invalid}
          luhnFailedCount={stats.luhnFailed}
          brandCounts={stats.brandCounts}
          activeFilter={activeFilter}
          selectedBrandFilter={selectedBrandFilter}
          onSelectFilter={setActiveFilter}
          onSelectBrandFilter={setSelectedBrandFilter}
        />

        {/* Dual-Pane Workspace: Raw Input (Left) & Cleaned Output (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
          <InputSection
            language={language}
            inputText={inputText}
            onInputChange={setInputText}
            onClear={() => {
              setInputText('');
              setSelectedIds(new Set());
            }}
            onDeepExtract={handleDeepExtract}
            onNormalizeYears={handleNormalizeYears}
            onAddTestCard={handleAddTestCard}
            lineCount={lineCount}
            autoSplitMultiCards={autoSplitMultiCards}
            onToggleAutoSplit={setAutoSplitMultiCards}
            refMonth={refMonth}
            refYear={refYear}
          />

          <OutputSection
            language={language}
            cleanedCards={cleanedCards}
            totalOriginalCount={allParsedCards.length}
          />
        </div>

        {/* Action Toolbar */}
        <ActionToolbar
          language={language}
          expiredCount={stats.expired}
          invalidCount={stats.invalid}
          duplicateCount={stats.duplicates}
          amexCount={stats.amex}
          luhnFailedCount={stats.luhnFailed}
          onRemoveExpired={handleRemoveExpired}
          onKeepOnlyValid={handleKeepOnlyValid}
          onRemoveInvalid={handleRemoveInvalid}
          onRemoveDuplicates={handleRemoveDuplicates}
          onKeepOnlyAmex={handleKeepOnlyAmex}
          onResetOriginal={handleResetOriginal}
          canReset={originalBackup !== null}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          sortOption={sortOption}
          onSortChange={setSortOption}
          isMasked={isMasked}
          onToggleMask={() => setIsMasked(!isMasked)}
          onShuffle={handleShuffle}
          binFilter={binFilter}
          onBinFilterChange={setBinFilter}
          onEnrichBinData={handleEnrichVisibleBins}
          isEnriching={isEnriching}
        />

        {/* Interactive Cards Table */}
        <CardTable
          language={language}
          cards={visibleCards}
          isMasked={isMasked}
          onDeleteCard={handleDeleteCard}
          onViewCard={setInspectedCard}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onDeleteSelected={handleDeleteSelected}
          onLoadDemo={() => setInputText(USER_EXACT_SAMPLE)}
        />
      </main>

      {/* Modal for Card Inspection */}
      <CardDetailModal
        language={language}
        card={inspectedCard}
        onClose={() => setInspectedCard(null)}
      />

      {/* Footer */}
      <footer className="mt-16 py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            {language === 'bn'
              ? 'কার্ড ক্লিনার টুল — সম্পূর্ণ ক্লায়েন্ট সাইড এবং সুরক্ষিত লুন ও Amex ভ্যালিডেশন।'
              : 'Card Cleaner Utility — Client-side Luhn Mod-10 & Amex validation engine.'}
          </p>
          <div className="flex items-center gap-3 text-slate-400 font-mono">
            <span>v1.3.0</span>
            <span aria-hidden="true">·</span>
            <span>
              Ref: {String(refMonth).padStart(2, '0')}/{refYear}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
