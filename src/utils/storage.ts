import { Category, Expense, ChecklistItem } from '@/types';
import { convertJPYtoMYRSync } from '@/utils/currency';

const STORAGE_KEYS = {
  categories: 'categories',
  expenses: 'expenses',
  checklist: 'checklist',
};

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'shopping',
    name: 'Shopping',
    balance: convertJPYtoMYRSync(75000),
  },
  {
    id: 'buffer',
    name: 'Buffer',
    balance: convertJPYtoMYRSync(30000),
  },
  {
    id: 'daily-living',
    name: 'Daily living',
    balance: convertJPYtoMYRSync(90000),
  },
  {
    id: 'souvenir',
    name: 'Souvenir',
    balance: convertJPYtoMYRSync(20000),
  },
];

export const getCategories = (): Category[] => {
  if (typeof window === 'undefined') return DEFAULT_CATEGORIES;
  const data = localStorage.getItem(STORAGE_KEYS.categories);
  if (data) {
    return JSON.parse(data);
  }

  localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(DEFAULT_CATEGORIES));
  return DEFAULT_CATEGORIES;
};

export const setCategories = (categories: Category[]) => {
  localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));
};

export const getExpenses = (): Expense[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.expenses);
  return data ? JSON.parse(data) : [];
};

export const setExpenses = (expenses: Expense[]) => {
  localStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(expenses));
};

export const getChecklist = (): ChecklistItem[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.checklist);
  return data ? JSON.parse(data) : [];
};

export const setChecklist = (checklist: ChecklistItem[]) => {
  localStorage.setItem(STORAGE_KEYS.checklist, JSON.stringify(checklist));
};