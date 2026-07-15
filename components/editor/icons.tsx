/**
 * Tiny inline SVG icons for the editor chrome. Kept in-repo so Frosted Moon
 * stays dependency-light (no icon library). All inherit `currentColor` and take
 * an optional className.
 */

type P = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function ImageIcon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-4.5-4.5L5 21" />
    </svg>
  );
}

export function PlusIcon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function TrashIcon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V6" />
    </svg>
  );
}

export function ChevronUpIcon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function CheckIcon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function AlertIcon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}

export function ArrowLeftIcon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

export function SpinnerIcon({ className }: P) {
  return (
    <svg {...base} className={className} style={{ animation: "fm-spin 0.8s linear infinite" }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

export function BoldIcon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z" />
    </svg>
  );
}

export function ItalicIcon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M19 4h-9M14 20H5M15 4 9 20" />
    </svg>
  );
}

export function UnderlineIcon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M6 4v6a6 6 0 0 0 12 0V4M4 21h16" />
    </svg>
  );
}

export function EraserIcon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="m7 21-4.3-4.3a1 1 0 0 1 0-1.4l9.6-9.6a1 1 0 0 1 1.4 0l5.6 5.6a1 1 0 0 1 0 1.4L13 21M22 21H7M5 12l5 5" />
    </svg>
  );
}
