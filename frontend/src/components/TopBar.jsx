import { useState } from 'react';
import PropTypes from 'prop-types';
import { MapPinIcon, ChevronDownIcon } from './AppIcons';
import { Link } from 'react-router-dom';
import { usePreferences } from '@/contexts/PreferencesContext';
import { useTranslation } from 'react-i18next';

export function TopBar() {
  const { t } = useTranslation();
  const {
    currency,
    language,
    updateCurrency,
    updateLanguage,
    isLoading
  } = usePreferences();
  
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const currencies = ['USD', 'EUR', 'GBP'];
  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'es', name: 'Spanish', native: 'Español' },
    { code: 'fr', name: 'French', native: 'Français' }
  ];

  return (
    <div className="bg-[#1a1a1a] text-white text-[10px] md:text-xs py-2 relative z-[60]">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <MapPinIcon className="w-3.5 h-3.5" />
          <span>{t('topbar.address')}</span>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="relative">
            <button 
              className="flex items-center gap-1 hover:text-gray-300 focus:outline-none disabled:opacity-50"
              onClick={() => {
                setIsCurrencyOpen(!isCurrencyOpen);
                setIsLanguageOpen(false);
              }}
              disabled={isLoading}
              aria-label="Select currency"
            >
              <span>{currency}</span>
              <ChevronDownIcon className={`w-3 h-3 transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} />
            </button>
            {isCurrencyOpen && (
              <div className="absolute top-full right-0 mt-1 w-20 bg-white text-gray-800 rounded shadow-lg py-1 z-50">
                {currencies.map((curr) => (
                  <button
                    key={curr}
                    className={`block w-full text-left px-3 py-1.5 hover:bg-gray-100 ${currency === curr ? 'font-bold text-[#C41E3A]' : ''}`}
                    onClick={() => {
                      updateCurrency(curr);
                      setIsCurrencyOpen(false);
                    }}
                    aria-label={`Select ${curr} currency`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              className="flex items-center gap-1 hover:text-gray-300 focus:outline-none disabled:opacity-50"
              onClick={() => {
                setIsLanguageOpen(!isLanguageOpen);
                setIsCurrencyOpen(false);
              }}
              disabled={isLoading}
              aria-label="Select language"
            >
              <span>{language.toUpperCase()}</span>
              <ChevronDownIcon className={`w-3 h-3 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
            </button>
            {isLanguageOpen && (
              <div className="absolute top-full right-0 mt-1 w-32 bg-white text-gray-800 rounded shadow-lg py-1 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`block w-full text-left px-3 py-1.5 hover:bg-gray-100 ${language === lang.code ? 'font-bold text-[#C41E3A]' : ''}`}
                    onClick={() => {
                      updateLanguage(lang.code);
                      setIsLanguageOpen(false);
                    }}
                    aria-label={`Select ${lang.name} language`}
                  >
                    {lang.native}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-[#C41E3A]">•</span>
          <Link to="/account?tab=orders" className="hover:text-gray-300">
            {t('topbar.track_order')}
          </Link>
        </div>
      </div>
    </div>
  );
}

TopBar.propTypes = {
  // This component doesn't receive props, but we add PropTypes for consistency
};
