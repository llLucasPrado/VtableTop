const damageStates = ['', '/', '×'];

function TrackBoxes({ label, max, damage = [], onChange }) {
  function cycleDamage(index) {
    const currentState = damage[index] ?? '';
    const nextState = damageStates[(damageStates.indexOf(currentState) + 1) % 3];
    const updatedDamage = Array.from(
      { length: max },
      (_, damageIndex) => damage[damageIndex] ?? '',
    );
    updatedDamage[index] = nextState;
    onChange(updatedDamage);
  }

  return (
    <div>
      <div className="mb-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-400">
          {label}
        </p>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {Array.from({ length: max }, (_, index) => {
          const state = damage[index] ?? '';

          return (
            <button
              key={index}
              type="button"
              onClick={() => cycleDamage(index)}
              aria-label={`${label}, caixa ${index + 1}: ${
                state === '/' ? 'dano superficial' : state === '×' ? 'dano agravado' : 'sem dano'
              }`}
              className={`flex size-7 cursor-pointer items-center justify-center rounded border font-serif text-lg leading-none transition duration-200 hover:-translate-y-0.5 hover:border-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111] active:scale-90 ${
                state === '×'
                  ? 'border-red-500 bg-red-950/70 text-red-300 shadow-[0_0_10px_rgba(220,38,38,0.22)]'
                  : state === '/'
                    ? 'border-neutral-500 bg-neutral-800 text-neutral-100'
                    : 'border-neutral-700 bg-black/45 text-transparent'
              }`}
            >
              {state || '·'}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TrackBoxes;
