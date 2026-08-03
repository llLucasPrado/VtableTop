import { useState } from 'react';
import { Check, Eye, EyeOff, Flame, ScrollText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button.jsx';
import Input from '../../components/Input/Input.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { setAuthPersistence, supabase } from '../../lib/supabase.js';
import { validateLogin } from '../../utils/validation.js';

const initialValues = {
  email: import.meta.env.DEV ? import.meta.env.VITE_DEV_ACCOUNT_EMAIL || '' : '',
  password: import.meta.env.DEV
    ? import.meta.env.VITE_DEV_ACCOUNT_PASSWORD || ''
    : '',
  remember: false,
};

function getAuthErrorMessage(error, mode) {
  const message = error?.message?.toLowerCase() ?? '';

  if (message.includes('invalid login credentials')) {
    return 'E-mail ou senha incorretos.';
  }

  if (message.includes('email not confirmed')) {
    return 'Confirme seu e-mail antes de entrar.';
  }

  if (message.includes('user already registered')) {
    return 'Já existe uma conta cadastrada com este e-mail.';
  }

  if (message.includes('rate limit')) {
    return 'Muitas tentativas seguidas. Aguarde um momento e tente novamente.';
  }

  return mode === 'signup'
    ? 'Não foi possível criar sua conta. Tente novamente em instantes.'
    : 'Não foi possível realizar o login. Tente novamente em instantes.';
}

function Login() {
  const navigate = useNavigate();
  const { signInDev } = useAuth();
  const [authMode, setAuthMode] = useState('login');
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(event) {
    const { name, value, checked, type } = event.target;

    setValues((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((current) => {
        const updatedErrors = { ...current };
        delete updatedErrors[name];
        return updatedErrors;
      });
    }

    if (status?.type === 'error') {
      setStatus(null);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    const validationErrors = validateLogin(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setStatus({
        type: 'error',
        message: 'Revise os campos destacados antes de continuar.',
      });
      return;
    }

    setIsLoading(true);
    setStatus(null);

    try {
      if (
        authMode === 'login' &&
        signInDev(values.email, values.password, values.remember)
      ) {
        navigate('/systems', { replace: true });
        return;
      }

      setAuthPersistence(values.remember);

      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: values.email.trim(),
          password: values.password,
          options: {
            data: { name: values.email.trim().split('@')[0] },
            emailRedirectTo: `${window.location.origin}/systems`,
          },
        });

        if (error) {
          throw error;
        }

        if (!data.session) {
          setStatus({
            type: 'success',
            message:
              'Conta criada. Abra o e-mail de confirmação para concluir o cadastro.',
          });
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email.trim(),
          password: values.password,
        });

        if (error) {
          throw error;
        }
      }

      navigate('/systems', { replace: true });
    } catch (error) {
      setStatus({
        type: 'error',
        message: getAuthErrorMessage(error, authMode),
      });
    } finally {
      setIsLoading(false);
    }
  }

  function showComingSoon() {
    setStatus({
      type: 'info',
      message: 'Funcionalidade disponível em breve.',
    });
  }

  function toggleAuthMode() {
    setAuthMode((current) => (current === 'login' ? 'signup' : 'login'));
    setErrors({});
    setStatus(null);
  }

  return (
    <main
      data-theme="default"
      className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-void px-4 py-10 sm:px-6"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_50%_-15%,var(--theme-glow),transparent_42%),linear-gradient(145deg,#05070b_0%,var(--theme-surface)_50%,#030508_100%)]"
      />
      <div
        aria-hidden="true"
        className="ember-breathe absolute -top-48 left-1/2 -z-20 h-96 w-96 -translate-x-1/2 rounded-full bg-accent-deep/40 blur-[100px] sm:h-[34rem] sm:w-[34rem]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] [background-size:52px_52px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,0.78)_100%)]"
      />

      <section className="min-w-0 w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-3 text-accent">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-accent-strong" />
          <Flame className="size-4" strokeWidth={1.5} aria-hidden="true" />
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-accent-strong" />
        </div>

        <div className="relative min-w-0 overflow-hidden rounded-2xl border border-accent-deep/90 bg-charcoal/85 p-6 shadow-[0_26px_90px_rgba(0,0,0,0.72),0_0_45px_var(--theme-shadow)] backdrop-blur-xl transition duration-500 hover:border-accent-strong/80 hover:shadow-[0_28px_95px_rgba(0,0,0,0.76),0_0_52px_var(--theme-shadow)] sm:p-8">
          <div
            aria-hidden="true"
            className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-accent/80 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-24 size-52 rounded-full bg-accent-deep/15 blur-3xl"
          />

          <header className="relative mb-8 text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl border border-accent-strong/60 bg-gradient-to-br from-accent-deep/70 to-black/70 text-accent-soft shadow-[0_0_24px_var(--theme-shadow)]">
              <ScrollText className="size-6" strokeWidth={1.6} aria-hidden="true" />
            </div>
            <h1 className="font-serif text-2xl font-bold tracking-[0.06em] text-parchment sm:text-[2rem] sm:tracking-[0.08em]">
              Chronicle <span className="text-accent">Table</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-ash">
              Suas fichas, personagens e campanhas em um só lugar.
            </p>
          </header>

          <form className="relative min-w-0 space-y-5" onSubmit={handleSubmit} noValidate>
            {status && (
              <div
                role={status.type === 'error' ? 'alert' : 'status'}
                aria-live="polite"
                className={`rounded-lg border px-3.5 py-3 text-sm leading-5 ${
                  status.type === 'error'
                    ? 'border-red-900/70 bg-red-950/35 text-red-300'
                    : status.type === 'success'
                      ? 'border-emerald-900/70 bg-emerald-950/25 text-emerald-300'
                      : 'border-neutral-700 bg-neutral-900/80 text-neutral-300'
                }`}
              >
                {status.message}
              </div>
            )}

            <Input
              label="E-mail"
              name="email"
              type="email"
              value={values.email}
              placeholder="aventureiro@exemplo.com"
              error={errors.email}
              disabled={isLoading}
              onChange={handleChange}
              autoComplete="email"
            />

            <Input
              label="Senha"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              placeholder="Digite sua senha"
              error={errors.password}
              disabled={isLoading}
              onChange={handleChange}
              autoComplete="current-password"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={isLoading}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  aria-pressed={showPassword}
                  className="flex size-9 cursor-pointer items-center justify-center rounded-md border border-transparent text-neutral-500 transition duration-200 hover:border-accent-deep/80 hover:bg-accent-deep/35 hover:text-accent-soft hover:shadow-[0_0_12px_var(--theme-shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="size-[1.125rem]" aria-hidden="true" />
                  ) : (
                    <Eye className="size-[1.125rem]" aria-hidden="true" />
                  )}
                </button>
              }
            />

            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 text-sm">
              <label className="group flex cursor-pointer items-center gap-2.5 rounded-md py-1 text-neutral-400 transition-colors duration-200 hover:text-neutral-100">
                <input
                  type="checkbox"
                  name="remember"
                  checked={values.remember}
                  disabled={isLoading}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className="flex size-[1.125rem] shrink-0 items-center justify-center rounded-[0.3rem] border border-neutral-600 bg-black/55 shadow-inner transition duration-200 group-hover:border-accent-strong group-hover:bg-accent-deep/25 peer-checked:border-accent peer-checked:bg-gradient-to-br peer-checked:from-accent peer-checked:to-accent-deep peer-checked:shadow-[0_0_12px_var(--theme-shadow)] peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-charcoal peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-checked:[&_svg]:scale-100 peer-checked:[&_svg]:opacity-100"
                >
                  <Check
                    className="size-3 scale-75 text-white opacity-0 transition duration-150"
                    strokeWidth={3}
                  />
                </span>
                <span className="select-none">Lembrar de mim</span>
              </label>

              <button
                type="button"
                onClick={showComingSoon}
                className="cursor-pointer rounded-md px-1.5 py-1 text-neutral-400 underline decoration-neutral-700 underline-offset-4 transition duration-200 hover:bg-accent-deep/30 hover:text-accent-soft hover:decoration-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Esqueci minha senha
              </button>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              loadingLabel={authMode === 'signup' ? 'Criando conta...' : 'Entrando...'}
              disabled={isLoading}
              className="w-full"
            >
              {authMode === 'signup' ? 'Criar conta' : 'Entrar'}
            </Button>
          </form>

          <div className="relative mt-7 flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-neutral-800" />
            <span className="size-1 rotate-45 border border-accent-strong bg-accent-deep" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-neutral-800" />
          </div>

          <p className="relative mt-6 text-center text-sm text-neutral-500">
            {authMode === 'signup'
              ? 'Já possui uma conta?'
              : 'Ainda não possui uma conta?'}{' '}
            <button
              type="button"
              onClick={toggleAuthMode}
              className="cursor-pointer rounded-md px-1.5 py-1 font-medium text-accent-soft transition duration-200 hover:bg-accent-deep/35 hover:text-white hover:shadow-[0_0_12px_var(--theme-shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {authMode === 'signup' ? 'Entrar' : 'Criar conta'}
            </button>
          </p>
        </div>

        <p className="mt-5 text-center text-xs tracking-wide text-neutral-700">
          Chronicle Table · Forje histórias memoráveis
        </p>
      </section>
    </main>
  );
}

export default Login;
