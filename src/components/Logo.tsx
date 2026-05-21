export default function Logo({ size = 60 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 72 100">
      <defs>
        <clipPath id="pinClip">
          <path d="M36 0 C16 0 0 16 0 36 C0 56 36 100 36 100 C36 100 72 56 72 36 C72 16 56 0 36 0 Z"/>
        </clipPath>
      </defs>
      <path d="M36 0 C16 0 0 16 0 36 C0 56 36 100 36 100 C36 100 72 56 72 36 C72 16 56 0 36 0 Z" fill="#EA580C"/>
      <path d="M36 4 C18 4 4 18 4 36 C4 54 36 94 36 94 C36 94 68 54 68 36 C68 18 54 4 36 4 Z" fill="#F97316"/>
      <rect x="10" y="16" width="52" height="40" rx="6" fill="#1C1917"/>
      <circle cx="36" cy="36" r="13" fill="none" stroke="white" stroke-width="2.5"/>
      <circle cx="36" cy="36" r="7" fill="white"/>
      <rect x="48" y="18" width="9" height="6" rx="2" fill="#1C1917"/>
      <rect x="49" y="19" width="7" height="4" rx="1" fill="#F97316"/>
      <circle cx="18" cy="22" r="3" fill="#F97316"/>
    </svg>
  )
}