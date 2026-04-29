'use client';

import { useEffect, useState } from 'react';
import { getCategories, setCategories, getExpenses } from '@/utils/storage';
import { Category, Expense } from '@/types';

export default function Categories() {
  const [categories, setCategoriesState] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addMoneyCategoryId, setAddMoneyCategoryId] = useState('');
  const [addMoneyAmount, setAddMoneyAmount] = useState('');

  useEffect(() => {
    setCategoriesState(getCategories());
    setExpenses(getExpenses());
  }, []);

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

  const categorySummary = categories.map((cat) => {
    const spent = expenses
      .filter((exp) => exp.categoryId === cat.id)
      .reduce((sum, exp) => sum + exp.amount, 0);
    return { ...cat, spent, remaining: cat.balance - spent };
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Fund Categorization</h1>
      <button
        onClick={() => setShowAddCategory(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add New Category
      </button>
      {showAddCategory && (
        <div className="bg-white border p-4 rounded">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category Name"
            className="border p-2 mr-2"
          />
          <button onClick={handleAddCategory} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
            Add
          </button>
          <button onClick={() => setShowAddCategory(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      )}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Add Money to Category</h2>
        <select
          value={addMoneyCategoryId}
          onChange={(e) => setAddMoneyCategoryId(e.target.value)}
          className="border p-2 mr-2"
        >
          <option value="">Select Category</option>
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
          placeholder="Amount"
          className="border p-2 mr-2"
        />
        <button onClick={handleAddMoney} className="bg-green-500 text-white px-4 py-2 rounded">
          Add Money
        </button>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <div className="space-y-2">
          {categorySummary.map((cat) => (
            <div key={cat.id} className="p-4 border rounded">
              <h3 className="font-semibold">{cat.name}</h3>
              <p>Balance: RM {cat.balance.toFixed(2)}</p>
              <p>Spent: RM {cat.spent.toFixed(2)}</p>
              <p>Remaining: RM {cat.remaining.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}