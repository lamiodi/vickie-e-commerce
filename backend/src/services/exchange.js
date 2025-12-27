import axios from 'axios';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

let cachedRates = null;
let lastFetch = 0;
const CACHE_DURATION = 1000 * 60 * 60 * 12; // 12 hours

const getApiUrl = () => {
  if (env.exchangeApiKey) {
    const url = `https://v6.exchangerate-api.com/v6/${env.exchangeApiKey}/latest/GBP`;
    logger.debug(`Using Exchange API URL: ${url.replace(env.exchangeApiKey, '***')}`);
    return url;
  }
  logger.debug('Using default open.er-api.com URL');
  return 'https://open.er-api.com/v6/latest/GBP';
};

export const getExchangeRates = async () => {
  const now = Date.now();
  if (cachedRates && now - lastFetch < CACHE_DURATION) {
    return cachedRates;
  }

  try {
    const response = await axios.get(getApiUrl());
    const rates = response.data?.rates || response.data?.conversion_rates;
    if (rates) {
      cachedRates = rates;
      lastFetch = now;
      return cachedRates;
    }
    throw new Error('Invalid response from exchange API');
  } catch (error) {
    logger.error('Failed to fetch exchange rates:', { 
      message: error.message, 
      response: error.response?.data 
    });
    // Return fallback rates if API fails
    return {
      GBP: 1,
      USD: 1.27,
      EUR: 1.15,
    };
  }
};
