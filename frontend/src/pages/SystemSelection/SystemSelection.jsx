import {
  ArrowRight,
  Dices,
  Droplets,
  LogOut,
  ScrollText,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RPG_SYSTEMS } from '../../config/systems.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { clearLocalSessionData, saveSelectedSystem } from '../../utils/auth.js';

const systemVisuals = {
  'vampire-v5': {
    icon: Droplets,
    badge: 'V5',
    iconClass: 'border-red-900/70 bg-red-950/50 text-red-400',
    glowClass: 'bg-red-900/25',
    actionClass: 'text-red-500 group-hover:text-red-400',
    focusClass: 'focus-visible:ring-red-700',
    hoverClass:
      'hover:border-red-800/80 hover:shadow-[0_22px_55px_rgba(0,0,0,0.48),0_0_30px_rgba(153,27,27,0.11)]',
  },
  'dnd-5e': {
    icon: Dices,
    badge: '5E',
    iconClass: 'border-amber-900/60 bg-amber-950/30 text-amber-500',
    glowClass: 'bg-amber-900/15',
    actionClass: 'text-amber-600 group-hover:text-amber-400',
    focusClass: 'focus-visible:ring-amber-600',
    hoverClass:
      'hover:border-amber-900/70 hover:shadow-[0_22px_55px_rgba(0,0,0,0.48),0_0_30px_rgba(120,53,15,0.1)]',
  },
};

function SystemSelection() {
  const navigate = useNavigate();
  const { displayName, signOut } = useAuth();

  function handleSelect(system) {
    saveSelectedSystem(system.id);
    navigate(system.path);
  }

  async function handleLogout() {
    await signOut();
    clearLocalSessionData();
    navigate('/login', { replace: true });
  }

  return (
    <main
      data-theme="default"
      className="relative isolate flex min-h-screen flex-col overflow-hidden bg-void text-parchment"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_50%_5%,var(--theme-glow),transparent_36%),linear-gradient(145deg,#05070b_0%,var(--theme-surface)_52%,#030508_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] [background-size:58px_58px] [mask-image:radial-gradient(circle_at_center,black,transparent_76%)]"
      />
      <div
        aria-hidden="true"
        className="ember-breathe absolute left-1/2 top-1/3 -z-10 size-[32rem] -translate-x-1/2 rounded-full bg-accent-deep/20 blur-[120px]"
      />

      <header className="border-b border-[#111827] bg-[#03060c]/90 backdrop-blur-lg">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-accent-deep bg-accent-deep/30 text-accent-soft">
              <ScrollText className="size-5" strokeWidth={1.7} aria-hidden="true" />
            </span>
            <p className="truncate font-serif text-lg font-bold tracking-[0.06em]">
              Chronicle <span className="text-accent">Table</span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-[#1b202a] bg-[#07090d] px-3.5 py-2 text-sm font-medium text-neutral-500 shadow-[0_6px_18px_rgba(0,0,0,0.28)] transition duration-200 hover:border-[#26334d] hover:bg-[#0a1020] hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-void"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sair
          </button>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-xl border border-accent-strong/50 bg-gradient-to-br from-accent-deep/60 to-black/70 text-accent-soft shadow-[0_0_28px_var(--theme-shadow)]">
            <Sparkles className="size-5" strokeWidth={1.7} aria-hidden="true" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            Bem-vindo, {displayName}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-neutral-100 sm:text-4xl">
            Escolha seu sistema
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-ash sm:text-base">
            Selecione o universo da sua próxima ficha. Você poderá trocar de
            sistema quando quiser.
          </p>
        </header>

        <div className="mt-9 grid gap-5 md:grid-cols-2">
          {RPG_SYSTEMS.map((system) => {
            const visual = systemVisuals[system.id];
            const Icon = visual.icon;

            return (
              <button
                key={system.id}
                type="button"
                onClick={() => handleSelect(system)}
                className={`group relative min-h-64 cursor-pointer overflow-hidden rounded-2xl border border-[#1b202a] bg-[#07090d] p-6 text-left shadow-[0_18px_48px_rgba(0,0,0,0.48)] transition duration-300 hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-void active:translate-y-0 ${visual.focusClass} ${visual.hoverClass}`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute -right-14 -top-16 size-48 rounded-full opacity-0 blur-3xl transition duration-500 group-hover:opacity-100 ${visual.glowClass}`}
                />
                <span className="relative flex items-start justify-between gap-4">
                  <span
                    className={`flex size-12 items-center justify-center rounded-xl border shadow-inner transition duration-300 group-hover:scale-105 ${visual.iconClass}`}
                  >
                    <Icon className="size-6" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <span className="rounded-full border border-neutral-800 bg-black/35 px-2.5 py-1 text-[0.625rem] font-bold tracking-[0.18em] text-neutral-500 transition group-hover:border-neutral-700 group-hover:text-neutral-300">
                    {visual.badge}
                  </span>
                </span>

                <span className="relative mt-8 block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600 transition group-hover:text-neutral-500">
                  {system.universe}
                </span>
                <span className="relative mt-2 block font-serif text-2xl font-bold text-neutral-100">
                  {system.name}
                </span>
                <span className="relative mt-3 block max-w-sm text-sm leading-6 text-neutral-500 transition group-hover:text-neutral-400">
                  {system.description}
                </span>

                <span
                  className={`relative mt-6 flex items-center gap-2 text-sm font-semibold opacity-80 transition group-hover:gap-3 group-hover:opacity-100 ${visual.actionClass}`}
                >
                  Selecionar sistema
                  <ArrowRight
                    className="size-4 transition group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-7 text-center text-xs tracking-wide text-neutral-700">
          Novos sistemas serão adicionados futuramente.
        </p>
      </section>
    </main>
  );
}

export default SystemSelection;
