'use client';

import { useEffect, useState } from 'react';
import { getCategories, getExpenses } from '@/utils/storage';
import { Category, Expense } from '@/types';
import { convertJPYtoMYRSync, convertMYRtoJPYSync, fetchExchangeRates } from '@/utils/currency';

export default function Home() {
  const [categories] = useState<Category[]>(getCategories());
  const [expenses] = useState<Expense[]>(getExpenses());
  const [converterAmount, setConverterAmount] = useState('');
  const [converterFrom, setConverterFrom] = useState<'MYR' | 'JPY'>('JPY');
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [dashboardCurrency, setDashboardCurrency] = useState<'RM' | 'JPY'>('RM');

  useEffect(() => {
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
        } catch {
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
  const currencyLabel = dashboardCurrency === 'JPY' ? 'JPY' : 'RM';
  const convertForDisplay = (value: number) =>
    dashboardCurrency === 'JPY' ? convertMYRtoJPYSync(value) : value;

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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Track your travel expenses and manage your budget</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 shadow-sm">
              <span className="text-xs uppercase tracking-[0.24em] font-semibold text-gray-500 dark:text-gray-400">Display</span>
              <button
                type="button"
                onClick={() => setDashboardCurrency('RM')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${dashboardCurrency === 'RM' ? 'bg-indigo-600 text-white' : 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                RM
              </button>
              <button
                type="button"
                onClick={() => setDashboardCurrency('JPY')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${dashboardCurrency === 'JPY' ? 'bg-indigo-600 text-white' : 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                JPY
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md dark:hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] font-semibold text-gray-500 dark:text-gray-400">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {currencyLabel} {convertForDisplay(totalBudget).toFixed(2)}
                </p>
              </div>
              <div className="w-11 h-11 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md dark:hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] font-semibold text-gray-500 dark:text-gray-400">Total Spent</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {currencyLabel} {convertForDisplay(totalSpent).toFixed(2)}
                </p>
              </div>
              <div className="w-11 h-11 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">💸</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md dark:hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] font-semibold text-gray-500 dark:text-gray-400">Remaining</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {currencyLabel} {convertForDisplay(remaining).toFixed(2)}
                </p>
              </div>
              <div className="w-11 h-11 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">✅</span>
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
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
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
            <div className="md:col-span-2">
              <div className="rounded-3xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-300 mb-1">Converted result</p>
                {isLoadingRates ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading latest rate…</p>
                ) : (
                  <p className="text-2xl font-semibold text-indigo-900 dark:text-indigo-100">
                    {converterFrom === 'JPY' ? 'MYR' : 'JPY'} {convertedAmount.toFixed(2)}
                  </p>
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
                    <span className="font-medium text-green-600 dark:text-green-400">{currencyLabel} {convertForDisplay(cat.balance).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Spent:</span>
                    <span className="font-medium text-red-600 dark:text-red-400">{currencyLabel} {convertForDisplay(cat.spent).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-gray-600 dark:text-gray-400">Remaining:</span>
                    <span className={cat.remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {currencyLabel} {convertForDisplay(cat.remaining).toFixed(2)}
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
