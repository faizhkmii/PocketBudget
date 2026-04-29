'use client';

import { useState } from 'react';
import { getWallet, updateAccountBalanceWithTransaction } from '@/utils/storage';
import { convertJPYtoMYRSync } from '@/utils/currency';
import type { WalletAccount } from '@/types';

export default function Wallet() {
  const [wallet, setWalletState] = useState<WalletAccount[]>(() => getWallet());
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [depositAmount, setDepositAmount] = useState('');
  const [isWithdrawMode, setIsWithdrawMode] = useState(false);
  const [transferFromId, setTransferFromId] = useState('');
  const [transferToId, setTransferToId] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [editingBalance, setEditingBalance] = useState<string | null>(null);
  const [editBalanceValue, setEditBalanceValue] = useState('');

  const refreshWallet = () => {
    setWalletState(getWallet());
  };

  const handleDeposit = (accountId: string) => {
    setSelectedAccountId(accountId);
    setDepositAmount('');
    setIsWithdrawMode(false);
    setShowDepositModal(true);
  };

  const handleWithdraw = (accountId: string) => {
    setSelectedAccountId(accountId);
    setDepositAmount('');
    setIsWithdrawMode(true);
    setShowDepositModal(true);
  };

  const submitDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) return;

    if (isWithdrawMode) {
      updateAccountBalanceWithTransaction(selectedAccountId, amount, 'subtract', `Withdrawal from ${selectedAccount?.name}`, 'withdraw');
    } else {
      updateAccountBalanceWithTransaction(selectedAccountId, amount, 'add', `Deposit to ${selectedAccount?.name}`, 'deposit');
    }

    setShowDepositModal(false);
    setDepositAmount('');
    setSelectedAccountId('');
    refreshWallet();
  };

  const handleEditBalance = (accountId: string, currentBalance: number) => {
    setEditingBalance(accountId);
    setEditBalanceValue(currentBalance.toString());
  };

  const saveBalanceEdit = () => {
    const newBalance = parseFloat(editBalanceValue);
    if (isNaN(newBalance) || newBalance < 0) return;

    const account = currentWallet.find(acc => acc.id === editingBalance);
    if (!account) return;

    const difference = newBalance - account.balance;
    if (difference === 0) {
      setEditingBalance(null);
      return;
    }

    const operation = difference > 0 ? 'add' : 'subtract';
    const type = difference > 0 ? 'deposit' : 'withdraw';
    const description = `Balance adjustment for ${account.name}`;

    updateAccountBalanceWithTransaction(editingBalance, Math.abs(difference), operation, description, type);

    setEditingBalance(null);
    setEditBalanceValue('');
    refreshWallet();
  };

  const cancelBalanceEdit = () => {
    setEditingBalance(null);
    setEditBalanceValue('');
  };

  const currentWallet: WalletAccount[] = wallet.length > 0 ? wallet : getWallet();

  const totalBalanceMYR = currentWallet.reduce((sum, account) => {
    const amount = account.currency === 'JPY' ? convertJPYtoMYRSync(account.balance) : account.balance;
    return sum + amount;
  }, 0);

  const totalCreditLimit = currentWallet
    .filter(account => account.type === 'credit')
    .reduce((sum, account) => sum + (account.limit || 0), 0);

  const totalCreditUsed = currentWallet
    .filter(account => account.type === 'credit')
    .reduce((sum, account) => sum + account.balance, 0);

  const selectedAccount = currentWallet.find(acc => acc.id === selectedAccountId);
  const fromAccount = currentWallet.find(acc => acc.id === transferFromId);
  const toAccount = currentWallet.find(acc => acc.id === transferToId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Wallet</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your accounts and balances</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md dark:hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] font-semibold text-gray-500 dark:text-gray-400">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">RM {totalBalanceMYR.toFixed(2)}</p>
              </div>
              <div className="w-11 h-11 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md dark:hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] font-semibold text-gray-500 dark:text-gray-400">Credit Used</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">RM {totalCreditUsed.toFixed(2)}</p>
              </div>
              <div className="w-11 h-11 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">💳</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md dark:hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] font-semibold text-gray-500 dark:text-gray-400">Credit Limit</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">RM {totalCreditLimit.toFixed(2)}</p>
              </div>
              <div className="w-11 h-11 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transfer Button */}
        <button
          onClick={() => {
            setTransferFromId('');
            setTransferToId('');
            setTransferAmount('');
            setShowTransferModal(true);
          }}
          className="mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <span>🔄</span>
          Transfer Money
        </button>

        {/* Accounts List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-3">
              <span className="text-lg">🏦</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Your Accounts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentWallet.map((account) => {
              const displayCurrency = account.id === 'maybank' || account.id === 'cimb' || account.id === 'hong-leong-wise' ? 'RM' :
                                     account.id === 'cash' ? 'JPY' : 'JPY';
              const displayBalance = account.currency === 'JPY' && displayCurrency === 'RM' ? convertJPYtoMYRSync(account.balance) : account.balance;

              return (
                <div key={account.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600 hover:shadow-md dark:hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{account.name}</h3>
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold">
                        {account.id === 'maybank' ? 'MB' :
                         account.id === 'cimb' ? 'CIMB' :
                         account.id === 'hong-leong-wise' ? 'HL' :
                         account.id === 'rhb-multi' ? 'RHB' :
                         account.id === 'cash' ? '💵' : '🏦'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {account.id === 'rhb-multi' ? (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">RM Balance</span>
                          <span className="font-semibold text-green-600 dark:text-green-400">RM 0</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">JPY Balance</span>
                          {editingBalance === account.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editBalanceValue}
                                onChange={(e) => setEditBalanceValue(e.target.value)}
                                className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded"
                                autoFocus
                              />
                              <button
                                onClick={saveBalanceEdit}
                                className="text-green-600 hover:text-green-700 text-sm"
                              >
                                ✓
                              </button>
                              <button
                                onClick={cancelBalanceEdit}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-green-600 dark:text-green-400">
                                JPY {account.balance.toLocaleString()}
                              </span>
                              <button
                                onClick={() => handleEditBalance(account.id, account.balance)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm"
                              >
                                ✏️
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Balance</span>
                        {editingBalance === account.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editBalanceValue}
                              onChange={(e) => setEditBalanceValue(e.target.value)}
                              className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded"
                              autoFocus
                            />
                            <button
                              onClick={saveBalanceEdit}
                              className="text-green-600 hover:text-green-700 text-sm"
                            >
                              ✓
                            </button>
                            <button
                              onClick={cancelBalanceEdit}
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-green-600 dark:text-green-400">
                              {`${displayCurrency} ${displayBalance.toLocaleString()}`}
                            </span>
                            <button
                              onClick={() => handleEditBalance(account.id, account.balance)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm"
                            >
                              ✏️
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {account.type === 'credit' && account.limit && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Limit</span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {displayCurrency} {account.limit.toLocaleString()}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Available</span>
                            <span className={`font-bold ${account.balance < account.limit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {displayCurrency} {(account.limit - account.balance).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-600 flex gap-2">
                      <button
                        onClick={() => handleDeposit(account.id)}
                        className="flex-1 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-semibold rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200"
                      >
                        + Add
                      </button>
                      {account.type !== 'credit' && (
                        <button
                          onClick={() => handleWithdraw(account.id)}
                          className="flex-1 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
                        >
                          - Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Deposit/Withdraw Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-sm w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {isWithdrawMode ? 'Withdraw Money' : 'Add Money'}
            </h2>
            {selectedAccount && (
              <>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Account: <span className="font-semibold text-gray-900 dark:text-gray-100">{selectedAccount.name}</span>
                </p>
                <div className="space-y-4">
                  <input
                    type="number"
                    placeholder={`Enter amount in ${selectedAccount.currency}`}
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowDepositModal(false);
                        setDepositAmount('');
                      }}
                      className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitDeposit}
                      className={`flex-1 px-4 py-2 font-semibold rounded-lg transition-colors duration-200 text-white ${
                        isWithdrawMode
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {isWithdrawMode ? 'Withdraw' : 'Add'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-sm w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Transfer Money
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  From Account
                </label>
                <select
                  value={transferFromId}
                  onChange={(e) => setTransferFromId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select source account</option>
                  {currentWallet.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.currency} {acc.balance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  To Account
                </label>
                <select
                  value={transferToId}
                  onChange={(e) => setTransferToId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select destination account</option>
                  {currentWallet.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.currency})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {fromAccount && toAccount && transferAmount && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    {fromAccount.currency === toAccount.currency
                      ? `Transfer: ${fromAccount.currency} ${transferAmount}`
                      : `Convert: ${fromAccount.currency} ${transferAmount} → ${toAccount.currency} ${(
                          fromAccount.currency === 'JPY'
                            ? convertJPYtoMYRSync(parseFloat(transferAmount))
                            : parseFloat(transferAmount) / convertJPYtoMYRSync(1)
                        ).toLocaleString()}`
                    }
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowTransferModal(false);
                    setTransferFromId('');
                    setTransferToId('');
                    setTransferAmount('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={submitTransfer}
                  disabled={!transferFromId || !transferToId || !transferAmount || parseFloat(transferAmount) <= 0}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}