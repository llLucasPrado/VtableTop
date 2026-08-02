import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.jsx';

function Button({
  children,
  type = 'button',
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-[#a82020] to-[#721313] px-5 py-2.5 font-semibold text-white shadow-[0_8px_24px_rgba(69,10,10,0.35)] ring-1 ring-inset ring-red-500/25 transition duration-200 hover:-translate-y-0.5 hover:from-[#c12727] hover:to-[#881818] hover:shadow-[0_12px_32px_rgba(153,27,27,0.48)] hover:ring-red-400/40 active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-void disabled:pointer-events-none disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {isLoading && <LoadingSpinner />}
      {isLoading ? 'Entrando...' : children}
    </button>
  );
}

export default Button;
