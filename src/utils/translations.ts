import { Language } from '../types/card';

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  loadDemo: string;
  clearAll: string;
  pasteClipboard: string;
  uploadFile: string;
  inputPlaceholder: string;
  inputHeading: string;
  totalCards: string;
  activeCards: string;
  expiredCards: string;
  expiringSoon: string;
  invalidLines: string;
  removeExpiredBtn: string;
  removeExpiredDesc: string;
  removeInvalidBtn: string;
  removeDuplicatesBtn: string;
  keepOnlyValidBtn: string;
  resetAllBtn: string;
  searchPlaceholder: string;
  filterAll: string;
  filterValid: string;
  filterExpired: string;
  filterExpiring: string;
  filterInvalid: string;
  filterAmexOnly: string;
  filterLuhnFailed: string;
  tableColCard: string;
  tableColExpiry: string;
  tableColCvv: string;
  tableColStatus: string;
  tableColDetails: string;
  tableColAction: string;
  exportHeading: string;
  exportFormat: string;
  copyOutput: string;
  copiedSuccess: string;
  downloadTxt: string;
  downloadCsv: string;
  refDateTitle: string;
  refMonth: string;
  refYear: string;
  useCurrentDate: string;
  cleanSummaryMsg: (removed: number, remaining: number) => string;
  noCardsFound: string;
  noMatchFilter: string;
  cardDetailsModalTitle: string;
  deleteSingleCard: string;
  keepSingleCard: string;
  maskToggle: string;
  splitMultiCards: string;
  splitMultiCardsDesc: string;
  brandDistributionTitle: string;
  binLookupTitle: string;
  cardTypeLabel: string;
  cardLevelLabel: string;
  bankNameLabel: string;
  amexDetectedNotice: string;
  lengthAlert: string;
  luhnAlert: string;
  cvvAlert: string;
  sortCountry: string;
  shuffleBtn: string;
  binFilterPlaceholder: string;
}

export const translations: Record<Language, Translations> = {
  bn: {
    appTitle: 'কার্ড ক্লিনার ও এক্সপায়ারড কার্ড রিমুভার',
    appSubtitle: 'আমেরিকান এক্সপ্রেস (Amex) সহ সব ধরণের কার্ড সনাক্তকরণ, এক্সপায়ারড ও অকার্যকর কার্ড মুছে ফেলার অ্যাডভান্সড টুল।',
    loadDemo: 'ইউজারের ডেমো ডাটা লোড করুন',
    clearAll: 'সব পরিষ্কার করুন',
    pasteClipboard: 'ক্লিপবোর্ড থেকে পেস্ট করুন',
    uploadFile: 'ফাইল আপলোড (.txt / .csv)',
    inputPlaceholder: `এখানে কার্ডের ডাটা পেস্ট করুন (যেমন: 4622390770098080|02|2026|865|... অথবা Amex 377481018765432|10|28|1234)
প্রতি লাইনে একটি কার্ড বা স্পেস দিয়ে একাধিক কার্ড পেস্ট করতে পারেন।`,
    inputHeading: 'কার্ড ইনপুট ও ব্যাচ প্রসেসিং',
    totalCards: 'মোট কার্ড',
    activeCards: 'কার্যকর (ভ্যালিড)',
    expiredCards: 'মেয়াদোত্তীর্ণ (এক্সপায়ারড)',
    expiringSoon: 'চলতি মাসে শেষ',
    invalidLines: 'অকার্যকর/ভুল কার্ড',
    removeExpiredBtn: 'সব এক্সপায়ারড কার্ড মুছুন',
    removeExpiredDesc: 'তালিকায় থাকা সমস্ত মেয়াদোত্তীর্ণ কার্ড এক ক্লিকে সম্পূর্ণ সরিয়ে দেবে।',
    removeInvalidBtn: 'ভুল ও অকার্যকর কার্ড মুছুন',
    removeDuplicatesBtn: 'ডুপ্লিকেট কার্ড সরান',
    keepOnlyValidBtn: 'শুধুমাত্র ভ্যালিড কার্ড রাখুন',
    resetAllBtn: 'পূর্বাবস্থায় ফিরুন (রিসেট)',
    searchPlaceholder: 'কার্ড নম্বর, ব্র্যান্ড (Amex, Visa, MC), BIN, দেশ বা ব্যাংক দিয়ে খুঁজুন...',
    filterAll: 'সব কার্ড',
    filterValid: 'কার্যকর (ভ্যালিড)',
    filterExpired: 'এক্সপায়ারড',
    filterExpiring: 'চলতি মাসে শেষ',
    filterInvalid: 'অকার্যকর/ভুল',
    filterAmexOnly: 'শুধু Amex কার্ড',
    filterLuhnFailed: 'লুন ফেইলড',
    tableColCard: 'কার্ড নম্বর ও ব্র্যান্ড',
    tableColExpiry: 'মেয়াদ (মাস/বছর)',
    tableColCvv: 'CVV',
    tableColStatus: 'স্ট্যাটাস ও ভ্যালিডেশন',
    tableColDetails: 'ব্যাংক, দেশ ও অতিরিক্ত তথ্য',
    tableColAction: 'অ্যাকশন',
    exportHeading: 'ক্লিন আউটপুট ও এক্সপোর্ট',
    exportFormat: 'আউটপুট ফরম্যাট:',
    copyOutput: 'ক্লিপবোর্ডে কপি করুন',
    copiedSuccess: 'সফলভাবে কপি হয়েছে!',
    downloadTxt: 'ডাউনলোড (.TXT)',
    downloadCsv: 'ডাউনলোড (.CSV)',
    refDateTitle: 'যাচাইয়ের তারিখ (Reference Date):',
    refMonth: 'মাস',
    refYear: 'বছর',
    useCurrentDate: 'আজকের তারিখ সেট করুন',
    cleanSummaryMsg: (removed, remaining) =>
      `🎉 চমৎকার! মোট ${removed}টি এক্সপায়ারড কার্ড মোছা হয়েছে। বর্তমানে ${remaining}টি সক্রিয় কার্ড রয়েছে।`,
    noCardsFound: 'কোনো কার্ড ইনপুট করা হয়নি। উপরে টেক্সট পেস্ট করুন অথবা "ডেমো ডাটা লোড করুন" বোতামে চাপুন।',
    noMatchFilter: 'এই ফিল্টারে কোনো কার্ড মেলেনি। ফিল্টার পরিবর্তন করে দেখুন।',
    cardDetailsModalTitle: 'কার্ডের বিস্তারিত অ্যালগরিদম বিশ্লেষণ',
    deleteSingleCard: 'মুছুন',
    keepSingleCard: 'রাখুন',
    maskToggle: 'নম্বর গোপন করুন / প্রদর্শন করুন',
    splitMultiCards: 'মাল্টিপল কার্ড অটো-স্প্লিট',
    splitMultiCardsDesc: 'একই লাইনে স্পেস বা পাইপ দিয়ে একাধিক কার্ড থাকলে স্বয়ংক্রিয়ভাবে আলাদা লাইনে ভেঙে নেবে।',
    brandDistributionTitle: 'ব্র্যান্ড বিতরণ ও পরিসংখ্যান',
    binLookupTitle: 'BIN ও ব্যাংক তথ্য',
    cardTypeLabel: 'কার্ডের ধরন',
    cardLevelLabel: 'টায়ার / লেভেল',
    bankNameLabel: 'ইস্যুকারী ব্যাংক',
    amexDetectedNotice: 'আমেরিকান এক্সপ্রেস (Amex) সনাক্ত হয়েছে — ১৫ ডিজিট ও ৪ ডিজিট CVV যাচাইকৃত',
    lengthAlert: 'ডিজিট দৈর্ঘ্যের ত্রুটি',
    luhnAlert: 'লুন অ্যালগরিদম ব্যর্থ',
    cvvAlert: 'CVV দৈর্ঘ্যের অসঙ্গতি',
    sortCountry: 'দেশ: A-Z',
    shuffleBtn: 'এলোমেলো করুন (Shuffle)',
    binFilterPlaceholder: 'BIN ফিল্টার (যেমন 4147)',
  },
  en: {
    appTitle: 'Card Cleaner & Expired Card Remover',
    appSubtitle: 'Advanced multi-brand validator with American Express (Amex) detection, Luhn mod-10 algorithm, and batch expired card purging.',
    loadDemo: "Load User's Demo Data",
    clearAll: 'Clear Input',
    pasteClipboard: 'Paste from Clipboard',
    uploadFile: 'Upload File (.txt / .csv)',
    inputPlaceholder: `Paste your raw card lines here (e.g. 4622390770098080|02|2026|865|... or Amex 377481018765432|10|28|1234)
Supports newline separated lines or multiple cards on a single line separated by spaces.`,
    inputHeading: 'Raw Card Data Input & Batch Engine',
    totalCards: 'Total Cards',
    activeCards: 'Active (Valid)',
    expiredCards: 'Expired Cards',
    expiringSoon: 'Expiring This Month',
    invalidLines: 'Invalid Cards',
    removeExpiredBtn: 'Remove Expired Cards',
    removeExpiredDesc: 'Instantly strip all expired card lines from the dataset.',
    removeInvalidBtn: 'Remove Invalid Cards',
    removeDuplicatesBtn: 'Remove Duplicates',
    keepOnlyValidBtn: 'Keep Only Active Cards',
    resetAllBtn: 'Reset to Original',
    searchPlaceholder: 'Search card number, brand (Amex, Visa, MC), BIN, bank, or country...',
    filterAll: 'All Cards',
    filterValid: 'Active (Valid)',
    filterExpired: 'Expired',
    filterExpiring: 'Expiring Soon',
    filterInvalid: 'Invalid',
    filterAmexOnly: 'Amex Only',
    filterLuhnFailed: 'Luhn Failed',
    tableColCard: 'Card Number & Brand',
    tableColExpiry: 'Expiry (MM/YYYY)',
    tableColCvv: 'CVV',
    tableColStatus: 'Status & Validation',
    tableColDetails: 'Issuer Bank, Country & Info',
    tableColAction: 'Action',
    exportHeading: 'Cleaned Output & Export',
    exportFormat: 'Export Format:',
    copyOutput: 'Copy to Clipboard',
    copiedSuccess: 'Copied to clipboard!',
    downloadTxt: 'Download (.TXT)',
    downloadCsv: 'Download (.CSV)',
    refDateTitle: 'Reference Date for Validation:',
    refMonth: 'Month',
    refYear: 'Year',
    useCurrentDate: 'Set to Current Date',
    cleanSummaryMsg: (removed, remaining) =>
      `🎉 Successfully purged ${removed} expired card(s). ${remaining} active card(s) remaining.`,
    noCardsFound: 'No cards loaded yet. Paste card lines above or click "Load Demo Data" to test.',
    noMatchFilter: 'No cards match the selected filter criteria.',
    cardDetailsModalTitle: 'Card Record Algorithm Analysis',
    deleteSingleCard: 'Delete',
    keepSingleCard: 'Keep',
    maskToggle: 'Mask / Unmask numbers',
    splitMultiCards: 'Auto-Split Multi-Card Lines',
    splitMultiCardsDesc: 'Automatically detects and separates multiple cards packed on the same line.',
    brandDistributionTitle: 'Brand Breakdown & Diagnostics',
    binLookupTitle: 'BIN & Bank Intelligence',
    cardTypeLabel: 'Card Type',
    cardLevelLabel: 'Tier / Level',
    bankNameLabel: 'Issuing Institution',
    amexDetectedNotice: 'American Express detected (15 digits, 4-digit CID/CVV validated)',
    lengthAlert: 'Digit Length Error',
    luhnAlert: 'Luhn Checksum Failed',
    cvvAlert: 'CVV Length Mismatch',
    sortCountry: 'Country: A-Z',
    shuffleBtn: 'Shuffle Cards',
    binFilterPlaceholder: 'BIN filter (e.g. 4147)',
  },
};
