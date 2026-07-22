/**
 * The Starlite angular star — the site's recurring visual signature. Reused (small,
 * deliberately) across the logo, section markers, active nav state, badges, loading
 * states and quote reference chips so the interface reads as Starlite even without
 * the full wordmark in view.
 */
export function StarMark({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2.5l2.32 6.02a1 1 0 0 0 .58.58L21 11l-6.1 2.4a1 1 0 0 0-.58.58L12 21.5l-2.32-7.52a1 1 0 0 0-.58-.58L3 11l6.1-2.4a1 1 0 0 0 .58-.58L12 2.5z" />
    </svg>
  );
}
