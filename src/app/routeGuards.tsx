import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@features/auth/useAuth';


export function PrivateRoute() {
    const { token } = useAuth();
    return token ? <Outlet /> : <Navigate to="/login" replace />;
}
export function PublicOnlyRoute() {
    const { token } = useAuth();
    return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
}