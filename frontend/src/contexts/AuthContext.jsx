import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { supabase } from '../lib/supabase.js';

const AuthContext = createContext(null);
const DEV_SESSION_KEY = 'chronicleTableDevSession';

const devAccount = import.meta.env.DEV
  ? {
      email: import.meta.env.VITE_DEV_ACCOUNT_EMAIL,
      password: import.meta.env.VITE_DEV_ACCOUNT_PASSWORD,
      name: import.meta.env.VITE_DEV_ACCOUNT_NAME || 'Desenvolvedor',
    }
  : null;

function createDevUser() {
  if (!devAccount?.email || !devAccount?.password) {
    return null;
  }

  return {
    id: '00000000-0000-4000-8000-000000000001',
    email: devAccount.email,
    app_metadata: { provider: 'development' },
    user_metadata: { name: devAccount.name },
  };
}

function readDevSession() {
  if (!import.meta.env.DEV) {
    return null;
  }

  try {
    const isActive =
      localStorage.getItem(DEV_SESSION_KEY) === 'active' ||
      sessionStorage.getItem(DEV_SESSION_KEY) === 'active';

    return isActive ? createDevUser() : null;
  } catch {
    return null;
  }
}

function persistDevSession(remember) {
  try {
    localStorage.removeItem(DEV_SESSION_KEY);
    sessionStorage.removeItem(DEV_SESSION_KEY);
    (remember ? localStorage : sessionStorage).setItem(DEV_SESSION_KEY, 'active');
  } catch {
    // A conta ainda funciona em memória quando o Web Storage está bloqueado.
  }
}

function clearDevSession() {
  try {
    localStorage.removeItem(DEV_SESSION_KEY);
    sessionStorage.removeItem(DEV_SESSION_KEY);
  } catch {
    // Nada mais precisa ser feito quando o Web Storage está bloqueado.
  }
}

function getDisplayName(user) {
  return (
    user?.user_metadata?.name ??
    user?.user_metadata?.full_name ??
    user?.email?.split('@')[0] ??
    'Aventureiro'
  );
}

export function AuthProvider({ children }) {
  const initialDevUser = useRef(readDevSession()).current;
  const [devUser, setDevUser] = useState(initialDevUser);
  const [session, setSession] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(!initialDevUser);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (isMounted) {
        setSession(data.session ?? null);
        setIsAuthLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (isMounted) {
        setSession(nextSession);
        setIsAuthLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInDev = useCallback((email, password, remember) => {
    const normalizedEmail = email.trim().toLowerCase();
    const isValid =
      import.meta.env.DEV &&
      devAccount?.email &&
      devAccount?.password &&
      normalizedEmail === devAccount.email.toLowerCase() &&
      password === devAccount.password;

    if (!isValid) {
      return false;
    }

    persistDevSession(remember);
    setSession(null);
    setDevUser(createDevUser());
    setIsAuthLoading(false);
    return true;
  }, []);

  const signOut = useCallback(async () => {
    if (devUser) {
      clearDevSession();
      setDevUser(null);
      setSession(null);
      return { error: null };
    }

    return supabase.auth.signOut();
  }, [devUser]);

  const activeUser = devUser ?? session?.user ?? null;

  const value = useMemo(
    () => ({
      displayName: getDisplayName(activeUser),
      isAuthLoading,
      session,
      signInDev,
      signOut,
      user: activeUser,
    }),
    [activeUser, isAuthLoading, session, signInDev, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de AuthProvider.');
  }

  return context;
}
