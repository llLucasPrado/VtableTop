import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthLoading, user } = useAuth();

  if (isAuthLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-void text-neutral-400">
        <div className="flex items-center gap-3 text-sm">
          <LoadingSpinner />
          Verificando sua sessão...
        </div>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
