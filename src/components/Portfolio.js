import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { Line } from 'react-chartjs-2';
import { getStockPrice } from '../utils/alphaVantage';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import Download from '@mui/icons-material/Download'; // ← FIXED

function Portfolio() {
  const { user, logout } = useAuth();
  const [symbol, setSymbol] = useState('');
  const [shares, setShares] = useState('');
  const [trades, setTrades] = useState([]);
  const [prices, setPrices] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  // Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch Trades
  useEffect(() => {
    const unsub = onSnapshot(collection(db, `users/${user.uid}/trades`), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setTrades(data);
    });
    return unsub;
  }, [user]);

  // Fetch Live Prices
  useEffect(() => {
    const fetchPrices = async () => {
      const newPrices = {};
      for (const trade of trades) {
        if (!prices[trade.symbol]) {
          const price = await getStockPrice(trade.symbol);
          newPrices[trade.symbol] = price;
        }
      }
      setPrices(prev => ({ ...prev, ...newPrices }));
    };
    if (trades.length > 0) fetchPrices();
  }, [trades]);

  const addTrade = async () => {
    if (!symbol || !shares) return;
    await addDoc(collection(db, `users/${user.uid}/trades`), {
      symbol: symbol.toUpperCase(),
      shares: parseFloat(shares),
      buyPrice: 150.00,
      date: new Date().toISOString()
    });
    setSymbol(''); setShares('');
  };

  const removeTrade = (id) => deleteDoc(doc(db, `users/${user.uid}/trades`, id));

  const totalValue = trades.reduce((sum, t) => {
    const current = parseFloat(prices[t.symbol] || 0);
    return sum + (current * t.shares);
  }, 0).toFixed(2);

  const totalCost = trades.reduce((sum, t) => sum + (t.buyPrice * t.shares), 0).toFixed(2);
  const profitLoss = (totalValue - totalCost).toFixed(2);

  const exportCSV = () => {
    const headers = ['Symbol', 'Shares', 'Buy Price', 'Current Price', 'Value', 'P&L'];
    const rows = trades.map(t => [
      t.symbol,
      t.shares,
      `$${t.buyPrice}`,
      `$${prices[t.symbol] || 'N/A'}`,
      `$${(prices[t.symbol] * t.shares).toFixed(2)}`,
      `$${((prices[t.symbol] - t.buyPrice) * t.shares).toFixed(2)}`
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.csv';
    a.click();
  };

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Portfolio — {user.displayName}</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {darkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
            </button>
            <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              Logout
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Value</h3>
            <p className="text-3xl font-bold text-green-600">${totalValue}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-sm text-gray-500 dark:text-gray-400">Cost Basis</h3>
            <p className="text-3xl font-bold">${totalCost}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-sm text-gray-500 dark:text-gray-400">Profit/Loss</h3>
            <p className={`text-3xl font-bold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${profitLoss}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-4">Add Trade</h2>
          <div className="flex gap-3">
            <input placeholder="Stock (e.g. AAPL)" value={symbol} onChange={e => setSymbol(e.target.value)} className="flex-1 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
            <input type="number" placeholder="Shares" value={shares} onChange={e => setShares(e.target.value)} className="w-24 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
            <button onClick={addTrade} className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600">Add</button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Holdings</h2>
            <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <Download fontSize="small" /> Export CSV
            </button>
          </div>
          <div className="space-y-3">
            {trades.map(t => (
              <div key={t.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <span className="font-bold text-lg">{t.symbol}</span> × {t.shares}
                  <span className="text-sm text-gray-500 ml-2">@ ${t.buyPrice}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">Now: ${prices[t.symbol] || '—'}</p>
                  <p className={`text-sm font-bold ${((prices[t.symbol] || 0) - t.buyPrice) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    P&L: ${(((prices[t.symbol] || 0) - t.buyPrice) * t.shares).toFixed(2)}
                  </p>
                </div>
                <button onClick={() => removeTrade(t.id)} className="text-red-500 hover:text-red-700 ml-4">Remove</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Portfolio;