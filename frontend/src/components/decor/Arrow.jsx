import React from 'react';

const Arrow = ({ className = "" }) => (
  <svg viewBox="0 0 40 10" className={className} fill="none">
    <path d="M1 5 Q 10 1, 20 5 T 39 5" stroke="#A8BBA3" strokeWidth="1" strokeLinecap="round" />
    <path d="M34 2 L39 5 L34 8" stroke="#A8BBA3" strokeWidth="1" strokeLinecap="round" fill="none" />
  </svg>
);

export default Arrow;
