'use client';

import { useState } from 'react';
import { getCategories, getChecklist, getExpenses, setChecklist, setExpenses, addTransaction } from '@/utils/storage';
import { Expense } from '@/types';
import { convertJPYtoMYRSync } from '@/utils/currency';

export default function PlusButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'expense' | 'checklist'>('expense');
  const [amount, setAmount] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState<'MYR' | 'JPY'>('MYR');

  const categories = getCategories();
  const checklist = getChecklist();

  const resetForm = () => {
    setAmount('');
    setSelectedId('');
    setDescription('');
    setCurrency('MYR');
    setMode('expense');
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !selectedId) return;

    const expenseId = crypto.randomUUID();
    let myrAmount = parseFloat(amount);
    if (currency === 'JPY') {
      myrAmount = convertJPYtoMYRSync(myrAmount);
    }

    const newExpense: Expense = {
      id: expenseId,
      categoryId: selectedId,
      amount: myrAmount,
      date: new Date().toISOString().split('T')[0],
      description: description ? `${description} (${currency} ${amount})` : `${currency} ${amount}`,
      currency,
    };

    const expenses = getExpenses();
    setExpenses([...expenses, newExpense]);

    // Create transaction record
    const category = categories.find(cat => cat.id === selectedId);
    addTransaction({
      type: 'expense',
      amount: parseFloat(amount),
      currency,
      description: description || `Expense in ${category?.name}`,
      categoryId: selectedId,
    });

    setIsOpen(false);
    resetForm();
  };

  const handleChecklistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !selectedId) return;

    let purchasedAmount = parseFloat(amount);
    if (currency === 'JPY') {
      purchasedAmount = convertJPYtoMYRSync(purchasedAmount);
    }

    const updatedChecklist = checklist.map((item) =>
      item.id === selectedId
        ? {
            ...item,
            purchased: true,
            purchasedAmount,
            purchasedCurrency: currency,
          }
        : item
    );

    setChecklist(updatedChecklist);
    setIsOpen(false);
    resetForm();
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const selectedChecklistItem = checklist.find((item) => item.id === selectedId);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl dark:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center z-40 group"
        aria-label="Open add modal"
      >
        <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-indigo-600 dark:bg-indigo-500 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">
                {mode === 'expense' ? 'Add Category Expense' : 'Record Checklist Purchase'}
              </h2>
            </div>
            <form onSubmit={mode === 'expense' ? handleExpenseSubmit : handleChecklistSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMode('expense');
                    setSelectedId('');
                  }}
                  className={`rounded-lg px-4 py-2 ${mode === 'expense' ? 'bg-white text-indigo-700 dark:bg-indigo-700 dark:text-white shadow' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                >
                  Categories
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('checklist');
                    setSelectedId('');
                  }}
                  className={`rounded-lg px-4 py-2 ${mode === 'checklist' ? 'bg-white text-indigo-700 dark:bg-indigo-700 dark:text-white shadow' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                >
                  Checklist
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {mode === 'expense' ? 'Category' : 'Checklist item'}
                </label>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
                  required
                >
                  <option value="">Select an option</option>
                  {mode === 'expense'
                    ? categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))
                    : checklist.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as 'MYR' | 'JPY')}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
                  >
                    <option value="MYR">MYR</option>
                    <option value="JPY">JPY</option>
                  </select>
                </div>
              </div>

              {mode === 'expense' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
                    placeholder="Optional description"
                  />
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-4 bg-gray-50 dark:bg-gray-900 text-sm text-gray-600 dark:text-gray-300">
                  {selectedChecklistItem ? (
                    <p>
                      Recording purchase for <span className="font-semibold text-gray-900 dark:text-white">{selectedChecklistItem.name}</span>.
                    </p>
                  ) : (
                    <p>Select a checklist item to mark it as purchased.</p>
                  )}
                  <p className="mt-2">This will tick the item and store the amount spent.</p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-colors"
                >
                  {mode === 'expense' ? 'Add Expense' : 'Record Purchase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
