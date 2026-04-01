import { useEffect } from 'react';
import { useStore } from './store/useStore';
import Navbar from './components/Navbar';
import SummaryCards from './components/Dashboard/SummaryCards';
import BalanceChart from './components/Dashboard/BalanceChart';
import CategoryChart from './components/Dashboard/CategoryChart';
import TransactionsTable from './components/Dashboard/TransactionsTable';
import Insights from './components/Dashboard/Insights';
import { motion, type Variants } from 'framer-motion';

function App() {
  const { isDarkMode } = useStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div 
          className="flex flex-col gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Financial Overview</h1>
            <p className="text-muted-foreground">Track your spending, income, and overall balance.</p>
          </motion.div>

          {/* Cards */}
          <motion.div variants={itemVariants}>
            <SummaryCards />
          </motion.div>

          {/* Charts */}
          <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-3">
            <BalanceChart />
            <CategoryChart />
          </motion.div>

          {/* Insights */}
          <motion.div variants={itemVariants}>
            <Insights />
          </motion.div>

          {/* Transactions */}
          <motion.div variants={itemVariants}>
            <TransactionsTable />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

export default App;
