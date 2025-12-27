import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(path) {
  if (!path) return '/placeholder.jpg';

  // Return as is if it's an external URL (Cloudinary, etc.)
  if (path.startsWith('http') || path.startsWith('//')) {
    return path;
  }

  // Return as is if it's a data URL
  if (path.startsWith('data:')) {
    return path;
  }

  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // If it's in the uploads directory, it might need to be served via proxy or directly
  // Since we set up a proxy for /uploads, we can just return the path
  return cleanPath;
}

// Currency conversion utility functions
export function convertPrice(price, fromCurrency = 'GBP', toCurrency, exchangeRates) {
  if (fromCurrency === toCurrency) return price;
  
  const rateKey = `${fromCurrency}_${toCurrency}`;
  const reverseKey = `${toCurrency}_${fromCurrency}`;
  
  // Try to find the exchange rate
  let rate = exchangeRates[rateKey];
  
  // If direct rate not found, try reverse rate
  if (!rate && exchangeRates[reverseKey]) {
    rate = 1 / exchangeRates[reverseKey];
  }
  
  // If still no rate found, use fallback rates
  if (!rate) {
    const fallbackRates = {
      'GBP_USD': 1.25,
      'GBP_EUR': 1.15,
      'USD_GBP': 0.80,
      'USD_EUR': 0.92,
      'EUR_GBP': 0.87,
      'EUR_USD': 1.09
    };
    rate = fallbackRates[rateKey] || fallbackRates[reverseKey] ? (1 / fallbackRates[reverseKey]) : 1;
  }
  
  return price * rate;
}

export function formatPrice(amount, currency = 'GBP') {
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(amount);
}

export function getCurrencySymbol(currency) {
  const symbols = {
    'GBP': '£',
    'USD': '$',
    'EUR': '€'
  };
  
  return symbols[currency] || currency;
}
