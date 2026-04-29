// Currency conversion utility with real-time rates
export const JPY_TO_MYR_RATE = 0.030; // Fallback rate

let cachedRates: { [key: string]: number } | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export const fetchExchangeRates = async (): Promise<{ [key: string]: number }> => {
  const now = Date.now();
  if (cachedRates && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedRates;
  }

  try {
    // Using exchangerate-api.com (free tier, no API key required)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/JPY');
    const data = await response.json();

    // Get MYR rate from JPY base
    const myrRate = data.rates.MYR;
    cachedRates = { MYR: myrRate };
    lastFetchTime = now;

    return cachedRates;
  } catch (error) {
    console.warn('Failed to fetch exchange rates, using fallback:', error);
    return { MYR: JPY_TO_MYR_RATE };
  }
};

export const convertJPYtoMYR = async (amount: number): Promise<number> => {
  const rates = await fetchExchangeRates();
  return amount * rates.MYR;
};

export const convertMYRtoJPY = async (amount: number): Promise<number> => {
  const rates = await fetchExchangeRates();
  return amount / rates.MYR;
};

// Synchronous versions for immediate use (uses cached or fallback)
export const convertJPYtoMYRSync = (amount: number): number => {
  if (cachedRates) {
    return amount * cachedRates.MYR;
  }
  return amount * JPY_TO_MYR_RATE;
};

export const convertMYRtoJPYSync = (amount: number): number => {
  if (cachedRates) {
    return amount / cachedRates.MYR;
  }
  return amount / JPY_TO_MYR_RATE;
};