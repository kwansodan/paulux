import { cn } from "@/lib/utils";

/**
 * Paulux logo lockup.
 *
 * The mark below is a tasteful PLACEHOLDER interpreting the brand deck — a
 * reclined outer curve (relaxed upper body / folded towel) cradling a small
 * circle (the client's head) with an inner spiral. Uses `currentColor`, so it
 * inherits the surrounding text color and themes automatically.
 *
 * To drop in the real artwork: place `logo.svg` in `frontend/public/` and
 * replace <PauluxMark/> with `<img src="/logo.svg" .../>`, or paste the real
 * SVG paths into PauluxMark.
 */
export function PauluxMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={cn("size-7", className)}
    >
      {/* reclined outer curve — upper body / towel fold */}
      <path
        d="M8 30c0-9.5 7.4-17 16.5-17C33 13 40 19 40 27.5c0 5-3.4 8.5-7.8 8.5-3.9 0-6.7-2.7-6.7-6.4 0-3.2 2.2-5.4 5.1-5.4"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* the client's head */}
      <circle cx="16.5" cy="21.5" r="3.4" fill="currentColor" />
    </svg>
  );
}

export function Logo({
  className,
  showWordmark = true,
  markClassName,
}: {
  className?: string;
  showWordmark?: boolean;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <PauluxMark className={markClassName} />
      {showWordmark && (
        <span className="font-serif text-xl font-medium tracking-tight">
          Paulux
        </span>
      )}
    </span>
  );
}
