function Input({
  label,
  name,
  type = 'text',
  value,
  placeholder,
  error,
  disabled = false,
  onChange,
  autoComplete,
  rightElement,
}) {
  const errorId = `${name}-error`;
  const inputClasses = error
    ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/25'
    : 'border-iron hover:border-neutral-600 focus:border-blood focus:ring-blood/25';

  return (
    <div className="group">
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-neutral-200 transition-colors duration-200 group-focus-within:text-red-300"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`min-h-12 w-full rounded-lg border bg-black/35 px-4 py-3 text-[0.9375rem] text-parchment outline-none transition duration-200 placeholder:text-neutral-600 hover:bg-black/45 focus:bg-black/50 focus:ring-4 disabled:cursor-not-allowed disabled:bg-neutral-900/80 disabled:text-neutral-500 ${rightElement ? 'pr-12' : ''} ${inputClasses}`}
        />

        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
