import { createClient } from '@supabase/supabase-js';

const SESSION_PREFERENCE_KEY = 'chronicleTableSessionPersistence';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY antes de iniciar a aplicação.',
  );
}

function safelyRead(storage, key) {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

const sessionStorageAdapter = {
  getItem(key) {
    return safelyRead(localStorage, key) ?? safelyRead(sessionStorage, key);
  },
  setItem(key, value) {
    const shouldRemember =
      safelyRead(localStorage, SESSION_PREFERENCE_KEY) === 'local';
    const targetStorage = shouldRemember ? localStorage : sessionStorage;
    const previousStorage = shouldRemember ? sessionStorage : localStorage;

    try {
      previousStorage.removeItem(key);
      targetStorage.setItem(key, value);
    } catch {
      // O Supabase informará a falha de persistência no fluxo de autenticação.
    }
  },
  removeItem(key) {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch {
      // A sessão remota ainda pode ser encerrada quando o storage está bloqueado.
    }
  },
};

export function setAuthPersistence(remember) {
  try {
    if (remember) {
      localStorage.setItem(SESSION_PREFERENCE_KEY, 'local');
    } else {
      localStorage.removeItem(SESSION_PREFERENCE_KEY);
    }
  } catch {
    // Sem Web Storage, a sessão continuará válida apenas enquanto estiver em memória.
  }
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    detectSessionInUrl: true,
    persistSession: true,
    storage: sessionStorageAdapter,
  },
});
