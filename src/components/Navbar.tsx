import { useStore } from '../store/useStore';
import { Moon, Sun, Wallet } from 'lucide-react';

export default function Navbar() {
  const { isDarkMode, toggleDarkMode, role, setRole } = useStore();

  return (
    <nav className="border-b bg-card text-card-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">FinDash</span>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'viewer' | 'admin')}
              className="rounded-md border bg-background px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="viewer">Viewer Mode</option>
              <option value="admin">Admin Mode</option>
            </select>

            <button
              onClick={toggleDarkMode}
              className="rounded-full p-2 hover:bg-muted transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
