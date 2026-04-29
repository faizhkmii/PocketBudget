'use client';

import { useEffect, useState } from 'react';
import { getCategories, getExpenses } from '@/utils/storage';
import { Category, Expense } from '@/types';
import { convertJPYtoMYRSync, convertMYRtoJPYSync, fetchExchangeRates } from '@/utils/currency';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [converterAmount, setConverterAmount] = useState('');
  const [converterFrom, setConverterFrom] = useState<'MYR' | 'JPY'>('JPY');
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  useEffect(() => {
    setCategories(getCategories());
    setExpenses(getExpenses());
    // Fetch latest rates on component mount
    fetchExchangeRates();
  }, []);

  useEffect(() => {
    const updateConversion = async () => {
      if (converterAmount) {
        setIsLoadingRates(true);
        try {
          const rates = await fetchExchangeRates();
          const amount = parseFloat(converterAmount);
          const rate = rates.MYR;
          const result = converterFrom === 'JPY' ? amount * rate : amount / rate;
          setConvertedAmount(result);
        } catch (error) {
          // Fallback to sync conversion
          const result = converterFrom === 'JPY'
            ? convertJPYtoMYRSync(parseFloat(converterAmount))
            : convertMYRtoJPYSync(parseFloat(converterAmount));
          setConvertedAmount(result);
        } finally {
          setIsLoadingRates(false);
        }
      } else {
        setConvertedAmount(0);
      }
    };

    updateConversion();
  }, [converterAmount, converterFrom]);

  const totalBudget = categories.reduce((sum, cat) => sum + cat.balance, 0);
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = totalBudget - totalSpent;

  const categorySummary = categories.map((cat) => {
    const spent = expenses
      .filter((exp) => exp.categoryId === cat.id)
      .reduce((sum, exp) => sum + exp.amount, 0);
    return { ...cat, spent, remaining: cat.balance - spent };
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your travel expenses and manage your budget</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Budget</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">RM {totalBudget.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">RM {totalSpent.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💸</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Remaining</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">RM {remaining.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Currency Converter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center mr-3">
              <span className="text-lg">💱</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Currency Converter</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount</label>
              <input
                type="number"
                value={converterAmount}
                onChange={(e) => setConverterAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">From</label>
              <select
                value={converterFrom}
                onChange={(e) => setConverterFrom(e.target.value as 'MYR' | 'JPY')}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
              >
                <option value="JPY">JPY</option>
                <option value="MYR">MYR</option>
              </select>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-gray-400 dark:text-gray-500">→</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">To</label>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg px-3 py-2 text-center">
                {isLoadingRates ? (
                  <span className="text-gray-500 dark:text-gray-400 animate-pulse">Loading...</span>
                ) : (
                  <span className="font-semibold text-indigo-700 dark:text-indigo-300">
                    {converterFrom === 'JPY' ? 'MYR' : 'JPY'} {convertedAmount.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">Real-time rates updated automatically</p>
        </div>

        {/* Category Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
              <span className="text-lg">📂</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Category Overview</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorySummary.map((cat) => (
              <div key={cat.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md dark:hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{cat.name}</h3>
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <span className="text-sm">🏷️</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Budget:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">RM {cat.balance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Spent:</span>
                    <span className="font-medium text-red-600 dark:text-red-400">RM {cat.spent.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-gray-600 dark:text-gray-400">Remaining:</span>
                    <span className={cat.remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      RM {cat.remaining.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
