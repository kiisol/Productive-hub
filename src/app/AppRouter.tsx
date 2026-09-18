import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import Layout from './Layout';
import { PrivateRoute, PublicOnlyRoute } from './routeGuards';

const LoginPage = lazy(() => import('@pages/LoginPage'));
const DashboardPage = lazy(() => import('@pages/DashboardPage'));
const TasksPage = lazy(() => import('@pages/TasksPage'));
const NotFoundPage = lazy(() => import('@pages/NotFoundPage'));

const router = createBrowserRouter([
    {
        element: <PublicOnlyRoute />,
        children: [
            { path: '/login', element: <LoginPage /> },
        ],
    },
    {
        element: <PrivateRoute />,
        children: [
            {
                element: <Layout />,
                children: [
                    { path: '/', element: <DashboardPage /> },
                    { path: '/dashboard', element: <DashboardPage /> },
                    { path: '/tasks', element: <TasksPage /> },
                ],
            },
        ],
    },
    { path: '*', element: <NotFoundPage /> },
]);



export function AppRouter() {
    return (
        <ErrorBoundary fallback={<div>App crashed</div>}>
            <Suspense fallback={<div>Loading…</div>}>
                <RouterProvider router={router} />
            </Suspense>
        </ErrorBoundary>
    );
}