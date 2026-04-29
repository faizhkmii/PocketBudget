'use client';

import { useState } from 'react';
import { getCategories, setCategories, getExpenses } from '@/utils/storage';
import { Category } from '@/types';

export default function Categories() {
  const [categories, setCategoriesState] = useState<Category[]>(getCategories());
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editBalance, setEditBalance] = useState('');
  const [addMoneyCategoryId, setAddMoneyCategoryId] = useState('');
  const [addMoneyAmount, setAddMoneyAmount] = useState('');

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName,
      balance: 0,
    };
    const updated = [...categories, newCategory];
    setCategoriesState(updated);
    setCategories(updated);
    setNewCategoryName('');
    setShowAddCategory(false);
  };

  const handleAddMoney = () => {
    if (!addMoneyCategoryId || !addMoneyAmount) return;
    const updated = categories.map((cat) =>
      cat.id === addMoneyCategoryId
        ? { ...cat, balance: cat.balance + parseFloat(addMoneyAmount) }
        : cat
    );
    setCategoriesState(updated);
    setCategories(updated);
    setAddMoneyCategoryId('');
    setAddMoneyAmount('');
  };

  const handleEditCategoryStart = (cat: Category) => {
    setEditingCategoryId(cat.id);
    setEditBalance(cat.balance.toString());
  };

  const handleEditCategorySave = () => {
    if (!editingCategoryId || !editBalance) return;
    const updated = categories.map((cat) =>
      cat.id === editingCategoryId
        ? { ...cat, balance: parseFloat(editBalance) }
        : cat
    );
    setCategoriesState(updated);
    setCategories(updated);
    setEditingCategoryId(null);
    setEditBalance('');
  };

  const handleEditCategoryCancel = () => {
    setEditingCategoryId(null);
    setEditBalance('');
  };

  const categorySummary = categories.map((cat) => {
    const spent = getExpenses()
      .filter((exp) => exp.categoryId === cat.id)
      .reduce((sum, exp) => sum + exp.amount, 0);
    return { ...cat, spent, remaining: cat.balance - spent };
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Categories</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your expense categories and budgets</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add New Category */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
                <span className="text-lg">➕</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Add New Category</h2>
            </div>
            {showAddCategory ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Category name"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 transition-colors"
                />
                <div className="flex space-x-3">
                  <button onClick={handleAddCategory} className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors">
                    Add Category
                  </button>
                  <button onClick={() => setShowAddCategory(false)} className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddCategory(true)}
                className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                <span className="mr-2">➕</span>
                Create New Category
              </button>
            )}
          </div>

          {/* Add Money to Category */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                <span className="text-lg">💰</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Add Funds</h2>
            </div>
            <div className="space-y-4">
              <select
                value={addMoneyCategoryId}
                onChange={(e) => setAddMoneyCategoryId(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={addMoneyAmount}
                onChange={(e) => setAddMoneyAmount(e.target.value)}
                placeholder="Amount to add"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              />
              <button onClick={handleAddMoney} className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors">
                Add Funds
              </button>
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-3">
              <span className="text-lg">📂</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Your Categories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorySummary.map((cat) => (
              <div key={cat.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600 hover:shadow-md dark:hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{cat.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm">🏷️</span>
                    </div>
                    {editingCategoryId !== cat.id && (
                      <button
                        onClick={() => handleEditCategoryStart(cat)}
                        className="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
                {editingCategoryId === cat.id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Set Budget Limit</label>
                      <input
                        type="number"
                        value={editBalance}
                        onChange={(e) => setEditBalance(e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
                        placeholder="Enter new budget"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleEditCategorySave}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleEditCategoryCancel}
                        className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Budget</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">RM {cat.balance.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Spent</span>
                      <span className="font-semibold text-red-600 dark:text-red-400">RM {cat.spent.toFixed(2)}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Remaining</span>
                        <span className={`font-bold ${cat.remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          RM {cat.remaining.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}