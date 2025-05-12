
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

export type Transaction = {
  id: string;
  amount: number;
  type: 'expense' | 'income';
  category: string;
  description: string;
  date: string;
};

type WalletContextType = {
  balance: number;
  transactions: Transaction[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateBalance: (newBalance: number) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
};

const defaultCategories: Category[] = [
  { id: '1', name: 'Food', color: '#F44336', icon: 'category' },
  { id: '2', name: 'Transport', color: '#2196F3', icon: 'category' },
  { id: '3', name: 'Bills', color: '#FFC107', icon: 'category' },
  { id: '4', name: 'Shopping', color: '#9C27B0', icon: 'category' },
  { id: '5', name: 'Entertainment', color: '#4CAF50', icon: 'category' },
  { id: '6', name: 'Health', color: '#00BCD4', icon: 'category' },
  { id: '7', name: 'Salary', color: '#4CAF50', icon: 'dollar-sign' },
  { id: '8', name: 'Other Income', color: '#8BC34A', icon: 'dollar-sign' },
];

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState<number>(5000);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedBalance = localStorage.getItem('wallet_balance');
    const storedTransactions = localStorage.getItem('wallet_transactions');
    const storedCategories = localStorage.getItem('wallet_categories');

    if (storedBalance) setBalance(JSON.parse(storedBalance));
    if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
    if (storedCategories) setCategories(JSON.parse(storedCategories));
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('wallet_balance', JSON.stringify(balance));
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('wallet_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('wallet_categories', JSON.stringify(categories));
  }, [categories]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substring(2, 9),
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    
    // Update balance
    if (transaction.type === 'expense') {
      setBalance((prev) => prev - transaction.amount);
    } else {
      setBalance((prev) => prev + transaction.amount);
    }
  };

  const deleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    
    if (transaction) {
      // Revert the balance change
      if (transaction.type === 'expense') {
        setBalance((prev) => prev + transaction.amount);
      } else {
        setBalance((prev) => prev - transaction.amount);
      }
      
      setTransactions((prev) => prev.filter(t => t.id !== id));
    }
  };

  const updateBalance = (newBalance: number) => {
    setBalance(newBalance);
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = {
      ...category,
      id: Math.random().toString(36).substring(2, 9),
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter(c => c.id !== id));
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        categories,
        addTransaction,
        deleteTransaction,
        updateBalance,
        addCategory,
        deleteCategory,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  
  return context;
};
