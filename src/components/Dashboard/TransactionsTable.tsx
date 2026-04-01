import { useState, useMemo } from 'react';
import { useStore, type TransactionType, type TransactionCategory, type Transaction } from '../../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { format, parseISO } from 'date-fns';
import { ArrowDownRight, ArrowUpRight, Search, Plus, Download, Edit2, Trash2, X } from 'lucide-react';

export default function TransactionsTable() {
  const { transactions, role, addTransaction, editTransaction, deleteTransaction } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<TransactionCategory | 'all'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Other' as TransactionCategory,
    type: 'expense' as TransactionType,
    date: new Date().toISOString().split('T')[0]
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
      return matchesSearch && matchesType && matchesCategory;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, filterType, filterCategory]);

  const handleExportCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => 
        `"${format(parseISO(t.date), 'yyyy-MM-dd')}","${t.description}","${t.category}","${t.type}","${t.amount}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transactions.csv';
    link.click();
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(filteredTransactions, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transactions.json';
    link.click();
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      description: '',
      amount: '',
      category: 'Other',
      type: 'expense',
      date: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const openEditModal = (tx: Transaction) => {
    setEditingId(tx.id);
    setFormData({
      description: tx.description,
      amount: tx.amount.toString(),
      category: tx.category,
      type: tx.type,
      date: tx.date.split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    const txData = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      date: new Date(formData.date).toISOString()
    };

    if (editingId) {
      editTransaction(editingId, txData);
    } else {
      addTransaction(txData);
    }
    setIsModalOpen(false);
  };

  return (
    <Card className="col-span-1 md:col-span-3">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <CardTitle>Recent Transactions</CardTitle>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button 
            onClick={handleExportCSV}
            className="flex flex-1 sm:flex-none justify-center items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            <Download className="h-4 w-4" /> CSV
          </button>
          <button 
            onClick={handleExportJSON}
            className="flex flex-1 sm:flex-none justify-center items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            <Download className="h-4 w-4" /> JSON
          </button>

          {role === 'admin' && (
            <button 
              onClick={openAddModal}
              className="flex flex-1 sm:flex-none justify-center items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex flex-row gap-2 w-full sm:w-auto">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="flex-1 sm:flex-none rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className="flex-1 sm:flex-none rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Categories</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Housing">Housing</option>
              <option value="Utilities">Utilities</option>
              <option value="Salary">Salary</option>
              <option value="Investment">Investment</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Mobile View: Cards */}
        <div className="md:hidden flex flex-col gap-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border rounded-md">
              No transactions found.
            </div>
          ) : (
            filteredTransactions.map(tx => (
              <div key={tx.id} className="border rounded-md p-4 flex flex-col gap-2 relative bg-card">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-base">{tx.description}</h4>
                    <p className="text-xs text-muted-foreground">{format(parseISO(tx.date), 'MMM dd, yyyy')}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`font-semibold flex items-center ${tx.type === 'income' ? 'text-green-500' : 'text-foreground'}`}>
                      {tx.type === 'income' ? <ArrowUpRight className="h-3 w-3 mr-0.5"/> : <ArrowDownRight className="h-3 w-3 mr-0.5 text-destructive"/>}
                      ${tx.amount.toLocaleString()}
                    </span>
                    <span className="mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium text-muted-foreground bg-muted/50">
                      {tx.category}
                    </span>
                  </div>
                </div>
                {role === 'admin' && (
                  <div className="flex justify-end gap-3 mt-2 pt-2 border-t">
                    <button onClick={() => openEditModal(tx)} className="text-primary flex items-center gap-1 text-sm"><Edit2 className="h-3 w-3" /> Edit</button>
                    <button onClick={() => deleteTransaction(tx.id)} className="text-destructive flex items-center gap-1 text-sm"><Trash2 className="h-3 w-3" /> Delete</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block rounded-md border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Description</th>
                <th className="px-4 py-3 text-left font-medium">Category</th>
                <th className="px-4 py-3 text-right font-medium">Amount</th>
                {role === 'admin' && <th className="px-4 py-3 text-right font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={role === 'admin' ? 5 : 4} className="px-4 py-8 text-center text-muted-foreground">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">
                      {format(parseISO(tx.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-4 py-3 font-medium">{tx.description}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium">
                      <div className="flex items-center justify-end gap-1">
                        {tx.type === 'income' ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-destructive" />
                        )}
                        <span className={tx.type === 'income' ? 'text-green-500' : ''}>
                          ${tx.amount.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    {role === 'admin' && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditModal(tx)} className="text-primary hover:text-primary/80 transition-colors p-1" title="Edit">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button onClick={() => deleteTransaction(tx.id)} className="text-destructive hover:text-destructive/80 transition-colors p-1" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card w-full max-w-md rounded-xl p-6 shadow-lg border border-border relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit Transaction' : 'Add Transaction'}</h3>
            
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input 
                  required
                  type="text" 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full border rounded-md px-3 py-2 bg-background focus:ring-2 focus:ring-primary outline-none"
                  placeholder="e.g., Groceries"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Amount ($)</label>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                    className="w-full border rounded-md px-3 py-2 bg-background focus:ring-2 focus:ring-primary outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input 
                    required
                    type="date" 
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full border rounded-md px-3 py-2 bg-background focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as TransactionType})}
                    className="w-full border rounded-md px-3 py-2 bg-background focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as TransactionCategory})}
                    className="w-full border rounded-md px-3 py-2 bg-background focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Housing">Housing</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Salary">Salary</option>
                    <option value="Investment">Investment</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-muted"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
                >
                  {editingId ? 'Save Changes' : 'Add Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
}
