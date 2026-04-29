import { Category, Expense, ChecklistItem } from '@/types';

const STORAGE_KEYS = {
  categories: 'categories',
  expenses: 'expenses',
  checklist: 'checklist',
};

export const getCategories = (): Category[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.categories);
  return data ? JSON.parse(data) : [];
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