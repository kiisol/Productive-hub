import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '@features/auth/useAuth';

function ThemeSwitch() {
  return (
    <button
      onClick={() => document.documentElement.classList.toggle('dark')}
      className="text-sm px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700"
    >
      🌓 Theme
    </button>
  );
}

export default function Layout() {
  const { user, logout, isLoading } = useAuth();

  return (
    <div className="min-h-dvh grid grid-cols-[200px_1fr] bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <aside className="p-4 border-r border-gray-200 dark:border-gray-800 space-y-3">
        <nav className="grid gap-2">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/tasks" className="hover:underline">Tasks</Link>
        </nav>
        <ThemeSwitch />
        <div className="text-xs">
          {user ? <>Signed in as <b>{user.email}</b></> : 'Not signed in'}
        </div>
        {user && (
          <button onClick={() => logout()} disabled={isLoading} className="text-sm underline">
            {isLoading ? '…' : 'Logout'}
          </button>
        )}
      </aside>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
