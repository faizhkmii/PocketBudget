'use client';

import { useEffect, useState } from 'react';
import { getExpenses, getCategories } from '@/utils/storage';
import { Expense, Category } from '@/types';

export default function Statistics() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setExpenses(getExpenses());
    setCategories(getCategories());
  }, []);

  const categoryMap = categories.reduce((map, cat) => {
    map[cat.id] = cat.name;
    return map;
  }, {} as Record<string, string>);

  // Group expenses by date
  const expensesByDate = expenses.reduce((acc, exp) => {
    if (!acc[exp.date]) acc[exp.date] = [];
    acc[exp.date].push(exp);
    return acc;
  }, {} as Record<string, Expense[]>);

  const sortedDates = Object.keys(expensesByDate).sort((a, b) => b.localeCompare(a));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your daily spending patterns and insights</p>
        </div>

        <div className="space-y-6">
          {sortedDates.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No expenses yet</h3>
              <p className="text-gray-600 dark:text-gray-400">Start tracking your expenses to see analytics here</p>
            </div>
          ) : (
            sortedDates.map((date) => {
              const dayTotal = expensesByDate[date].reduce((sum, exp) => sum + exp.amount, 0);
              return (
                <div key={date} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-white text-sm">📅</span>
                        </div>
                        <h2 className="text-xl font-semibold text-white">{date}</h2>
                      </div>
                      <div className="text-right">
                        <div className="text-white/80 text-sm">Daily Total</div>
                        <div className="text-white font-bold text-lg">RM {dayTotal.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4">
                      {expensesByDate[date].map((exp) => (
                        <div key={exp.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mr-4">
                              <span className="text-red-600 dark:text-red-400 text-sm">💸</span>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-gray-100">{categoryMap[exp.categoryId] || 'Unknown'}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{exp.description}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-red-600 dark:text-red-400 text-lg">RM {exp.amount.toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Day Summary</span>
                        <span className="text-xl font-bold text-gray-900 dark:text-gray-100">RM {dayTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {sortedDates.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
                <span className="text-lg">📈</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Summary</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Days</div>
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{sortedDates.length}</div>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400">📅</span>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-green-600 dark:text-green-400">Total Spent</div>
                    <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                      RM {expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400">💰</span>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-purple-600 dark:text-purple-400">Avg per Day</div>
                    <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      RM {(expenses.reduce((sum, exp) => sum + exp.amount, 0) / sortedDates.length).toFixed(2)}
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-400">📊</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}