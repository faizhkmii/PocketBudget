'use client';

import { getWallet } from '@/utils/storage';
import { convertJPYtoMYRSync } from '@/utils/currency';

export default function Wallet() {
  const wallet = getWallet();

  const totalBalanceMYR = wallet.reduce((sum, account) => {
    const amount = account.currency === 'JPY' ? convertJPYtoMYRSync(account.balance) : account.balance;
    return sum + amount;
  }, 0);

  const totalCreditLimit = wallet
    .filter(account => account.type === 'credit')
    .reduce((sum, account) => sum + (account.limit || 0), 0);

  const totalCreditUsed = wallet
    .filter(account => account.type === 'credit')
    .reduce((sum, account) => sum + account.balance, 0);

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

        {/* Accounts List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-3">
              <span className="text-lg">🏦</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Your Accounts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wallet.map((account) => {
              const displayCurrency = account.id === 'maybank' || account.id === 'cimb' || account.id === 'hong-leong-wise' ? 'RM' :
                                     account.id === 'cash' ? 'JPY' : 'JPY'; // cash is JPY, rhb is JPY
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
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Balance</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {account.id === 'rhb-multi' ? `RM 0 & JPY ${account.balance.toLocaleString()}` :
                         `${displayCurrency} ${displayBalance.toLocaleString()}`}
                      </span>
                    </div>
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
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}