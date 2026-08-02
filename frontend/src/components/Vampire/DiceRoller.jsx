import { useEffect, useMemo, useRef, useState } from 'react';
import { Dices, Flame, Minus, Plus, Sparkles } from 'lucide-react';
import { calculateV5Outcome } from '../../utils/vampireDice.js';
import D10Die from './D10Die.jsx';

function rollDice(amount) {
  return Array.from({ length: amount }, () => Math.floor(Math.random() * 10) + 1);
}

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

function DiceRoller() {
  const [pool, setPool] = useState(5);
  const [hunger, setHunger] = useState(1);
  const [difficulty, setDifficulty] = useState(1);
  const [result, setResult] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const rollTimer = useRef(null);

  useEffect(
    () => () => {
      window.clearTimeout(rollTimer.current);
    },
    [],
  );

  const normalDice = Math.max(pool - Math.min(hunger, pool), 0);
  const hungerDice = Math.min(hunger, pool);

  const outcome = useMemo(() => {
    if (!result) {
      return null;
    }

    return calculateV5Outcome(result.normal, result.hunger, difficulty);
  }, [difficulty, result]);

  function adjustPool(change) {
    setPool((current) => {
      const nextPool = Math.min(20, Math.max(1, current + change));
      setHunger((currentHunger) => Math.min(currentHunger, nextPool));
      return nextPool;
    });
  }

  function adjustHunger(change) {
    setHunger((current) =>
      Math.min(Math.min(5, pool), Math.max(0, current + change)),
    );
  }

  function handleRoll() {
    if (isRolling) {
      return;
    }

    setResult({
      normal: rollDice(normalDice),
      hunger: rollDice(hungerDice),
      rollId: (result?.rollId ?? 0) + 1,
    });
    setIsRolling(true);
    rollTimer.current = window.setTimeout(
      () => setIsRolling(false),
      prefersReducedMotion() ? 120 : 1250,
    );
  }

  const outcomeClasses = {
    success: 'border-neutral-700 bg-neutral-900/70 text-neutral-100',
    failure: 'border-neutral-800 bg-black/40 text-neutral-400',
    messy: 'border-red-800 bg-red-950/45 text-red-200',
    bestial: 'border-red-600 bg-red-950/65 text-red-200',
  };

  return (
    <section className="animate-sheet-enter mx-auto w-full max-w-5xl">
      <div className="relative overflow-hidden rounded-2xl border border-red-950/80 bg-[#0b0b0c]/95 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.5)] sm:p-8">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-32 size-80 rounded-full bg-red-950/25 blur-[90px]"
        />

        <header className="relative max-w-2xl">
          <div className="mb-4 flex size-11 items-center justify-center rounded-xl border border-red-900/60 bg-red-950/40 text-red-400">
            <Dices className="size-5" aria-hidden="true" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-700">
            Mesa de rolagem
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-neutral-100">
            Teste sua sorte contra a Fome
          </h2>
          <p className="mt-3 text-sm leading-6 text-neutral-500">
            A Fome substitui dados da parada. Dados comuns são brancos e Dados
            de Fome são vermelhos.
          </p>
        </header>

        <div className="relative mt-8 grid gap-4 sm:grid-cols-3">
          <Counter
            label="Parada total"
            value={pool}
            onDecrease={() => adjustPool(-1)}
            onIncrease={() => adjustPool(1)}
            detail={`${normalDice} normais`}
          />
          <Counter
            label="Fome"
            value={hunger}
            onDecrease={() => adjustHunger(-1)}
            onIncrease={() => adjustHunger(1)}
            detail={`${hungerDice} vermelhos`}
            accent
          />
          <Counter
            label="Dificuldade"
            value={difficulty}
            onDecrease={() => setDifficulty((value) => Math.max(1, value - 1))}
            onIncrease={() => setDifficulty((value) => Math.min(10, value + 1))}
            detail="sucessos necessários"
          />
        </div>

        <button
          type="button"
          onClick={handleRoll}
          disabled={isRolling}
          className="relative mt-6 inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-red-700 to-red-950 px-5 py-3 font-semibold text-white shadow-[0_10px_30px_rgba(127,29,29,0.32)] ring-1 ring-inset ring-red-500/25 transition duration-200 hover:-translate-y-0.5 hover:from-red-600 hover:to-red-900 hover:shadow-[0_14px_36px_rgba(153,27,27,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-void disabled:pointer-events-none disabled:opacity-70"
        >
          {isRolling ? (
            <Flame className="size-5 animate-pulse" aria-hidden="true" />
          ) : (
            <Dices className="size-5" aria-hidden="true" />
          )}
          {isRolling ? 'Os dados estão rolando...' : 'Rolar os dados'}
        </button>

        <div
          className={`dice-tray relative mt-8 min-h-48 rounded-xl border border-neutral-900 bg-black/35 p-4 transition sm:p-6 ${
            isRolling ? 'dice-tray--rolling' : ''
          }`}
          aria-busy={isRolling}
        >
          {!result ? (
            <div className="flex min-h-36 flex-col items-center justify-center text-center">
              <Sparkles className="size-6 text-neutral-700" aria-hidden="true" />
              <p className="mt-3 text-sm text-neutral-600">
                Os resultados aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="animate-result-reveal">
              <div className="flex flex-wrap justify-center gap-2.5 sm:gap-4">
                {result.normal.map((value, index) => (
                  <D10Die
                    key={`${result.rollId}-normal-${index}`}
                    value={value}
                    index={index}
                    isRolling={isRolling}
                  />
                ))}
                {result.hunger.map((value, index) => (
                  <D10Die
                    key={`${result.rollId}-hunger-${index}`}
                    value={value}
                    index={result.normal.length + index}
                    hunger
                    isRolling={isRolling}
                  />
                ))}
              </div>

              {outcome && !isRolling && (
                <div
                  className={`mx-auto mt-7 max-w-md rounded-xl border px-5 py-4 text-center ${outcomeClasses[outcome.tone]}`}
                  role="status"
                >
                  <p className="font-serif text-xl font-bold">{outcome.title}</p>
                  <p className="mt-1 text-sm opacity-75">
                    {outcome.successes}{' '}
                    {outcome.successes === 1 ? 'sucesso' : 'sucessos'} · margem{' '}
                    {outcome.margin >= 0 ? `+${outcome.margin}` : outcome.margin}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-neutral-600">
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-neutral-200" /> dado comum
          </span>
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-red-600" /> Dado de Fome
          </span>
          <span>6–10 contam como sucessos</span>
        </div>
      </div>
    </section>
  );
}

function Counter({
  label,
  value,
  onDecrease,
  onIncrease,
  detail,
  accent = false,
}) {
  return (
    <div
      className={`rounded-xl border p-4 transition duration-200 hover:-translate-y-0.5 ${
        accent
          ? 'border-red-950/80 bg-red-950/15 hover:border-red-900/80'
          : 'border-neutral-800 bg-neutral-950/65 hover:border-neutral-700'
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">
        {label}
      </p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <ControlButton label={`Diminuir ${label}`} onClick={onDecrease}>
          <Minus className="size-4" />
        </ControlButton>
        <span
          className={`font-serif text-3xl font-bold ${accent ? 'text-red-400' : 'text-neutral-100'}`}
        >
          {value}
        </span>
        <ControlButton label={`Aumentar ${label}`} onClick={onIncrease}>
          <Plus className="size-4" />
        </ControlButton>
      </div>
      <p className="mt-2 text-center text-[0.65rem] text-neutral-600">{detail}</p>
    </div>
  );
}

function ControlButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-neutral-800 bg-black/45 text-neutral-400 transition hover:border-red-900 hover:bg-red-950/30 hover:text-red-300 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
    >
      {children}
    </button>
  );
}

export default DiceRoller;
