import React from 'react';

const Butterfly = ({ className = "" }) => (
  <svg viewBox="0 0 40 40" className={className} fill="none">
    <ellipse cx="13" cy="16" rx="9" ry="7" fill="#F8D4C5" opacity=".75" />
    <ellipse cx="27" cy="16" rx="9" ry="7" fill="#F8D4C5" opacity=".75" />
    <ellipse cx="14" cy="26" rx="6" ry="5" fill="#E8B4B8" opacity=".75" />
    <ellipse cx="26" cy="26" rx="6" ry="5" fill="#E8B4B8" opacity=".75" />
    <line x1="20" y1="8" x2="20" y2="32" stroke="#6E5746" strokeWidth="1.2" />
  </svg>
);

export default Butterfly;
