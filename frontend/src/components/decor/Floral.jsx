import React from 'react';

const Floral = ({ className = "" }) => (
  <svg viewBox="0 0 60 30" className={className} fill="none">
    <path d="M2 15 Q 15 5, 28 15 T 58 15" stroke="#A8BBA3" strokeWidth="1" strokeLinecap="round" />
    <circle cx="6" cy="15" r="2.5" fill="#E8B4B8" />
    <circle cx="30" cy="15" r="2.5" fill="#F8D4C5" />
    <circle cx="54" cy="15" r="2.5" fill="#E8B4B8" />
    <path d="M14 11 q1 -3 3 0" stroke="#A8BBA3" strokeWidth="1" />
    <path d="M40 19 q1 3 3 0" stroke="#A8BBA3" strokeWidth="1" />
  </svg>
);

export default Floral;
