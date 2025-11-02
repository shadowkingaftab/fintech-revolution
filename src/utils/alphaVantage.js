// src/utils/alphaVantage.js
const API_KEY = 'demo'; // Free tier — works for AAPL, MSFT, etc.

export const getStockPrice = async (symbol) => {
  try {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );
    const data = await res.json();
    const price = data['Global Quote']?.['05. price'];
    return price ? parseFloat(price).toFixed(2) : null;
  } catch (err) {
    console.log('Price fetch failed, using mock');
    return (Math.random() * 100 + 100).toFixed(2); // Mock fallback
  }
};