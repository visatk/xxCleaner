export type CardBrand =
  | 'visa'
  | 'mastercard'
  | 'amex'
  | 'discover'
  | 'jcb'
  | 'diners'
  | 'unionpay'
  | 'rupay'
  | 'maestro'
  | 'mir'
  | 'elo'
  | 'unknown';

export type CardStatus = 'valid' | 'expired' | 'expiring_soon' | 'invalid';

export type CardType = 'credit' | 'debit' | 'prepaid' | 'unknown';

export interface CardMetadata {
  amount?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  ip?: string;
  bankName?: string;
}

export interface CardRecord {
  id: string;
  rawLine: string;
  cleanLine: string;
  cardNumber: string;
  maskedNumber: string;
  formattedNumber: string; // Amex 4-6-5 or standard 4-4-4-4
  bin: string; // first 6 or 8 digits
  month: number | null;
  year: number | null;
  yearFull: number | null;
  cvv: string;
  brand: CardBrand;
  cardType: CardType;
  cardLevel: string;
  status: CardStatus;
  monthsDiff: number; // negative = expired, positive = future, 0 = this month
  expiryText: string;
  isLuhnValid: boolean | null;
  isLengthValid: boolean;
  expectedLength: number[];
  expectedCvvLength: number[];
  isCvvValid: boolean | null;
  validationErrors: string[];
  isDuplicate?: boolean;
  extraFields: string[];
  metadata: CardMetadata;
  selected?: boolean;
}

export type FilterStatus =
  | 'all'
  | 'valid'
  | 'expired'
  | 'expiring_soon'
  | 'invalid'
  | 'luhn_failed';

export type SortOption =
  | 'none'
  | 'expiry_asc'
  | 'expiry_desc'
  | 'brand_asc'
  | 'status_order'
  | 'bank_asc';

export type ExportFormat =
  | 'original'
  | 'standard_pipe'
  | 'pipe_short'
  | 'csv'
  | 'json'
  | 'cards_only'
  | 'sql'
  | 'custom';

export type Language = 'bn' | 'en';
