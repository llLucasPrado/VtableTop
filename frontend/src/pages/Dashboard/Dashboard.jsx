import {
  BookOpenText,
  ChevronRight,
  Dices,
  LogOut,
  RefreshCw,
  ScrollText,
  Shield,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSystemById } from '../../config/systems.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { clearLocalSessionData, getSelectedSystem } from '../../utils/auth.js';

const dashboardCards = [
  {
    title: 'Fichas de personagens',
    description: 'Crie e organize heróis, atributos e histórias.',
    icon: Shield,
    eyebrow: 'Personagens',
  },
  {
    title: 'Campanhas',
    description: 'Reúna seus grupos e acompanhe cada jornada.',
    icon: Users,
    eyebrow: 'Aventuras',
  },
  {
    title: 'Rolagem de dados',
    description: 'Role dados e registre os momentos decisivos.',
    icon: Dices,
    eyebrow: 'Ferramentas',
  },
];

function Dashboard() {
  const navigate = useNavigate();
  const { displayName: userName, signOut } = useAuth();
  const selectedSystem = getSystemById(getSelectedSystem());

  async function handleLogout() {
    await signOut();
    clearLocalSessionData();
    navigate('/login', { replace: true });
  }

  function handleChangeSystem() {
    navigate('/systems');
  }

  return (
    <main
      data-theme={selectedSystem?.id ?? 'default'}
      className="relative isolate min-h-screen overflow-hidden bg-void text-parchment"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_85%_5%,var(--theme-glow),transparent_32%),linear-gradient(150deg,#080808_0%,var(--theme-surface)_48%,#060606_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(circle_at_top_right,black,transparent_70%)]"
      />

      <header className="border-b border-neutral-900/90 bg-black/30 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-accent-deep bg-accent-deep/30 text-accent-soft">
              <ScrollText className="size-5" strokeWidth={1.7} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-serif text-lg font-bold tracking-[0.06em]">
                Chronicle <span className="text-accent">Table</span>
              </p>
              <p className="hidden text-xs text-neutral-600 sm:block">
                Seu salão de aventuras
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleChangeSystem}
              className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950/70 px-3 py-2 text-sm font-medium text-neutral-400 transition duration-200 hover:border-accent-deep hover:bg-accent-deep/25 hover:text-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-void"
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Trocar sistema</span>
              <span className="sm:hidden">Trocar</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950/70 px-3.5 py-2 text-sm font-medium text-neutral-300 transition duration-200 hover:border-accent-deep hover:bg-accent-deep/20 hover:text-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-void"
            >
              <LogOut className="size-4" aria-hidden="true" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section className="relative overflow-hidden rounded-2xl border border-neutral-900 bg-charcoal/70 px-6 py-8 shadow-[0_24px_70px_rgba(0,0,0,0.35)] sm:px-9 sm:py-10">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-28 size-72 rounded-full bg-accent-deep/20 blur-3xl"
          />
          <div className="relative max-w-2xl">
            <div className="mb-5 flex size-11 items-center justify-center rounded-xl border border-accent-strong/50 bg-accent-deep/30 text-accent-soft">
              <BookOpenText className="size-5" aria-hidden="true" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              {selectedSystem?.name ?? 'Sistema selecionado'}
            </p>
            <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              Bem-vindo, {userName}.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-ash sm:text-base">
              O painel de fichas e campanhas de{' '}
              {selectedSystem?.name ?? 'RPG'} será desenvolvido nas próximas
              etapas. Sua autenticação, sessão e escolha de sistema já estão
              prontas para a jornada.
            </p>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="resources-title">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-strong">
                Em preparação
              </p>
              <h2
                id="resources-title"
                className="mt-2 text-xl font-semibold text-neutral-100"
              >
                Recursos do seu grimório
              </h2>
            </div>
            <Flourish />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {dashboardCards.map(
              ({ title, description, icon: Icon, eyebrow }) => (
                <article
                  key={title}
                  className="group relative overflow-hidden rounded-xl border border-iron bg-gradient-to-br from-[#181818] to-[#101010] p-5 transition duration-300 hover:-translate-y-1 hover:border-accent-deep hover:shadow-[0_18px_38px_rgba(0,0,0,0.36),0_0_24px_var(--theme-shadow)]"
                >
                  <div
                    aria-hidden="true"
                    className="absolute -right-12 -top-12 size-32 rounded-full bg-accent-deep/0 blur-2xl transition duration-300 group-hover:bg-accent-deep/20"
                  />
                  <div className="relative flex items-start justify-between gap-4">
                    <span className="flex size-10 items-center justify-center rounded-lg border border-neutral-800 bg-black/30 text-accent-strong transition group-hover:border-accent-deep group-hover:text-accent-soft">
                      <Icon className="size-5" strokeWidth={1.7} aria-hidden="true" />
                    </span>
                    <ChevronRight
                      className="size-4 text-neutral-700 transition group-hover:translate-x-0.5 group-hover:text-accent-strong"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="relative mt-5 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-neutral-600">
                    {eyebrow}
                  </p>
                  <h3 className="relative mt-1.5 font-semibold text-neutral-100">
                    {title}
                  </h3>
                  <p className="relative mt-2 text-sm leading-6 text-neutral-500">
                    {description}
                  </p>
                </article>
              ),
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Flourish() {
  return (
    <div
      className="hidden items-center gap-2 text-accent-deep sm:flex"
      aria-hidden="true"
    >
      <span className="h-px w-10 bg-accent-deep" />
      <span className="size-1.5 rotate-45 border border-accent-strong" />
      <span className="h-px w-4 bg-accent-deep" />
    </div>
  );
}

export default Dashboard;
