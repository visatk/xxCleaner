import {
  CardBrand,
  CardMetadata,
  CardRecord,
  CardStatus,
  CardType,
  ExportFormat,
} from '../types/card';

// Known BIN database for common financial institutions and card tiers
const BIN_DATABASE: Record<
  string,
  { bank: string; type: CardType; level: string; country?: string }
> = {
  // Amex BINs
  '34': { bank: 'American Express', type: 'credit', level: 'Standard', country: 'US' },
  '37': { bank: 'American Express', type: 'credit', level: 'Platinum / Centurion', country: 'US' },
  '3701': { bank: 'American Express', type: 'credit', level: 'Gold Card', country: 'US' },
  '3743': { bank: 'American Express', type: 'credit', level: 'Corporate / Business', country: 'US' },
  '3764': { bank: 'American Express', type: 'credit', level: 'Green Card', country: 'US' },
  '3765': { bank: 'American Express', type: 'credit', level: 'Rewards', country: 'BR' },
  '3766': { bank: 'American Express', type: 'credit', level: 'Delta SkyMiles', country: 'US' },
  '3774': { bank: 'American Express', type: 'credit', level: 'Platinum', country: 'US' },
  '3776': { bank: 'American Express', type: 'credit', level: 'Corporate', country: 'US' },
  '3792': { bank: 'American Express', type: 'credit', level: 'Blue Cash Everyday', country: 'US' },
  '3793': { bank: 'American Express', type: 'credit', level: 'Everyday Preferred', country: 'US' },

  // Visa BINs
  '4000': { bank: 'Chase Bank', type: 'credit', level: 'Classic', country: 'US' },
  '4019': { bank: 'Capital One', type: 'credit', level: 'Platinum', country: 'US' },
  '4031': { bank: 'Bank of America', type: 'credit', level: 'Signature', country: 'US' },
  '4041': { bank: 'Wells Fargo', type: 'credit', level: 'Active Cash', country: 'US' },
  '4060': { bank: 'US Bank', type: 'credit', level: 'Visa Signature', country: 'US' },
  '4100': { bank: 'Barclays', type: 'credit', level: 'Rewards', country: 'UK' },
  '4117': { bank: 'Citibank', type: 'credit', level: 'Diamond Preferred', country: 'US' },
  '4147': { bank: 'Chase Bank', type: 'credit', level: 'Sapphire Preferred', country: 'US' },
  '4154': { bank: 'PNC Bank', type: 'credit', level: 'Cash Rewards', country: 'US' },
  '4169': { bank: 'BBVA Bancomer', type: 'credit', level: 'Gold', country: 'MX' },
  '4207': { bank: 'Wells Fargo', type: 'debit', level: 'Classic', country: 'US' },
  '4213': { bank: 'Santander', type: 'credit', level: 'Rewards', country: 'ES' },
  '4246': { bank: 'Bank of America', type: 'debit', level: 'Standard', country: 'US' },
  '4256': { bank: 'Navy Federal CU', type: 'credit', level: 'Cash Rewards', country: 'US' },
  '4258': { bank: 'Discover/Visa', type: 'credit', level: 'Rewards', country: 'US' },
  '4266': { bank: 'PKO Bank Polski', type: 'debit', level: 'Classic', country: 'PL' },
  '4268': { bank: 'Citibanamex', type: 'credit', level: 'Platinum', country: 'MX' },
  '4327': { bank: 'Capital One', type: 'credit', level: 'Quicksilver', country: 'US' },
  '4345': { bank: 'Banco de Chile', type: 'debit', level: 'Classic', country: 'CL' },
  '4347': { bank: 'Chase Bank', type: 'debit', level: 'Premier Plus', country: 'US' },
  '4351': { bank: 'Chase Bank', type: 'credit', level: 'Freedom Unlimited', country: 'US' },
  '4388': { bank: 'Wells Fargo', type: 'debit', level: 'Everyday Checking', country: 'US' },
  '4390': { bank: 'Fifth Third Bank', type: 'credit', level: 'Trio Rewards', country: 'US' },
  '4506': { bank: 'Bank Dhofar', type: 'credit', level: 'Gold', country: 'OM' },
  '4510': { bank: 'Royal Bank of Canada', type: 'credit', level: 'Visa Infinite', country: 'CA' },
  '4512': { bank: 'TD Bank', type: 'credit', level: 'Aeroplan Visa', country: 'CA' },
  '4513': { bank: 'Bank of America', type: 'credit', level: 'Travel Rewards', country: 'US' },
  '4519': { bank: 'Scotiabank', type: 'credit', level: 'Scene+ Visa', country: 'CA' },
  '4563': { bank: 'Banco Azteca', type: 'debit', level: 'Standard', country: 'MX' },
  '4589': { bank: 'Banco Azteca', type: 'credit', level: 'Gold', country: 'MX' },
  '4610': { bank: 'Chase Bank', type: 'credit', level: 'Slate Edge', country: 'US' },
  '4622': { bank: 'ANZ Bank', type: 'credit', level: 'Frequent Flyer Platinum', country: 'AU' },
  '4750': { bank: 'Chase Bank', type: 'credit', level: 'Amazon Prime Rewards', country: 'US' },
  '4782': { bank: 'CaixaBank', type: 'credit', level: 'Visa Classic', country: 'ES' },
  '4833': { bank: 'Capital One', type: 'credit', level: 'Venture Rewards', country: 'US' },

  // Mastercard BINs
  '5111': { bank: 'Citibank', type: 'credit', level: 'Double Cash', country: 'US' },
  '5118': { bank: 'Scotiabank', type: 'debit', level: 'Standard', country: 'PE' },
  '5121': { bank: 'BMO Harris', type: 'credit', level: 'Platinum', country: 'US' },
  '5143': { bank: 'The Bancorp Bank', type: 'debit', level: 'Enhanced Mastercard', country: 'US' },
  '5154': { bank: 'Wells Fargo', type: 'debit', level: 'Platinum Debit', country: 'US' },
  '5163': { bank: 'Commonwealth Bank', type: 'credit', level: 'Ultimate Awards', country: 'AU' },
  '5167': { bank: 'Swedbank', type: 'debit', level: 'Standard', country: 'EE' },
  '5175': { bank: 'Huntington Bank', type: 'credit', level: 'Voice Credit', country: 'US' },
  '5184': { bank: 'Santander', type: 'credit', level: 'Mastercard 123', country: 'ES' },
  '5187': { bank: 'Erste Bank', type: 'credit', level: 'Gold', country: 'AT' },
  '5194': { bank: 'Chase Bank', type: 'credit', level: 'Mastercard World', country: 'US' },
  '5195': { bank: 'Bank Austria', type: 'credit', level: 'World Mastercard', country: 'AT' },
  '5218': { bank: 'Activ Bank', type: 'credit', level: 'Platinum', country: 'TJ' },
  '5267': { bank: 'BBVA Bancomer', type: 'credit', level: 'Platinum', country: 'MX' },
  '5275': { bank: 'Discover / MC', type: 'credit', level: 'Gold', country: 'US' },
  '5279': { bank: 'Mitsubishi UFJ', type: 'credit', level: 'MUFG Card Gold', country: 'JP' },
  '5306': { bank: 'Bancolombia', type: 'credit', level: 'Black', country: 'CO' },
  '5374': { bank: 'Activ Bank', type: 'debit', level: 'World Debit Embossed', country: 'TJ' },
  '5416': { bank: 'CIBC', type: 'credit', level: 'Aventura Gold', country: 'CA' },
  '5424': { bank: 'Banorte', type: 'credit', level: 'Mastercard Black', country: 'MX' },
  '5451': { bank: 'Chase Bank', type: 'credit', level: 'Mastercard Platinum', country: 'US' },
  '5462': { bank: 'Citibank', type: 'credit', level: 'Custom Cash', country: 'US' },
  '5463': { bank: 'Desjardins', type: 'credit', level: 'Cashback World', country: 'CA' },
  '5510': { bank: 'National Bank of Canada', type: 'credit', level: 'World Elite', country: 'CA' },
  '5518': { bank: 'State Bank of India', type: 'credit', level: 'SBI Card Elite', country: 'IN' },
  '5524': { bank: 'Santander', type: 'credit', level: 'Fiesta Rewards', country: 'MX' },
  '5532': { bank: 'HSBC', type: 'credit', level: 'Premier World Elite', country: 'MX' },
  '5538': { bank: 'BBVA', type: 'credit', level: 'Mastercard Gold', country: 'ES' },
  '5547': { bank: 'Banregio', type: 'credit', level: 'Platinum', country: 'MX' },
  '5579': { bank: 'Inbursa', type: 'credit', level: 'Interjet Platinum', country: 'MX' },
  '5598': { bank: 'Bangkok Bank', type: 'debit', level: 'Unembossed Debit', country: 'TH' },

  // Discover BINs
  '6011': { bank: 'Discover Bank', type: 'credit', level: 'Discover it Cash Back', country: 'US' },
  '6221': { bank: 'Discover / China UnionPay', type: 'credit', level: 'Standard', country: 'US' },
  '6440': { bank: 'Discover Bank', type: 'credit', level: 'Discover it Miles', country: 'US' },
  '6500': { bank: 'Discover Bank', type: 'credit', level: 'Discover it Chrome', country: 'US' },

  // UnionPay & RuPay & JCB
  '6258': { bank: 'China UnionPay', type: 'credit', level: 'UnionPay Diamond', country: 'CN' },
  '6259': { bank: 'China UnionPay', type: 'credit', level: 'UnionPay Platinum', country: 'CN' },
  '3528': { bank: 'JCB International', type: 'credit', level: 'JCB Standard', country: 'JP' },
  '3563': { bank: 'JCB International', type: 'credit', level: 'JCB Gold', country: 'JP' },
  '6062': { bank: 'Hipercard Banco', type: 'credit', level: 'Hipercard Clássico', country: 'BR' },
};

/**
 * Validates Luhn checksum for card numbers without 'x' masks.
 */
export function checkLuhn(cardNumber: string): boolean | null {
  const sanitized = cardNumber.replace(/[\s-]/g, '');
  if (/[^\d]/.test(sanitized)) return null; // Contains 'x' or non-digits, cannot run strict Luhn
  if (sanitized.length < 12 || sanitized.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

/**
 * Detects card brand from the card number / BIN with precision.
 */
export function detectBrand(cardNumber: string): CardBrand {
  const clean = cardNumber.replace(/[\s-]/g, '');

  // American Express: starts with 34 or 37
  if (/^3[47]/.test(clean)) return 'amex';

  // Visa: starts with 4
  if (/^4/.test(clean)) return 'visa';

  // Mastercard: 51-55 or 2221-2720
  if (/^(5[1-5]|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)/.test(clean)) {
    return 'mastercard';
  }

  // Discover: 6011, 622126-622925, 644-649, 65
  if (/^(6011|65|64[4-9]|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[01][0-9]|92[0-5]))/.test(clean)) {
    return 'discover';
  }

  // JCB: 3528-3589
  if (/^35(2[89]|[3-8][0-9])/.test(clean)) return 'jcb';

  // Diners Club: 300-305, 36, 38
  if (/^3(0[0-5]|[68])/.test(clean)) return 'diners';

  // UnionPay: 62
  if (/^62/.test(clean)) return 'unionpay';

  // RuPay: 60, 6521, 6522, 508
  if (/^(60|6521|6522|508)/.test(clean)) return 'rupay';

  // Maestro: 5018, 5020, 5038, 5893, 6304, 6759, 6761, 6762, 6763
  if (/^(5018|5020|5038|5893|6304|6759|676[1-3])/.test(clean)) return 'maestro';

  // Mir: 2200-2204
  if (/^220[0-4]/.test(clean)) return 'mir';

  // Elo: Brazil
  if (/^(4011|4312|4389|4514|4576|5041|5066|5090|6277|6362|6363)/.test(clean)) return 'elo';

  return 'unknown';
}

/**
 * Returns expected card length rules for brand.
 */
export function getBrandLengthRules(brand: CardBrand): {
  cardLengths: number[];
  cvvLengths: number[];
} {
  switch (brand) {
    case 'amex':
      return { cardLengths: [15], cvvLengths: [4] };
    case 'visa':
      return { cardLengths: [13, 16, 19], cvvLengths: [3] };
    case 'mastercard':
      return { cardLengths: [16], cvvLengths: [3] };
    case 'discover':
      return { cardLengths: [16, 19], cvvLengths: [3] };
    case 'diners':
      return { cardLengths: [14, 16], cvvLengths: [3] };
    case 'jcb':
      return { cardLengths: [16, 17, 18, 19], cvvLengths: [3] };
    case 'unionpay':
      return { cardLengths: [16, 17, 18, 19], cvvLengths: [3] };
    case 'rupay':
      return { cardLengths: [16], cvvLengths: [3] };
    case 'maestro':
      return { cardLengths: [12, 13, 14, 15, 16, 17, 18, 19], cvvLengths: [3] };
    default:
      return { cardLengths: [15, 16, 17, 18, 19], cvvLengths: [3, 4] };
  }
}

/**
 * Formats card number for display (Amex 4-6-5, standard 4-4-4-4).
 */
export function formatCardDisplay(cardNumber: string, brand: CardBrand): string {
  const clean = cardNumber.replace(/[\s-]/g, '');
  if (brand === 'amex') {
    // Amex 4-6-5: 3774 810187 65432
    if (clean.length === 15) {
      return `${clean.slice(0, 4)} ${clean.slice(4, 10)} ${clean.slice(10)}`;
    }
  }
  // Standard 4-4-4-4
  return clean.replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Masks card number for display (e.g. 4622 39•• •••• 8080 or Amex 3774 •••••• 65432)
 */
export function maskCardNumber(cardNumber: string, brand: CardBrand = 'unknown'): string {
  const clean = cardNumber.replace(/[\s-]/g, '');
  if (clean.length < 12) return cardNumber;

  if (brand === 'amex' && clean.length === 15) {
    const first4 = clean.slice(0, 4);
    const last5 = clean.slice(-5);
    return `${first4} •••••• ${last5}`;
  }

  const first6 = clean.slice(0, 6);
  const last4 = clean.slice(-4);
  const middleLen = Math.max(0, clean.length - 10);
  const maskedMiddle = '•'.repeat(middleLen);
  const combined = first6 + maskedMiddle + last4;
  return combined.replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Normalizes year to 4 digits (e.g. 26 -> 2026, 2028 -> 2028).
 */
export function normalizeYear(yearStr: string | number): number | null {
  if (!yearStr) return null;
  const num = typeof yearStr === 'number' ? yearStr : parseInt(yearStr.trim(), 10);
  if (isNaN(num)) return null;

  if (num < 100) {
    return 2000 + num;
  }
  if (num >= 1990 && num <= 2100) {
    return num;
  }
  return null;
}

/**
 * Normalizes month to 1-12.
 */
export function normalizeMonth(monthStr: string | number): number | null {
  if (!monthStr) return null;
  if (typeof monthStr === 'number') {
    return monthStr >= 1 && monthStr <= 12 ? monthStr : null;
  }

  const str = monthStr.trim().toLowerCase();
  const num = parseInt(str, 10);
  if (!isNaN(num) && num >= 1 && num <= 12) {
    return num;
  }

  const monthMap: Record<string, number> = {
    jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
    jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
  };
  for (const [key, val] of Object.entries(monthMap)) {
    if (str.startsWith(key)) return val;
  }

  return null;
}

/**
 * Resolves BIN / Issuer information from internal database.
 */
export function lookupBinDetails(cardNumber: string): {
  bin: string;
  bank: string;
  type: CardType;
  level: string;
  country?: string;
} {
  const clean = cardNumber.replace(/[\s-]/g, '');
  const bin6 = clean.slice(0, 6);
  const bin4 = clean.slice(0, 4);
  const bin2 = clean.slice(0, 2);

  // Check 6-digit match, then 4-digit, then 2-digit
  const match =
    BIN_DATABASE[bin6] ||
    BIN_DATABASE[bin4] ||
    BIN_DATABASE[bin2];

  if (match) {
    return {
      bin: clean.length >= 6 ? bin6 : clean,
      bank: match.bank,
      type: match.type,
      level: match.level,
      country: match.country,
    };
  }

  const brand = detectBrand(cardNumber);
  const defaultBank = brand === 'amex' ? 'American Express' : 'Unknown Issuer';

  return {
    bin: clean.length >= 6 ? bin6 : clean,
    bank: defaultBank,
    type: 'credit',
    level: 'Standard',
  };
}

/**
 * Evaluates expiration relative to reference date.
 */
export function evaluateExpiry(
  month: number | null,
  yearFull: number | null,
  refYear: number,
  refMonth: number
): { status: CardStatus; monthsDiff: number; expiryText: string } {
  if (!month || !yearFull) {
    return {
      status: 'invalid',
      monthsDiff: 0,
      expiryText: 'Invalid Date',
    };
  }

  const totalCardMonths = yearFull * 12 + month;
  const totalRefMonths = refYear * 12 + refMonth;
  const diff = totalCardMonths - totalRefMonths;

  if (diff < 0) {
    const absDiff = Math.abs(diff);
    const years = Math.floor(absDiff / 12);
    const months = absDiff % 12;
    let timeStr = '';
    if (years > 0 && months > 0) {
      timeStr = `${years}y ${months}m ago`;
    } else if (years > 0) {
      timeStr = `${years} year${years > 1 ? 's' : ''} ago`;
    } else {
      timeStr = `${months} month${months > 1 ? 's' : ''} ago`;
    }

    return {
      status: 'expired',
      monthsDiff: diff,
      expiryText: `Expired (${timeStr})`,
    };
  }

  if (diff === 0) {
    return {
      status: 'expiring_soon',
      monthsDiff: 0,
      expiryText: 'Expiring this month',
    };
  }

  if (diff <= 2) {
    return {
      status: 'expiring_soon',
      monthsDiff: diff,
      expiryText: `Expiring soon (${diff}m left)`,
    };
  }

  const years = Math.floor(diff / 12);
  const months = diff % 12;
  let timeStr = '';
  if (years > 0 && months > 0) {
    timeStr = `${years}y ${months}m left`;
  } else if (years > 0) {
    timeStr = `${years} year${years > 1 ? 's' : ''} left`;
  } else {
    timeStr = `${months} months left`;
  }

  return {
    status: 'valid',
    monthsDiff: diff,
    expiryText: `Valid (${timeStr})`,
  };
}

/**
 * Splits raw input into individual lines.
 */
export function splitInputLines(rawText: string, autoSplit: boolean = true): string[] {
  if (!rawText.trim()) return [];

  let textToProcess = rawText;
  if (autoSplit) {
    const verticalRegex = /(?:(?:CARD|CC|BIN)?[\s:=]*)(\d{13,19})[\s\r\n]+(?:(?:EXP|DATE|VALID)?[\s:=]*)(0?[1-9]|1[0-2])\s*[/|-]\s*(\d{2,4})[\s\r\n]+(?:(?:CVV|CVC|CID|CCV)?[\s:=]*)(\d{3,4})\b/gi;
    textToProcess = textToProcess.replace(verticalRegex, '$1|$2|$3|$4');
  }

  const rawLines = textToProcess.split(/\r?\n/);
  const resultLines: string[] = [];

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (autoSplit && /\s{2,}(?=\d{13,19}[|/])/.test(trimmed)) {
      const parts = trimmed.split(/\s{2,}(?=\d{13,19}[|/])/);
      for (const part of parts) {
        if (part.trim()) resultLines.push(part.trim());
      }
    } else {
      resultLines.push(trimmed);
    }
  }

  return resultLines;
}

/**
 * Extracts metadata from parsed extra fields.
 */
export function extractMetadata(fields: string[]): CardMetadata {
  const metadata: CardMetadata = {};
  if (fields.length === 0) return metadata;

  if (fields.length >= 7) {
    metadata.amount = fields[0] || undefined;
    metadata.addressLine1 = fields[1] || undefined;
    metadata.addressLine2 = fields[2] || undefined;
    metadata.city = fields[3] || undefined;
    metadata.state = fields[4] || undefined;
    metadata.country = fields[5] || undefined;
    metadata.postalCode = fields[6] || undefined;
    metadata.phone = fields[7] || undefined;
    metadata.email = fields[8] || undefined;
    metadata.ip = fields[9] || undefined;
    return metadata;
  }

  for (const field of fields) {
    const val = field.trim().replace(/^"|"$/g, '');
    if (!val) continue;

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      metadata.email = val;
    } else if (
      /^(?:\d{1,3}\.){3}\d{1,3}$|^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/.test(
        val
      )
    ) {
      metadata.ip = val;
    } else if (/^[A-Z]{2}$/.test(val) && !metadata.country) {
      metadata.country = val;
    } else if (
      /^\+?[0-9\s-]{8,18}$/.test(val) &&
      !metadata.phone &&
      !/^\d{4,6}$/.test(val)
    ) {
      metadata.phone = val;
    } else if (
      /^\d{4,6}$|^[A-Z0-9]{3}\s?[A-Z0-9]{3}$/.test(val) &&
      !metadata.postalCode
    ) {
      metadata.postalCode = val;
    }
  }

  return metadata;
}

/**
 * Parses a single line into a CardRecord with deep verification algorithms.
 */
export function parseCardLine(
  rawLine: string,
  refYear: number = 2026,
  refMonth: number = 9
): CardRecord {
  const cleanLine = rawLine.trim();
  const id = `card_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;

  let sanitized = cleanLine.replace(
    /^(?:CC|BIN|B!N|B4N|B3N|CARD|Tarjeta|\.gen)[\s:=]+/i,
    ''
  );

  let parts: string[] = [];
  if (sanitized.includes('|')) {
    parts = sanitized.split('|');
  } else if (sanitized.includes(';') && !sanitized.includes('&')) {
    parts = sanitized.split(';');
  } else if (sanitized.includes('/') && !sanitized.includes('//') && sanitized.split('/').length > 2) {
    parts = sanitized.split('/');
  } else if (sanitized.includes(':')) {
    parts = sanitized.split(':');
  } else if (sanitized.includes(' ') || sanitized.includes('\t')) {
    parts = sanitized.split(/[\s\t]+/);
  } else {
    parts = [sanitized];
  }

  parts = parts.map((p) => p.trim());

  let cardNumber = parts[0] ? parts[0].replace(/[\s-]/g, '') : '';
  let monthStr = parts[1] || '';
  let yearStr = parts[2] || '';
  let cvv = parts[3] || '';
  let extraFieldsStartIdx = 4;

  if (monthStr.includes('/') || monthStr.includes('-')) {
    const slashParts = monthStr.split(/[/-]/);
    monthStr = slashParts[0];
    yearStr = slashParts[1];
    cvv = parts[2] || '';
    extraFieldsStartIdx = 3;
  }

  if (!cardNumber && sanitized.length > 0) {
    cardNumber = sanitized;
  }

  const brand = detectBrand(cardNumber);
  const { cardLengths, cvvLengths } = getBrandLengthRules(brand);

  const month = normalizeMonth(monthStr);
  const yearFull = normalizeYear(yearStr);
  const isLuhnValid = checkLuhn(cardNumber);
  const maskedNumber = maskCardNumber(cardNumber, brand);
  const formattedNumber = formatCardDisplay(cardNumber, brand);

  const binInfo = lookupBinDetails(cardNumber);

  // Diagnostic validations
  const validationErrors: string[] = [];

  const rawDigitsOnly = cardNumber.replace(/\D/g, '');
  const hasMaskDigits = /[xX•*]/.test(cardNumber);

  // Length check
  const isLengthValid = cardLengths.includes(rawDigitsOnly.length);
  if (!isLengthValid && !hasMaskDigits && rawDigitsOnly.length > 0) {
    if (brand === 'amex') {
      validationErrors.push('Amex cards must have exactly 15 digits');
    } else {
      validationErrors.push(
        `Invalid card length (${rawDigitsOnly.length} digits, expected ${cardLengths.join(' or ')})`
      );
    }
  }

  // Luhn check
  if (isLuhnValid === false) {
    validationErrors.push('Failed Luhn mod-10 checksum validation');
  }

  // Month check
  if (monthStr && (month === null || month < 1 || month > 12)) {
    validationErrors.push(`Invalid month '${monthStr}' (must be 01-12)`);
  }

  // Year check
  if (yearStr && yearFull === null) {
    validationErrors.push(`Invalid year '${yearStr}'`);
  }

  // CVV check
  let isCvvValid: boolean | null = null;
  const cleanCvv = cvv.replace(/\D/g, '');
  if (cleanCvv.length > 0) {
    isCvvValid = cvvLengths.includes(cleanCvv.length);
    if (!isCvvValid) {
      if (brand === 'amex') {
        validationErrors.push(
          `Amex CVV must be 4 digits (found ${cleanCvv.length})`
        );
      } else {
        validationErrors.push(
          `Expected ${cvvLengths.join('/')}-digit CVV (found ${cleanCvv.length})`
        );
      }
    }
  }

  const { status: expiryStatus, monthsDiff, expiryText } = evaluateExpiry(
    month,
    yearFull,
    refYear,
    refMonth
  );

  let finalStatus: CardStatus = expiryStatus;
  if (
    validationErrors.length > 0 &&
    (isLuhnValid === false || !isLengthValid || month === null || yearFull === null)
  ) {
    // If card has fatal syntax or checksum or length corruption, mark as invalid
    finalStatus = 'invalid';
  }

  const extraFields = parts.slice(extraFieldsStartIdx);
  const metadata = extractMetadata(extraFields);
  if (!metadata.country && binInfo.country) {
    metadata.country = binInfo.country;
  }
  metadata.bankName = binInfo.bank;

  return {
    id,
    rawLine,
    cleanLine,
    cardNumber,
    maskedNumber,
    formattedNumber,
    bin: binInfo.bin,
    month,
    year: yearStr ? parseInt(yearStr, 10) : null,
    yearFull,
    cvv,
    brand,
    cardType: binInfo.type,
    cardLevel: binInfo.level,
    status: finalStatus,
    monthsDiff,
    expiryText,
    isLuhnValid,
    isLengthValid,
    expectedLength: cardLengths,
    expectedCvvLength: cvvLengths,
    isCvvValid,
    validationErrors,
    extraFields,
    metadata,
  };
}

/**
 * Parses full raw text into an array of CardRecords.
 */
export function parseBulkCards(
  rawText: string,
  refYear: number = 2026,
  refMonth: number = 9,
  autoSplit: boolean = true
): CardRecord[] {
  const lines = splitInputLines(rawText, autoSplit);
  const records = lines.map((line) => parseCardLine(line, refYear, refMonth));

  // Flag duplicate card numbers
  const cardCounts = new Map<string, number>();
  for (const r of records) {
    if (r.cardNumber) {
      cardCounts.set(r.cardNumber, (cardCounts.get(r.cardNumber) || 0) + 1);
    }
  }

  for (const r of records) {
    if (r.cardNumber && (cardCounts.get(r.cardNumber) || 0) > 1) {
      r.isDuplicate = true;
      if (!r.validationErrors.includes('Duplicate card number detected')) {
        r.validationErrors.push('Duplicate card number detected in dataset');
      }
    }
  }

  return records;
}

/**
 * Deep extractor that extracts card strings from messy HTML, chat exports, or unstructured text.
 */
export function deepExtractCardsFromMessyText(rawText: string): string[] {
  if (!rawText.trim()) return [];

  // 1. Strip HTML tags if HTML is detected
  let text = rawText
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<[^>]+>/g, ' ');

  // 2. Decode HTML entities
  text = text
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');

  const verticalRegex = /(?:(?:CARD|CC|BIN)?[\s:=]*)(\d{13,19})[\s\r\n]+(?:(?:EXP|DATE|VALID)?[\s:=]*)(0?[1-9]|1[0-2])\s*[/|-]\s*(\d{2,4})[\s\r\n]+(?:(?:CVV|CVC|CID|CCV)?[\s:=]*)(\d{3,4})\b/gi;
  text = text.replace(verticalRegex, '$1|$2|$3|$4');

  // 3. Match card patterns:
  // Card number (13-19 digits or with 'xxxx' mask) | Month (1-12) | Year (2-4 digits) | optional CVV | optional extra pipe fields
  const cardRegex =
    /(?:(?:CC|BIN|B!N|B4N|B3N|Card|\.gen)[\s:=]*)?((?:4[0-9]{12,18}|5[1-5][0-9]{14}|2[2-7][0-9]{14}|3[47][0-9]{13}|6[0-9]{15}|[0-9]{13,19}|[0-9]{6,12}[xX]{2,8})[|/](?:0?[1-9]|1[0-2])[|/](?:20[2-3][0-9]|[2-3][0-9])(?:[|/][0-9a-zA-Z]{3,4})?(?:\|[^\r\n]*?)?)(?=\s|$|<|"|'|\))/g;

  const matches = text.match(cardRegex) || [];
  const extractedLines: string[] = [];
  const seen = new Set<string>();

  for (const match of matches) {
    let clean = match.trim();
    // Strip leading prefix labels
    clean = clean.replace(/^(?:CC|BIN|B!N|B4N|B3N|Card|\.gen)[\s:=]*/i, '');
    clean = clean.replace(/^[|/\s]+|[|/\s]+$/g, '');

    if (clean && clean.length >= 15 && !seen.has(clean)) {
      seen.add(clean);
      extractedLines.push(clean);
    }
  }

  // Fallback: If regex didn't catch anything, return normal splitInputLines
  if (extractedLines.length === 0) {
    return splitInputLines(rawText);
  }

  return extractedLines;
}

/**
 * Normalizes all 2-digit years in card records into 4-digit years (e.g. 26 -> 2026).
 */
export function normalizeAllYearsTo4Digits(records: CardRecord[]): string {
  return records
    .map((r) => {
      if (!r.month || !r.yearFull) return r.rawLine;
      const m = String(r.month).padStart(2, '0');
      const y = String(r.yearFull);
      const c = r.cvv || '000';

      if (r.extraFields.length > 0) {
        return `${r.cardNumber}|${m}|${y}|${c}|${r.extraFields.join('|')}`;
      }
      return `${r.cardNumber}|${m}|${y}|${c}`;
    })
    .join('\n');
}

/**
 * Generates a valid Luhn sandbox test card for developer & QA checkout verification.
 */
export function generateSandboxTestCard(brand: CardBrand = 'visa'): {
  cardNumber: string;
  month: string;
  year: string;
  cvv: string;
  brand: CardBrand;
  fullString: string;
} {
  let prefix = '453200';
  let targetLen = 16;
  let cvv = '123';

  if (brand === 'amex') {
    prefix = '378282';
    targetLen = 15;
    cvv = '1234';
  } else if (brand === 'mastercard') {
    prefix = '542500';
    targetLen = 16;
    cvv = '456';
  } else if (brand === 'discover') {
    prefix = '601100';
    targetLen = 16;
    cvv = '789';
  }

  // Generate middle digits
  let partial = prefix;
  while (partial.length < targetLen - 1) {
    partial += Math.floor(Math.random() * 10).toString();
  }

  // Compute Luhn check digit
  let sum = 0;
  let shouldDouble = true;
  for (let i = partial.length - 1; i >= 0; i--) {
    let digit = parseInt(partial.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  const cardNumber = partial + checkDigit.toString();

  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const year = String(2028 + Math.floor(Math.random() * 4));
  const fullString = `${cardNumber}|${month}|${year}|${cvv}`;

  return {
    cardNumber,
    month,
    year,
    cvv,
    brand,
    fullString,
  };
}

/**
 * Formats a list of CardRecords into a formatted string based on export type.
 */
export function formatCardRecords(
  records: CardRecord[],
  format: ExportFormat,
  customTemplate: string = '{card}|{mm}|{yyyy}|{cvv}'
): string {
  if (records.length === 0) return '';

  switch (format) {
    case 'original':
      return records.map((r) => r.rawLine).join('\n');

    case 'standard_pipe':
      return records
        .map((r) => {
          const m = r.month ? String(r.month).padStart(2, '0') : '00';
          const y = r.yearFull ? String(r.yearFull) : '0000';
          const c = r.cvv || '000';
          return `${r.cardNumber}|${m}|${y}|${c}`;
        })
        .join('\n');

    case 'pipe_short':
      return records
        .map((r) => {
          const m = r.month ? String(r.month).padStart(2, '0') : '00';
          const y = r.yearFull ? String(r.yearFull).slice(-2) : '00';
          const c = r.cvv || '000';
          return `${r.cardNumber}|${m}|${y}|${c}`;
        })
        .join('\n');

    case 'cards_only':
      return records.map((r) => r.cardNumber).join('\n');

    case 'sql': {
      const inserts = records.map((r) => {
        const m = r.month ? String(r.month).padStart(2, '0') : '01';
        const y = r.yearFull ? String(r.yearFull) : '2028';
        const c = r.cvv || '000';
        const bank = (r.metadata.bankName || 'Unknown').replace(/'/g, "''");
        const country = (r.metadata.country || 'US').replace(/'/g, "''");
        return `INSERT INTO test_cards (card_number, exp_month, exp_year, cvv, brand, bank, country, status) VALUES ('${r.cardNumber}', '${m}', '${y}', '${c}', '${r.brand}', '${bank}', '${country}', '${r.status}');`;
      });
      return inserts.join('\n');
    }

    case 'custom': {
      return records
        .map((r) => {
          const m = r.month ? String(r.month).padStart(2, '0') : '00';
          const y4 = r.yearFull ? String(r.yearFull) : '0000';
          const y2 = r.yearFull ? String(r.yearFull).slice(-2) : '00';
          const c = r.cvv || '000';

          return customTemplate
            .replace(/\{card\}/gi, r.cardNumber)
            .replace(/\{bin\}/gi, r.bin)
            .replace(/\{mm\}/gi, m)
            .replace(/\{month\}/gi, m)
            .replace(/\{yyyy\}/gi, y4)
            .replace(/\{year\}/gi, y4)
            .replace(/\{yy\}/gi, y2)
            .replace(/\{cvv\}/gi, c)
            .replace(/\{brand\}/gi, r.brand)
            .replace(/\{bank\}/gi, r.metadata.bankName || '')
            .replace(/\{country\}/gi, r.metadata.country || '')
            .replace(/\{email\}/gi, r.metadata.email || '')
            .replace(/\{ip\}/gi, r.metadata.ip || '');
        })
        .join('\n');
    }

    case 'csv': {
      const headers = [
        'Card Number',
        'BIN',
        'Brand',
        'Type',
        'Level',
        'Bank',
        'Month',
        'Year',
        'CVV',
        'Status',
        'Luhn Valid',
        'Length Valid',
        'Errors',
        'Country',
        'Email',
        'Full Line',
      ];
      const rows = records.map((r) => {
        const m = r.month ? String(r.month).padStart(2, '0') : '';
        const y = r.yearFull ? String(r.yearFull) : '';
        return [
          `"${r.cardNumber}"`,
          `"${r.bin}"`,
          `"${r.brand.toUpperCase()}"`,
          `"${r.cardType.toUpperCase()}"`,
          `"${r.cardLevel}"`,
          `"${r.metadata.bankName || ''}"`,
          `"${m}"`,
          `"${y}"`,
          `"${r.cvv}"`,
          `"${r.status}"`,
          `"${r.isLuhnValid === null ? 'N/A' : r.isLuhnValid ? 'YES' : 'NO'}"`,
          `"${r.isLengthValid ? 'YES' : 'NO'}"`,
          `"${r.validationErrors.join('; ')}"`,
          `"${r.metadata.country || ''}"`,
          `"${r.metadata.email || ''}"`,
          `"${r.rawLine.replace(/"/g, '""')}"`,
        ].join(',');
      });
      return [headers.join(','), ...rows].join('\n');
    }

    case 'json':
      return JSON.stringify(
        records.map((r) => ({
          cardNumber: r.cardNumber,
          bin: r.bin,
          brand: r.brand,
          cardType: r.cardType,
          cardLevel: r.cardLevel,
          bank: r.metadata.bankName,
          month: r.month,
          year: r.yearFull,
          cvv: r.cvv,
          status: r.status,
          expiryInfo: r.expiryText,
          isLuhnValid: r.isLuhnValid,
          isLengthValid: r.isLengthValid,
          validationErrors: r.validationErrors,
          metadata: r.metadata,
          rawLine: r.rawLine,
        })),
        null,
        2
      );

    default:
      return records.map((r) => r.rawLine).join('\n');
  }
}

/**
 * Sorts card records based on selected criteria.
 */
export function sortCardRecords(
  records: CardRecord[],
  sortOption: import('../types/card').SortOption
): CardRecord[] {
  const clone = [...records];
  switch (sortOption) {
    case 'expiry_asc':
      return clone.sort((a, b) => a.monthsDiff - b.monthsDiff);

    case 'expiry_desc':
      return clone.sort((a, b) => b.monthsDiff - a.monthsDiff);

    case 'brand_asc':
      return clone.sort((a, b) => a.brand.localeCompare(b.brand));

    case 'bank_asc': {
      return clone.sort((a, b) =>
        (a.metadata.bankName || 'Z').localeCompare(b.metadata.bankName || 'Z')
      );
    }

    case 'country_asc': {
      return clone.sort((a, b) =>
        (a.metadata.country || 'ZZ').localeCompare(b.metadata.country || 'ZZ')
      );
    }

    case 'status_order': {
      const order = { invalid: 0, expired: 1, expiring_soon: 2, valid: 3 };
      return clone.sort((a, b) => (order[a.status] || 9) - (order[b.status] || 9));
    }

    default:
      return clone;
  }
}

