import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '@features/auth/useAuth';

export default function Layout() {
    const { user, logout, isLoading } = useAuth();

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: '100vh' }}>
            <aside style={{ padding: 18, borderRight: '1px dashed #193874' }}>
                <nav style={{ display: 'grid', gap: 12 }}>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/tasks">Tasks</Link>
                </nav>
                <hr />
                <div style={{ fontSize: 12 }}>
                    {user ? <>Signed in as <b>{user.email}</b></> : 'Not signed in'}
                </div>
                {user && (
                    <button onClick={() => logout()} disabled={isLoading} style={{ marginTop: 8 }}>
                        {isLoading ? '…' : 'Logout'}
                    </button>
                )}
            </aside>
            <main style={{ padding: 16 }}>
                <Outlet />
            </main>
        </div>
    );
}
