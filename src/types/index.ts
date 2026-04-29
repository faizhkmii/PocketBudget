export interface Category {
  id: string;
  name: string;
  balance: number;
}

export interface Expense {
  id: string;
  categoryId: string;
  amount: number;
  date: string; // YYYY-MM-DD
  description: string;
  currency?: 'MYR' | 'JPY'; // optional, default MYR
}

export interface ChecklistItem {
  id: string;
  name: string;
  budgetedAmount: number;
  budgetCurrency?: 'MYR' | 'JPY';
  purchased: boolean;
  purchasedAmount?: number;
  purchasedCurrency?: 'MYR' | 'JPY';
}

export interface WalletAccount {
  id: string;
  name: string;
  balance: number;
  currency: 'MYR' | 'JPY';
  type: 'cash' | 'account' | 'credit';
  limit?: number; // for credit cards
}