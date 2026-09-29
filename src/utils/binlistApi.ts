import { CardBrand, CardType } from '../types/card';

// Types for the binlist.net API response
export interface BinlistResponse {
  number: {
    length: number;
    luhn: boolean;
  };
  scheme: string;
  type: string;
  brand: string;
  prepaid: boolean;
  country: {
    numeric: string;
    alpha2: string;
    name: string;
    emoji: string;
    currency: string;
    latitude: number;
    longitude: number;
  };
  bank: {
    name: string;
    url: string;
    phone: string;
    city: string;
  };
}

// Simple in-memory cache to prevent redundant API calls
const binCache = new Map<string, BinlistResponse | null>();

/**
 * Fetches BIN data from the public binlist.net API.
 * Uses a local cache to avoid rate limits (429 Too Many Requests).
 */
export async function fetchBinDetails(bin: string): Promise<BinlistResponse | null> {
  const cleanBin = bin.replace(/\D/g, '').substring(0, 8); // Binlist uses 6 or 8 digits
  if (cleanBin.length < 6) return null;

  if (binCache.has(cleanBin)) {
    return binCache.get(cleanBin) || null;
  }
  
  // Also check 6-digit prefix if we asked for 8
  if (cleanBin.length === 8) {
      const prefix6 = cleanBin.substring(0, 6);
      if (binCache.has(prefix6)) {
          return binCache.get(prefix6) || null;
      }
  }

  try {
    const response = await fetch(`https://lookup.binlist.net/${cleanBin}`, {
      headers: {
        'Accept-Version': '3'
      }
    });

    if (response.status === 429) {
      console.warn('Binlist API rate limit exceeded (429). Try again later.');
      return null;
    }

    if (!response.ok) {
      binCache.set(cleanBin, null); // Cache failures to avoid spamming bad BINs
      return null;
    }

    const data: BinlistResponse = await response.json();
    binCache.set(cleanBin, data);
    return data;
  } catch (error) {
    console.error(`Error fetching BIN ${cleanBin} from binlist.net:`, error);
    return null; // Don't cache network errors, might be temporary
  }
}

/**
 * Maps the Binlist API scheme string to our internal CardBrand enum.
 */
export function mapSchemeToBrand(scheme: string): CardBrand {
  if (!scheme) return 'unknown';
  const lower = scheme.toLowerCase();
  
  if (lower.includes('visa')) return 'visa';
  if (lower.includes('mastercard')) return 'mastercard';
  if (lower.includes('amex') || lower.includes('american express')) return 'amex';
  if (lower.includes('discover')) return 'discover';
  if (lower.includes('diners')) return 'diners';
  if (lower.includes('jcb')) return 'jcb';
  if (lower.includes('unionpay')) return 'unionpay';
  if (lower.includes('rupay')) return 'rupay';
  if (lower.includes('maestro')) return 'maestro';
  if (lower.includes('mir')) return 'mir';
  if (lower.includes('elo')) return 'elo';
  
  return 'unknown';
}
