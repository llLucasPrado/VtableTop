import { useState } from 'react';
import {
  ArrowLeftRight,
  Dices,
  Droplets,
  FileText,
  LogOut,
  ScrollText,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CharacterSheet from '../../components/Vampire/CharacterSheet.jsx';
import DiceRoller from '../../components/Vampire/DiceRoller.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { clearLocalSessionData } from '../../utils/auth.js';

const workspaceTabs = [
  { id: 'sheet', label: 'Ficha', icon: FileText },
  { id: 'dice', label: 'Dados', icon: Dices },
];

function VampireWorkspace() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('sheet');
  const [characterHunger, setCharacterHunger] = useState(1);

  async function handleLogout() {
    await signOut();
    clearLocalSessionData();
    navigate('/login', { replace: true });
  }

  return (
    <main
      data-theme="vampire-v5"
      className="relative isolate min-h-screen overflow-hidden bg-void text-parchment"
    >
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-30 bg-[radial-gradient(circle_at_88%_2%,var(--theme-glow),transparent_30%),radial-gradient(circle_at_8%_90%,rgba(69,10,10,0.12),transparent_30%),linear-gradient(150deg,#070606_0%,var(--theme-surface)_48%,#050505_100%)]"
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-20 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] [background-size:58px_58px] [mask-image:radial-gradient(circle_at_top,black,transparent_75%)]"
      />

      <header className="sticky top-0 z-40 border-b border-red-950/50 bg-[#070707]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-red-950 bg-red-950/35 text-red-500 shadow-[0_0_18px_rgba(127,29,29,0.13)]">
              <ScrollText className="size-5" strokeWidth={1.7} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-serif text-base font-bold tracking-[0.04em] text-neutral-100 sm:text-lg">
                Chronicle <span className="text-red-600">Table</span>
              </p>
              <p className="hidden text-[0.65rem] uppercase tracking-[0.18em] text-neutral-600 sm:block">
                Vampiro 5ED · Ficha de personagem
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/systems')}
              className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-neutral-800 bg-black/40 px-3 py-2 text-sm font-medium text-neutral-500 transition duration-200 hover:border-red-950 hover:bg-red-950/20 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700"
            >
              <ArrowLeftRight className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Trocar sistema</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-neutral-800 bg-black/40 px-3 py-2 text-sm font-medium text-neutral-500 transition duration-200 hover:border-red-950 hover:bg-red-950/20 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700"
            >
              <LogOut className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[90rem] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <section className="mb-6 overflow-hidden rounded-2xl border border-red-950/60 bg-[#0a0909]/90 shadow-[0_20px_60px_rgba(0,0,0,0.36)]">
          <div className="relative flex flex-col gap-5 px-5 py-6 sm:px-7 lg:flex-row lg:items-end lg:justify-between">
            <div
              aria-hidden="true"
              className="absolute -left-20 top-1/2 size-56 -translate-y-1/2 rounded-full bg-red-950/20 blur-3xl"
            />
            <div className="relative max-w-2xl">
              <div className="mb-3 flex items-center gap-2 text-red-500">
                <Droplets className="size-4" aria-hidden="true" />
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.22em]">
                  Mundo das Trevas
                </span>
              </div>
              <h1 className="font-serif text-2xl font-bold text-neutral-100 sm:text-3xl">
                Vampiro: A Máscara
              </h1>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Registre sua história, acompanhe a Besta e role os dados quando a
                noite exigir uma decisão.
              </p>
            </div>

            <nav
              className="relative flex rounded-xl border border-neutral-900 bg-black/40 p-1.5"
              aria-label="Seções de Vampiro"
              role="tablist"
            >
              {workspaceTabs.map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    aria-controls={`vampire-${id}-panel`}
                    aria-selected={isActive}
                    role="tab"
                    className={`relative inline-flex min-h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 lg:flex-none ${
                      isActive
                        ? 'bg-gradient-to-b from-red-800 to-red-950 text-white shadow-[0_7px_20px_rgba(127,29,29,0.3)]'
                        : 'text-neutral-500 hover:bg-white/[0.035] hover:text-neutral-200'
                    }`}
                  >
                    <Icon
                      className={`size-4 transition duration-300 ${isActive ? 'scale-110' : ''}`}
                      aria-hidden="true"
                    />
                    {label}
                  </button>
                );
              })}
            </nav>
          </div>
        </section>

        <div
          id="vampire-sheet-panel"
          role="tabpanel"
          hidden={activeTab !== 'sheet'}
        >
          <CharacterSheet onHungerChange={setCharacterHunger} />
        </div>
        <div
          id="vampire-dice-panel"
          role="tabpanel"
          hidden={activeTab !== 'dice'}
        >
          <DiceRoller hunger={characterHunger} />
        </div>

        <footer className="mx-auto mt-8 max-w-3xl border-t border-neutral-900 px-4 py-6 text-center text-[0.65rem] leading-5 text-neutral-700">
          Material de fã não oficial. Divirta-se durante a jogatina !
        </footer>
      </div>
    </main>
  );
}

export default VampireWorkspace;
