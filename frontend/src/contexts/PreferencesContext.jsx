import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useTranslation } from 'react-i18next';

const PreferencesContext = createContext();

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};

export const PreferencesProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currency, setCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const language = i18n.language || 'en';

  // Load preferences from localStorage on mount and detect location
  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferredCurrency');
    
    if (savedCurrency) {
      setCurrency(savedCurrency);
    } else {
      detectLocation();
    }

    fetchExchangeRates();
  }, []);

  // Auto-detect location for currency
  const detectLocation = async () => {
    try {
      // Using a free IP geolocation API
      // Note: In production, consider a backend proxy or paid service for reliability
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) throw new Error('Location detection failed');
      
      const data = await response.json();
      const currencyCode = data.currency;
      
      if (['USD', 'EUR', 'GBP'].includes(currencyCode)) {
        updateCurrency(currencyCode);
      } else {
        // Fallback logic based on region
        if (data.country_code === 'GB') updateCurrency('GBP');
        else if (data.continent_code === 'EU' || ['ES', 'FR', 'DE', 'IT', 'NL'].includes(data.country_code)) updateCurrency('EUR');
        else updateCurrency('USD');
      }
    } catch (error) {
      console.warn('Geo-location failed, defaulting to USD:', error);
      updateCurrency('USD');
    }
  };

  // Fetch exchange rates from backend API
  const fetchExchangeRates = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/exchange/rates');
      setExchangeRates(response.data);
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      // Use fallback rates if API fails
      setExchangeRates({
        GBP: 1,
        USD: 1.27,
        EUR: 1.15,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Convert price based on selected currency
  const convertPrice = (price, fromCurrency = 'GBP') => {
    if (typeof price !== 'number') {
      price = parseFloat(price) || 0;
    }
    
    if (currency === fromCurrency) return price;
    
    // Ensure we have rates
    if (!exchangeRates[currency] || !exchangeRates[fromCurrency]) return price;
    
    const rate = exchangeRates[currency] / exchangeRates[fromCurrency];
    return rate ? price * rate : price;
  };

  // Format price with currency symbol
  const formatPrice = (price, fromCurrency = 'GBP') => {
    const convertedPrice = convertPrice(price, fromCurrency);
    
    // Clean language code for Intl (e.g., 'en-US' -> 'en')
    const langCode = language.split('-')[0];
    
    const formatter = new Intl.NumberFormat(langCode, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    return formatter.format(convertedPrice);
  };

  // Update currency preference
  const updateCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('preferredCurrency', newCurrency);
  };

  // Update language preference
  const updateLanguage = (newLanguage) => {
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('preferredLanguage', newLanguage);
  };

  // Manual override for testing
  const manualOverride = (curr, lang) => {
    if (curr) updateCurrency(curr);
    if (lang) updateLanguage(lang);
  };

  const value = {
    currency,
    language,
    exchangeRates,
    isLoading,
    formatPrice,
    convertPrice,
    updateCurrency,
    updateLanguage,
    manualOverride,
    refreshRates: fetchExchangeRates,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};
