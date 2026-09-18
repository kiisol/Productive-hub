import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@features/auth/useAuth';
import { t } from '@shared/i18n';
export default function Layout() {
    const { user, logout, isLoading } = useAuth();
    return (
        <div className="app-shell">
            <aside className="sidebar">
                <NavLink to="/tasks" className="brand">
                    <span className="brand-mark">
                        p<span>•</span>
                    </span>
                    productive<span className="brand-dot">.</span>
                </NavLink>
                <div className="workspace-label">
                    <span className="workspace-avatar">P</span>
                    <div>
                        {t('navigation.personalSpace')}
                        <small>{t('navigation.ideas')}</small>
                    </div>
                </div>
                <span className="nav-caption">{t('navigation.space')}</span>
                <nav>
                    <NavLink to="/dashboard">
                        <span>☀</span>
                        {t('navigation.myDay')}
                    </NavLink>
                    <NavLink to="/tasks">
                        <span>▤</span>
                        {t('navigation.tasks')}
                    </NavLink>
                </nav>
                <div className="sidebar-note">
                    <span>✧</span>
                    <strong>{t('navigation.roomForMore')}</strong>
                    <p>{t('navigation.clearMind')}</p>
                </div>
                <div className="profile">
                    <span className="avatar">{user?.email[0]?.toUpperCase() || 'P'}</span>
                    <div>
                        <strong>{user?.name || t('navigation.mySpace')}</strong>
                        <small title={user?.email}>{user?.email}</small>
                    </div>
                    <button
                        title={t('common.signOut')}
                        aria-label={t('common.signOut')}
                        disabled={isLoading}
                        onClick={() => void logout()}
                    >
                        ↪
                    </button>
                </div>
            </aside>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
