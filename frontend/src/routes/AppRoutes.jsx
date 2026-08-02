import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getSelectedSystem } from '../utils/auth.js';

const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard.jsx'));
const Login = lazy(() => import('../pages/Login/Login.jsx'));
const SystemSelection = lazy(
  () => import('../pages/SystemSelection/SystemSelection.jsx'),
);
const VampireWorkspace = lazy(
  () => import('../pages/VampireWorkspace/VampireWorkspace.jsx'),
);

function RouteFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-void text-sm text-neutral-500">
      Carregando Chronicle Table...
    </main>
  );
}

function LoginRoute() {
  const { isAuthLoading, user } = useAuth();

  if (isAuthLoading) {
    return null;
  }

  return user ? (
    <Navigate to="/systems" replace />
  ) : (
    <Login />
  );
}

function SelectedSystemRoute({ children }) {
  return getSelectedSystem() ? children : <Navigate to="/systems" replace />;
}

function VampireRoute() {
  return getSelectedSystem() === 'vampire-v5' ? (
    <VampireWorkspace />
  ) : (
    <Navigate to="/systems" replace />
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />
        <Route
          path="/systems"
          element={
            <ProtectedRoute>
              <SystemSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vampire"
          element={
            <ProtectedRoute>
              <VampireRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <SelectedSystemRoute>
                <Dashboard />
              </SelectedSystemRoute>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
