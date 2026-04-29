'use client';

import { useEffect, useState } from 'react';
import { getCategories, getExpenses } from '@/utils/storage';
import { Category, Expense } from '@/types';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    setCategories(getCategories());
    setExpenses(getExpenses());
  }, []);

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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Travel Expense Tracker</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded">
          <h2 className="text-lg font-semibold">Total Budget</h2>
          <p className="text-2xl">RM {totalBudget.toFixed(2)}</p>
        </div>
        <div className="bg-red-100 p-4 rounded">
          <h2 className="text-lg font-semibold">Total Spent</h2>
          <p className="text-2xl">RM {totalSpent.toFixed(2)}</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <h2 className="text-lg font-semibold">Remaining</h2>
          <p className="text-2xl">RM {remaining.toFixed(2)}</p>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Category Summary</h2>
        <div className="space-y-2">
          {categorySummary.map((cat) => (
            <div key={cat.id} className="flex justify-between p-2 border rounded">
              <span>{cat.name}</span>
              <span>Budget: RM {cat.balance.toFixed(2)} | Spent: RM {cat.spent.toFixed(2)} | Remaining: RM {cat.remaining.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
