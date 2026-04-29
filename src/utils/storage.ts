import { Category, Expense, ChecklistItem, WalletAccount } from '@/types';
import { convertJPYtoMYRSync } from '@/utils/currency';

const STORAGE_KEYS = {
  categories: 'categories',
  expenses: 'expenses',
  checklist: 'checklist',
  wallet: 'wallet',
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

const DEFAULT_WALLET: WalletAccount[] = [
  {
    id: 'cash',
    name: 'Cash',
    balance: 160000,
    currency: 'JPY',
    type: 'cash',
  },
  {
    id: 'maybank',
    name: 'Maybank Account',
    balance: 0,
    currency: 'MYR',
    type: 'account',
  },
  {
    id: 'hong-leong-wise',
    name: 'Hong Leong Wise Credit Card',
    balance: 2000,
    currency: 'MYR',
    type: 'credit',
    limit: 2000,
  },
  {
    id: 'cimb',
    name: 'CIMB Credit Card',
    balance: 4000,
    currency: 'MYR',
    type: 'credit',
    limit: 4000,
  },
  {
    id: 'rhb-multi',
    name: 'RHB Multi Currency Account',
    balance: 0,
    currency: 'JPY',
    type: 'account',
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

export const getWallet = (): WalletAccount[] => {
  if (typeof window === 'undefined') return DEFAULT_WALLET;
  const data = localStorage.getItem(STORAGE_KEYS.wallet);
  if (data) {
    return JSON.parse(data);
  }

  localStorage.setItem(STORAGE_KEYS.wallet, JSON.stringify(DEFAULT_WALLET));
  return DEFAULT_WALLET;
};

export const setWallet = (wallet: WalletAccount[]) => {
  localStorage.setItem(STORAGE_KEYS.wallet, JSON.stringify(wallet));
};

export const updateAccountBalance = (accountId: string, amount: number, operation: 'add' | 'subtract') => {
  const wallet = getWallet();
  const account = wallet.find(acc => acc.id === accountId);
  
  if (!account) return;
  
  if (operation === 'add') {
    account.balance += amount;
  } else if (operation === 'subtract') {
    account.balance = Math.max(0, account.balance - amount);
  }
  
  setWallet(wallet);
};

export const transferBetweenAccounts = (
  fromAccountId: string,
  toAccountId: string,
  amount: number,
  fromCurrency: 'MYR' | 'JPY'
) => {
  const wallet = getWallet();
  const fromAccount = wallet.find(acc => acc.id === fromAccountId);
  const toAccount = wallet.find(acc => acc.id === toAccountId);
  
  if (!fromAccount || !toAccount) return;
  
  // Check if from account has enough balance
  if (fromAccount.balance < amount) return;
  
  // Deduct from source account
  fromAccount.balance -= amount;
  
  // Convert if currencies are different
  const convertedAmount = fromCurrency === 'JPY' && toAccount.currency === 'MYR'
    ? convertJPYtoMYRSync(amount)
    : fromCurrency === 'MYR' && toAccount.currency === 'JPY'
    ? amount / convertJPYtoMYRSync(1) // Reverse conversion
    : amount;
  
  // Add to destination account
  toAccount.balance += convertedAmount;
  
  setWallet(wallet);
};