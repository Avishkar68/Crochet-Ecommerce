import React from 'react';

const Sprig = ({ className = "" }) => (
  <svg viewBox="0 0 40 60" className={className} fill="none">
    <path d="M20 58 Q 20 30, 20 4" stroke="#A8BBA3" strokeWidth="1.2" strokeLinecap="round" />
    <ellipse cx="12" cy="40" rx="6" ry="3" fill="#A8BBA3" opacity=".8" transform="rotate(-30 12 40)" />
    <ellipse cx="28" cy="32" rx="6" ry="3" fill="#A8BBA3" opacity=".8" transform="rotate(30 28 32)" />
    <ellipse cx="14" cy="22" rx="5" ry="2.5" fill="#A8BBA3" opacity=".8" transform="rotate(-30 14 22)" />
    <circle cx="20" cy="6" r="3.5" fill="#E8B4B8" />
    <circle cx="20" cy="6" r="1.2" fill="#FFFDF8" />
  </svg>
);

export default Sprig;
