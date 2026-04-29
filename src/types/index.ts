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

export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer' | 'deposit' | 'withdraw';
  amount: number;
  currency: 'MYR' | 'JPY';
  description: string;
  date: string; // ISO string
  categoryId?: string; // for expenses
  fromAccountId?: string; // for transfers/withdrawals
  toAccountId?: string; // for transfers/deposits
}