import {
  BookOpenText,
  ChevronRight,
  Dices,
  LogOut,
  ScrollText,
  Shield,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clearAuth, getUser } from '../../utils/auth.js';

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
  const user = getUser();
  const userName = user?.name ?? 'Aventureiro';

  function handleLogout() {
    clearAuth();
    navigate('/login', { replace: true });
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-void text-parchment">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_85%_5%,rgba(127,29,29,0.18),transparent_32%),linear-gradient(150deg,#080808_0%,#0d0b0b_48%,#060606_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(circle_at_top_right,black,transparent_70%)]"
      />

      <header className="border-b border-neutral-900/90 bg-black/30 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-red-950 bg-red-950/30 text-red-500">
              <ScrollText className="size-5" strokeWidth={1.7} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-serif text-lg font-bold tracking-[0.06em]">
                Chronicle <span className="text-red-700">Table</span>
              </p>
              <p className="hidden text-xs text-neutral-600 sm:block">
                Seu salão de aventuras
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950/70 px-3.5 py-2 text-sm font-medium text-neutral-300 transition hover:border-red-950 hover:bg-red-950/20 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2 focus-visible:ring-offset-void"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sair
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section className="relative overflow-hidden rounded-2xl border border-neutral-900 bg-charcoal/70 px-6 py-8 shadow-[0_24px_70px_rgba(0,0,0,0.35)] sm:px-9 sm:py-10">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-28 size-72 rounded-full bg-red-950/20 blur-3xl"
          />
          <div className="relative max-w-2xl">
            <div className="mb-5 flex size-11 items-center justify-center rounded-xl border border-red-900/50 bg-red-950/30 text-red-400">
              <BookOpenText className="size-5" aria-hidden="true" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-700">
              O salão está aberto
            </p>
            <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              Bem-vindo, {userName}.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-ash sm:text-base">
              O painel de fichas e campanhas será desenvolvido nas próximas
              etapas. Por enquanto, sua autenticação e sessão já estão prontas
              para a jornada.
            </p>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="resources-title">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-800">
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
                  className="group relative overflow-hidden rounded-xl border border-iron bg-gradient-to-br from-[#181818] to-[#101010] p-5 transition duration-300 hover:-translate-y-1 hover:border-red-950 hover:shadow-[0_18px_38px_rgba(0,0,0,0.36),0_0_24px_rgba(127,29,29,0.07)]"
                >
                  <div
                    aria-hidden="true"
                    className="absolute -right-12 -top-12 size-32 rounded-full bg-red-950/0 blur-2xl transition duration-300 group-hover:bg-red-950/20"
                  />
                  <div className="relative flex items-start justify-between gap-4">
                    <span className="flex size-10 items-center justify-center rounded-lg border border-neutral-800 bg-black/30 text-red-700 transition group-hover:border-red-950 group-hover:text-red-500">
                      <Icon className="size-5" strokeWidth={1.7} aria-hidden="true" />
                    </span>
                    <ChevronRight
                      className="size-4 text-neutral-700 transition group-hover:translate-x-0.5 group-hover:text-red-800"
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
      className="hidden items-center gap-2 text-red-950 sm:flex"
      aria-hidden="true"
    >
      <span className="h-px w-10 bg-red-950" />
      <span className="size-1.5 rotate-45 border border-red-900" />
      <span className="h-px w-4 bg-red-950" />
    </div>
  );
}

export default Dashboard;

