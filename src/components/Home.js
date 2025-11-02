import { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

function Home() {
  const [stock, setStock] = useState('AAPL');
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [news, setNews] = useState([]);
  const [trending, setTrending] = useState([]);

  const API_KEY = 'demo'; // Free for testing — replace later

  const fetchData = async () => {
    try {
      // Stock Prices
      const res = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock}&apikey=${API_KEY}`
      );
      const data = res.data['Time Series (Daily)'];
      if (!data) return;
      const labels = Object.keys(data).slice(0, 30).reverse();
      const prices = labels.map(date => parseFloat(data[date]['4. close']));
      
      setChartData({
        labels,
        datasets: [{
          label: `${stock} Price (USD)`,
          data: prices,
          borderColor: '#22d3ee',
          backgroundColor: 'rgba(34, 211, 238, 0.1)',
          tension: 0.3,
          fill: true,
        }]
      });

      // Mock News & Trending (API limits in demo)
      setNews([
        { title: `${stock} hits all-time high!`, published_at: '2025-11-02' },
        { title: `Analysts predict ${stock} growth`, published_at: '2025-11-01' },
      ]);
      setTrending([
        { ticker: 'NVDA', change_percentage: '12.5%' },
        { ticker: 'AMD', change_percentage: '8.3%' },
      ]);
    } catch (err) {
      console.log('Using mock data');
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [stock]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Live Market Dashboard</h1>

        <div className="mb-6 flex justify-center">
          <select
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg text-lg font-medium bg-white shadow-md"
          >
            <option value="AAPL">Apple (AAPL)</option>
            <option value="GOOGL">Google (GOOGL)</option>
            <option value="TSLA">Tesla (TSLA)</option>
            <option value="MSFT">Microsoft (MSFT)</option>
          </select>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Latest News</h2>
            {news.map((item, i) => (
              <div key={i} className="mb-3 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-gray-500 mt-1">{item.published_at}</p>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-green-600">Top Gainers</h2>
            {trending.map((t, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-green-50 rounded-lg mb-2">
                <span className="font-medium">{t.ticker}</span>
                <span className="text-green-600 font-bold">+{t.change_percentage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;