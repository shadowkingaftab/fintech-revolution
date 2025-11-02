import { useState, useEffect } from 'react';
import { getStockPrice } from '../utils/alphaVantage';
import { BellIcon } from '@heroicons/react/24/solid';

function Watchlist() {
  const [watchlist, setWatchlist] = useState(['AAPL', 'GOOGL', 'TSLA']);
  const [prices, setPrices] = useState({});
  const [alerts, setAlerts] = useState({});

  useEffect(() => {
    const fetchPrices = async () => {
      const newPrices = {};
      for (const symbol of watchlist) {
        const price = await getStockPrice(symbol);
        newPrices[symbol] = price;
      }
      setPrices(newPrices);
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, [watchlist]);

  const setAlert = (symbol, target) => {
    setAlerts(prev => ({ ...prev, [symbol]: target }));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Watchlist</h1>
      <div className="space-y-4">
        {watchlist.map(symbol => (
          <div key={symbol} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex items-center justify-between">
            <div>
              <span className="text-xl font-bold">{symbol}</span>
              <span className="ml-4 text-2xl font-mono">${prices[symbol] || '...'}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Alert price"
                onBlur={e => e.target.value && setAlert(symbol, e.target.value)}
                className="w-24 p-2 border rounded dark:bg-gray-700"
              />
              <BellIcon className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Watchlist;