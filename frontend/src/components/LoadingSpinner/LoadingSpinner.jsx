function LoadingSpinner({ className = 'size-4' }) {
  return (
    <span
      aria-hidden="true"
      className={`${className} inline-block animate-spin rounded-full border-2 border-current border-r-transparent`}
    />
  );
}

export default LoadingSpinner;

