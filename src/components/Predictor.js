import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Predictor() {
  const [symbol, setSymbol] = useState('AAPL');
  const [prediction, setPrediction] = useState(null);

  const mockPredict = () => {
    const current = 150 + Math.random() * 50;
    const future = current * (1 + (Math.random() - 0.5) * 0.2);
    setPrediction({
      current: current.toFixed(2),
      predicted: future.toFixed(2),
      change: ((future - current) / current * 100).toFixed(2)
    });
  };

  const data = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Historical',
        data: [140, 145, 142, 148, 150, 152, 149],
        borderColor: '#3b82f6',
        tension: 0.3
      },
      {
        label: 'AI Prediction',
        data: [null, null, null, null, 150, 152, prediction?.predicted || 155],
        borderColor: '#10b981',
        borderDash: [5, 5],
        tension: 0.3
      }
    ]
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">AI Stock Predictor</h1>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
          <div className="flex gap-4 mb-4">
            <input
              value={symbol}
              onChange={e => setSymbol(e.target.value.toUpperCase())}
              placeholder="Stock Symbol"
              className="flex-1 p-3 border rounded-lg dark:bg-gray-700"
            />
            <button
              onClick={mockPredict}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Predict
            </button>
          </div>
          {prediction && (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">Current</p>
                <p className="text-2xl font-bold">${prediction.current}</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">7-Day Prediction</p>
                <p className="text-2xl font-bold">${prediction.predicted}</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">Change</p>
                <p className={`text-2xl font-bold ${prediction.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {prediction.change}%
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <Line data={data} options={{ responsive: true }} height={300} />
        </div>
      </div>
    </div>
  );
}

export default Predictor;