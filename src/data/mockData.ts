import type { Transaction } from '../store/useStore';

export const initialTransactions: Transaction[] = [
  {
    id: '1',
    date: '2026-03-25T10:00:00Z',
    amount: 5200,
    category: 'Salary',
    type: 'income',
    description: 'Tech Corp Monthly Salary'
  },
  {
    id: '2',
    date: '2026-03-26T14:30:00Z',
    amount: 150,
    category: 'Food',
    type: 'expense',
    description: 'Groceries at Whole Foods'
  },
  {
    id: '3',
    date: '2026-03-27T09:15:00Z',
    amount: 1200,
    category: 'Housing',
    type: 'expense',
    description: 'Rent Payment'
  },
  {
    id: '4',
    date: '2026-03-28T18:45:00Z',
    amount: 85,
    category: 'Entertainment',
    type: 'expense',
    description: 'Movie Tickets & Snacks'
  },
  {
    id: '5',
    date: '2026-03-29T11:20:00Z',
    amount: 45,
    category: 'Transport',
    type: 'expense',
    description: 'Uber Ride'
  },
  {
    id: '6',
    date: '2026-03-30T16:00:00Z',
    amount: 320,
    category: 'Shopping',
    type: 'expense',
    description: 'New Headphones'
  },
  {
    id: '7',
    date: '2026-03-31T08:00:00Z',
    amount: 120,
    category: 'Utilities',
    type: 'expense',
    description: 'Electricity Bill'
  },
  {
    id: '8',
    date: '2026-04-01T12:00:00Z',
    amount: 800,
    category: 'Investment',
    type: 'expense',
    description: 'Vanguard Index Fund'
  },
  {
    id: '9',
    date: '2026-04-02T19:30:00Z',
    amount: 60,
    category: 'Food',
    type: 'expense',
    description: 'Dinner at Italian Restaurant'
  },
  {
    id: '10',
    date: '2026-04-03T10:00:00Z',
    amount: 350,
    category: 'Other',
    type: 'income',
    description: 'Sold old bicycle'
  },
  {
    id: '11',
    date: '2026-04-04T13:00:00Z',
    amount: 55,
    category: 'Food',
    type: 'expense',
    description: 'Coffee and Sandwiches'
  },
  {
    id: '12',
    date: '2026-04-05T09:00:00Z',
    amount: 200,
    category: 'Investment',
    type: 'expense',
    description: 'Crypto DCA'
  },
  {
    id: '13',
    date: '2026-04-05T16:20:00Z',
    amount: 1500,
    category: 'Other',
    type: 'income',
    description: 'Freelance Design Work'
  },
  {
    id: '14',
    date: '2026-04-06T18:00:00Z',
    amount: 90,
    category: 'Shopping',
    type: 'expense',
    description: 'Amazon Purchase'
  },
  {
    id: '15',
    date: '2026-04-07T08:30:00Z',
    amount: 400,
    category: 'Utilities',
    type: 'expense',
    description: 'Internet & Phone Bill'
  }
];
