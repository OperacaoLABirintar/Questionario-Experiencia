
import React from 'react';

export const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 200 40" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g transform="translate(0, 5)">
      <path d="M24.4,0.4c-3.3,1.6-6,4.3-7.8,7.4c-1.8,3.1-2.7,6.6-2.7,10.2c0,3.6,0.9,7.1,2.7,10.2c1.8,3.1,4.5,5.8,7.8,7.4 M13.8,17.9c0-2.3,0.6-4.5,1.8-6.4c1.2-1.9,2.9-3.4,4.9-4.3 M13.8,17.9c-2.3,0-4.5,0.6-6.4,1.8c-1.9,1.2-3.4,2.9-4.3,4.9 M20.5,17.9c0-1.5,0.4-3,1.2-4.3c0.8-1.3,1.9-2.3,3.2-3 M20.5,17.9c-1.5,0-3,0.4-4.3,1.2c-1.3,0.8-2.3,1.9-3,3.2 M24.9,17.9c0,2.3-0.6,4.5-1.8,6.4c-1.2,1.9-2.9,3.4-4.9,4.3" fill="none" stroke="#ffa400" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <text x="45" y="28" fontFamily="Raleway, sans-serif" fontSize="24" fontWeight="bold">
        <tspan fill="#ff595a">LAB</tspan>
        <tspan fill="#ffa400">IRINTAR</tspan>
    </text>
  </svg>
);
