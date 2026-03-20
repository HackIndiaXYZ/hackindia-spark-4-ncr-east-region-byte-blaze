function FarmingIllustration() {
  return (
    <svg
      viewBox="0 0 500 400"
      className="w-full h-auto"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Sky gradient background */}
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#E3F2FD", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#FFF9E6", stopOpacity: 1 }} />
        </linearGradient>

        <linearGradient id="hillGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#81C784", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#66BB6A", stopOpacity: 1 }} />
        </linearGradient>

        <linearGradient id="hillGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#4CAF50", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#388E3C", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Background sky */}
      <rect width="500" height="400" fill="url(#skyGradient)" />

      {/* Sun */}
      <circle cx="420" cy="60" r="45" fill="#FFD54F" opacity="0.9" />
      <circle cx="420" cy="60" r="40" fill="#FFC107" />

      {/* Decorative clouds */}
      <g opacity="0.6">
        <ellipse cx="80" cy="50" rx="40" ry="20" fill="white" />
        <ellipse cx="110" cy="55" rx="35" ry="18" fill="white" />
        <ellipse cx="50" cy="60" rx="30" ry="15" fill="white" />
      </g>

      {/* Back hills */}
      <path
        d="M 0 280 Q 100 200 200 250 T 400 280 L 400 400 L 0 400 Z"
        fill="url(#hillGradient2)"
        opacity="0.6"
      />

      {/* Front hills */}
      <path
        d="M 0 300 Q 80 220 150 280 Q 250 180 350 270 Q 420 230 500 290 L 500 400 L 0 400 Z"
        fill="url(#hillGradient1)"
      />

      {/* Grass patches */}
      <g opacity="0.7">
        <ellipse cx="100" cy="310" rx="60" ry="15" fill="#558B2F" />
        <ellipse cx="300" cy="320" rx="70" ry="18" fill="#558B2F" />
        <ellipse cx="450" cy="315" rx="50" ry="12" fill="#558B2F" />
      </g>

      {/* Tractor - Simple flat design */}
      <g transform="translate(280, 240)">
        {/* Tractor body */}
        <rect x="0" y="20" width="80" height="35" rx="8" fill="#D32F2F" />
        {/* Tractor cabin */}
        <rect x="10" y="5" width="25" height="25" rx="4" fill="#C62828" />
        {/* Window */}
        <rect x="13" y="8" width="18" height="15" fill="#81D4FA" opacity="0.7" />
        {/* Tractor wheels */}
        <circle cx="20" cy="60" r="12" fill="#212121" />
        <circle cx="70" cy="60" r="12" fill="#212121" />
        <circle cx="20" cy="60" r="8" fill="#424242" />
        <circle cx="70" cy="60" r="8" fill="#424242" />
      </g>

      {/* Farmer figure */}
      <g transform="translate(380, 240)">
        {/* Head */}
        <circle cx="0" cy="0" r="10" fill="#D7A270" />
        {/* Body */}
        <rect x="-8" y="10" width="16" height="25" rx="3" fill="#8B5A2B" />
        {/* Arms */}
        <line x1="-8" y1="15" x2="-20" y2="8" stroke="#D7A270" strokeWidth="4" strokeLinecap="round" />
        <line x1="8" y1="15" x2="20" y2="8" stroke="#D7A270" strokeWidth="4" strokeLinecap="round" />
        {/* Legs */}
        <line x1="-4" y1="35" x2="-4" y2="50" stroke="#333" strokeWidth="4" strokeLinecap="round" />
        <line x1="4" y1="35" x2="4" y2="50" stroke="#333" strokeWidth="4" strokeLinecap="round" />
        {/* Hat */}
        <ellipse cx="0" cy="-8" rx="12" ry="5" fill="#8B4513" />
        <path d="M -10 -8 L -5 -15 L 5 -15 L 10 -8" fill="#8B4513" />
      </g>

      {/* Corn stalks */}
      <g>
        {/* Corn 1 */}
        <line x1="150" y1="200" x2="150" y2="280" stroke="#558B2F" strokeWidth="3" />
        <ellipse cx="155" cy="220" rx="15" ry="25" fill="#558B2F" opacity="0.8" />
        <circle cx="150" cy="190" r="12" fill="#FFD54F" />
        <circle cx="155" cy="185" r="10" fill="#FFC107" />
        <circle cx="145" cy="185" r="10" fill="#FFC107" />

        {/* Corn 2 */}
        <line x1="200" y1="210" x2="200" y2="290" stroke="#558B2F" strokeWidth="3" />
        <ellipse cx="205" cy="235" rx="15" ry="25" fill="#558B2F" opacity="0.8" />
        <circle cx="200" cy="200" r="12" fill="#FFD54F" />
        <circle cx="205" cy="195" r="10" fill="#FFC107" />
        <circle cx="195" cy="195" r="10" fill="#FFC107" />

        {/* Corn 3 */}
        <line x1="120" y1="220" x2="120" y2="295" stroke="#558B2F" strokeWidth="3" />
        <ellipse cx="125" cy="245" rx="15" ry="25" fill="#558B2F" opacity="0.8" />
        <circle cx="120" cy="210" r="12" fill="#FFD54F" />
        <circle cx="125" cy="205" r="10" fill="#FFC107" />
        <circle cx="115" cy="205" r="10" fill="#FFC107" />
      </g>

      {/* Pumpkins */}
      <g>
        <circle cx="80" cy="280" r="20" fill="#FF9800" />
        <circle cx="70" cy="275" r="5" fill="#F57C00" opacity="0.7" />
        <circle cx="90" cy="275" r="5" fill="#F57C00" opacity="0.7" />
        <path d="M 80 255 Q 78 265 80 275" stroke="#558B2F" strokeWidth="2" fill="none" />
      </g>

      {/* Decorative leaves top-left */}
      <g opacity="0.5" transform="translate(20, 20)">
        <path d="M 0 0 Q 15 5 10 15 Q 5 20 0 15 Q 5 10 0 0" fill="#4CAF50" />
        <path d="M 20 5 Q 35 10 30 20 Q 25 25 20 20 Q 25 15 20 5" fill="#66BB6A" />
      </g>

      {/* Decorative leaves top-right */}
      <g opacity="0.5" transform="translate(440, 25)">
        <path d="M 0 0 Q 15 5 10 15 Q 5 20 0 15 Q 5 10 0 0" fill="#4CAF50" />
        <path d="M -20 5 Q -35 10 -30 20 Q -25 25 -20 20 Q -25 15 -20 5" fill="#66BB6A" />
      </g>

      {/* Blockchain badge */}
      <g transform="translate(30, 350)">
        <rect x="0" y="0" width="180" height="35" rx="12" fill="#2E7D6B" opacity="0.85" />
        <text
          x="10"
          y="12"
          fontSize="10"
          fill="white"
          fontWeight="600"
          fontFamily="Poppins"
        >
          ⛓️ Blockchain-Powered
        </text>
        <text
          x="10"
          y="27"
          fontSize="9"
          fill="#FFD54F"
          fontWeight="500"
          fontFamily="Inter"
        >
          Instant payouts on weather
        </text>
      </g>
    </svg>
  );
}

export default FarmingIllustration;
