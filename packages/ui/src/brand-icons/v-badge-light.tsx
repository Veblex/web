export const VBadgeLight = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 1080 1080" className={className}>
    <defs>
      <linearGradient
        id="VBadgeLight_a"
        x1="9.67"
        y1="540"
        x2="1059.67"
        y2="540"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#e8eff6" />
        <stop offset="1" stopColor="#e8eff6" />
      </linearGradient>
    </defs>
    <rect
      x="15"
      y="15"
      width="1050"
      height="1050"
      rx="105"
      fill="url(#VBadgeLight_a)"
    />
    <path
      d="M882.56,188.53,628.12,891.47H450.89L540,722.06,675.7,335.2A219.21,219.21,0,0,1,882.56,188.53Z"
      fill="#0c232d"
    />
    <polygon
      points="540 722.16 352.87 188.53 197.44 188.53 450.89 891.47 599.47 891.47 540.04 722.06 540 722.16"
      fill="#020817"
    />
  </svg>
)
