// Decorative Japanese motifs — waves (seigaiha-inspired) and a hand-drawn
// circle (ensō) — used as subtle brand accents per the brief's brand notes
// ("японски мотиви като вълни/кръгове като декоративни елементи").

export function WaveDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M0 30c50 20 100 20 150 0s100-20 150 0 100 20 150 0 100-20 150 0 100 20 150 0 100-20 150 0 100 20 150 0 100-20 150 0v30H0z"
        fill="currentColor"
      />
    </svg>
  );
}

export function EnsoCircle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <path
        d="M100 20c44 0 80 36 80 80s-36 80-80 80c-38 0-70-27-78-63"
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  );
}
