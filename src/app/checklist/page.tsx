'use client';

import { useEffect, useState } from 'react';
import { getChecklist, setChecklist } from '@/utils/storage';
import { ChecklistItem } from '@/types';

export default function Checklist() {
  const [checklist, setChecklistState] = useState<ChecklistItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemBudget, setNewItemBudget] = useState('');

  useEffect(() => {
    setChecklistState(getChecklist());
  }, []);

  const handleAddItem = () => {
    if (!newItemName.trim() || !newItemBudget) return;
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      name: newItemName,
      budgetedAmount: parseFloat(newItemBudget),
      purchased: false,
    };
    const updated = [...checklist, newItem];
    setChecklistState(updated);
    setChecklist(updated);
    setNewItemName('');
    setNewItemBudget('');
  };

  const togglePurchased = (id: string) => {
    const updated = checklist.map((item) =>
      item.id === id ? { ...item, purchased: !item.purchased } : item
    );
    setChecklistState(updated);
    setChecklist(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Planning</h1>
          <p className="text-gray-600 dark:text-gray-400">Plan your purchases and track your shopping list</p>
        </div>

        {/* Add New Item */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-3">
              <span className="text-lg">🛒</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Add New Item</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Item name"
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
            />
            <input
              type="number"
              value={newItemBudget}
              onChange={(e) => setNewItemBudget(e.target.value)}
              placeholder="Budget amount"
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
            />
            <button onClick={handleAddItem} className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors">
              Add Item
            </button>
          </div>
        </div>

        {/* Checklist Items */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mr-3">
                <span className="text-lg">📋</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Shopping List</h2>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {checklist.filter(item => item.purchased).length} of {checklist.length} completed
            </div>
          </div>

          {checklist.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛒</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No items yet</h3>
              <p className="text-gray-600 dark:text-gray-400">Add items to your shopping list to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                    item.purchased
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={item.purchased}
                      onChange={() => togglePurchased(item.id)}
                      className="w-5 h-5 text-purple-600 dark:text-purple-400 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded focus:ring-purple-500 dark:focus:ring-purple-400"
                    />
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${item.purchased ? 'bg-green-500 dark:bg-green-400' : 'bg-gray-400 dark:bg-gray-500'}`}></div>
                      <div>
                        <span className={`font-medium ${item.purchased ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                          {item.name}
                        </span>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Budget: <span className="font-semibold text-green-600 dark:text-green-400">RM {item.budgetedAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {item.purchased && (
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <span className="text-sm font-medium mr-2">Completed</span>
                      <span className="text-lg">✓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {checklist.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Items</div>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{checklist.length}</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <div className="text-sm font-medium text-green-600 dark:text-green-400">Completed</div>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">{checklist.filter(item => item.purchased).length}</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <div className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Budget</div>
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    RM {checklist.reduce((sum, item) => sum + item.budgetedAmount, 0).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}