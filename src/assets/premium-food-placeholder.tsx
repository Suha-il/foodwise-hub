
import React from 'react';

interface PremiumFoodPlaceholderProps {
  className?: string;
}

const PremiumFoodPlaceholder: React.FC<PremiumFoodPlaceholderProps> = ({ className = "" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="800" height="600" fill="#000000" />
      <g opacity="0.8">
        <path
          d="M400 100C400 100 350 150 300 200C250 250 200 300 200 350C200 400 250 450 300 450C350 450 375 425 400 400C425 425 450 450 500 450C550 450 600 400 600 350C600 300 550 250 500 200C450 150 400 100 400 100Z"
          fill="url(#gold-gradient)"
        />
        <path
          d="M350 250C350 250 325 275 300 300C275 325 250 350 250 375C250 400 275 425 300 425C325 425 337.5 412.5 350 400C362.5 412.5 375 425 400 425C425 425 450 400 450 375C450 350 425 325 400 300C375 275 350 250 350 250Z"
          fill="#FFFFFF"
          opacity="0.2"
        />
        <circle cx="325" cy="350" r="10" fill="#F5D787" />
        <circle cx="375" cy="375" r="8" fill="#F5D787" />
        <circle cx="350" cy="325" r="12" fill="#F5D787" />
      </g>
      
      <path
        d="M200 450C200 450 250 500 300 500C350 500 400 475 400 475C400 475 450 500 500 500C550 500 600 450 600 450"
        stroke="#D4AF37"
        strokeWidth="4"
      />
      
      <text
        x="400"
        y="550"
        textAnchor="middle"
        fill="#D4AF37"
        fontFamily="serif"
        fontSize="24"
        fontWeight="bold"
      >
        PREMIUM DINING EXPERIENCE
      </text>
      
      <defs>
        <linearGradient id="gold-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F5D787" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#AA8C2C" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default PremiumFoodPlaceholder;
