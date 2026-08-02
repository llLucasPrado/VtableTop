import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.jsx';

function Button({
  children,
  type = 'button',
  isLoading = false,
  loadingLabel = 'Entrando...',
  disabled = false,
  onClick,
  className = '',
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-accent to-accent-strong px-5 py-2.5 font-semibold text-on-accent shadow-[0_8px_24px_var(--theme-shadow)] ring-1 ring-inset ring-accent-soft/25 transition duration-200 hover:-translate-y-0.5 hover:from-accent-soft hover:to-accent hover:shadow-[0_12px_32px_var(--theme-shadow-hover)] hover:ring-accent-soft/40 active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-void disabled:pointer-events-none disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {isLoading && <LoadingSpinner />}
      {isLoading ? loadingLabel : children}
    </button>
  );
}

export default Button;
