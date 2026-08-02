function TraitDots({
  label,
  value,
  onChange,
  max = 5,
  min = 0,
  variant = 'default',
}) {
  function handleDotClick(dotValue) {
    onChange(dotValue === value && value > min ? value - 1 : dotValue);
  }

  const activeClasses = {
    default:
      'border-red-500 bg-red-700 shadow-[0_0_10px_rgba(220,38,38,0.35)]',
    hunger:
      'border-red-400 bg-gradient-to-br from-red-600 to-red-950 shadow-[0_0_11px_rgba(220,38,38,0.4)]',
    humanity:
      'border-neutral-100 bg-neutral-200 shadow-[0_0_9px_rgba(255,255,255,0.22)]',
  };

  return (
    <div className="flex min-w-0 items-center justify-between gap-3">
      {label && (
        <span className="truncate text-sm text-neutral-300">{label}</span>
      )}
      <div className="flex shrink-0 gap-1.5" role="group" aria-label={label}>
        {Array.from({ length: max }, (_, index) => {
          const dotValue = index + 1;
          const isActive = dotValue <= value;

          return (
            <button
              key={dotValue}
              type="button"
              onClick={() => handleDotClick(dotValue)}
              aria-label={`${label}: ${dotValue} ${dotValue === 1 ? 'ponto' : 'pontos'}`}
              aria-pressed={isActive}
              className={`size-3.5 cursor-pointer rounded-full border transition duration-200 hover:scale-125 hover:border-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111] active:scale-90 sm:size-4 ${
                isActive
                  ? activeClasses[variant]
                  : 'border-neutral-600 bg-black/60 hover:bg-red-950/45'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

export default TraitDots;

