import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialTransactions } from '../data/mockData';

export type Role = 'viewer' | 'admin';

export type TransactionCategory = 'Food' | 'Transport' | 'Shopping' | 'Entertainment' | 'Housing' | 'Utilities' | 'Salary' | 'Investment' | 'Other';
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: TransactionCategory;
  type: TransactionType;
  description: string;
}

interface AppState {
  role: Role;
  setRole: (role: Role) => void;
  
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      role: 'viewer',
      setRole: (role) => set({ role }),
      
      transactions: initialTransactions,
      addTransaction: (tx) => set((state) => ({ 
        transactions: [{ ...tx, id: crypto.randomUUID() }, ...state.transactions] 
      })),
      editTransaction: (id, tx) => set((state) => ({
        transactions: state.transactions.map((t) => (t.id === id ? { ...tx, id } : t))
      })),
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id)
      })),

      isDarkMode: false, // Default to light mode
      toggleDarkMode: () => set((state) => {
        const isDark = !state.isDarkMode;
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { isDarkMode: isDark };
      }),
    }),
    {
      name: 'fin-dash-storage',
      // skip hydrating classlist since we do it in App useEffect
    }
  )
);
