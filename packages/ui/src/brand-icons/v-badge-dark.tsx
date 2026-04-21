export const VBadgeDark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 1080 1080" className={className}>
    <defs>
      <linearGradient
        id="VBadgeDark_a"
        x1="1034.25"
        y1="1034.25"
        x2="45.75"
        y2="45.75"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#020817" />
        <stop offset="1" stopColor="#0c232d" />
      </linearGradient>
    </defs>
    <rect
      x="15"
      y="15"
      width="1050"
      height="1050"
      rx="105"
      fill="url(#VBadgeDark_a)"
    />
    <path
      d="M882.56,190.13,628.12,893.07H450.89L540,723.66,675.7,336.8A219.21,219.21,0,0,1,882.56,190.13Z"
      fill="#e8eff6"
    />
    <polygon
      points="540 723.76 352.87 190.13 197.44 190.13 450.89 893.07 599.47 893.07 540.04 723.66 540 723.76"
      fill="#fff"
    />
  </svg>
)
