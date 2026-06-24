import React from "react";
import { Heart } from "lucide-react";

// Cozy animated Yarn Ball Spinner with a crochet needle
export function YarnSpinner({ message = "Stitching with love..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative w-20 h-20">
        {/* Crochet needle (diagonal background item) */}
        <svg
          className="absolute -top-2 -left-2 w-24 h-24 text-brown/20 transform rotate-12"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        >
          {/* Wooden Crochet Hook */}
          <path d="M15 85 L80 20" />
          <path d="M80 20 C82 18, 83 15, 80 13 C77 11, 75 14, 76 16 L73 18" />
        </svg>

        {/* Spinning Ball of Yarn */}
        <svg
          className="w-full h-full text-rose animate-spin"
          style={{ animationDuration: "3.5s" }}
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Main Yarn circle */}
          <circle cx="50" cy="50" r="40" className="fill-cream stroke-rose" strokeWidth="4" />
          
          {/* Wound Yarn thread lines */}
          <path d="M30 20 C40 30, 40 70, 30 80" />
          <path d="M40 14 C52 28, 52 72, 40 86" />
          <path d="M50 10 C65 25, 65 75, 50 90" />
          <path d="M60 14 C72 30, 72 70, 60 86" />
          <path d="M70 20 C80 35, 80 65, 70 80" />
          
          {/* Wrapping thread loops */}
          <path d="M14 40 C30 50, 70 50, 86 40" strokeWidth="3" className="text-sage" />
          <path d="M10 50 C25 60, 75 60, 90 50" strokeWidth="3" />
          <path d="M14 60 C30 70, 70 70, 86 60" strokeWidth="3" className="text-sage" />
          
          {/* Center heart design */}
          <path
            d="M50 43 C48 40, 43 40, 43 45 C43 51, 50 56, 50 56 C50 56, 57 51, 57 45 C57 40, 52 40, 50 43 Z"
            fill="currentColor"
            stroke="none"
          />
        </svg>

        {/* Loose thread drop animation */}
        <div className="absolute -bottom-1 left-8 w-6 h-6 text-rose animate-bounce">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M4 4 C10 10, 2 16, 12 20" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {message && (
        <p className="font-script text-lg text-brown/90 mt-4 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}

// Card skeleton loader matching the boutique ProductCard layout
export function CardSkeleton() {
  return (
    <div className="paper rounded-3xl p-3 shadow-soft relative overflow-hidden border border-border/40 select-none">
      {/* Image placeholder with a soft pulsing gradient */}
      <div className="aspect-square rounded-2xl bg-muted/65 animate-pulse relative overflow-hidden border border-border/30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cream/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>

      {/* Title & info placeholders */}
      <div className="px-1 pt-3 pb-1 space-y-2">
        {/* Title line */}
        <div className="h-4 bg-muted/70 rounded-md animate-pulse w-3/4" />
        
        {/* Star Rating placeholder */}
        <div className="flex gap-0.5 animate-pulse">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Heart key={idx} className="w-3 h-3 text-muted/30 fill-muted/30" />
          ))}
          <div className="w-6 h-2.5 bg-muted/50 rounded ml-1 mt-0.5" />
        </div>

        {/* Price tag line */}
        <div className="h-3.5 bg-muted/70 rounded-md animate-pulse w-1/4" />

        {/* Add to basket button placeholder */}
        <div className="w-full h-8 bg-muted/60 rounded-full mt-3 animate-pulse" />
      </div>
    </div>
  );
}

// List skeleton loader matching the horizontal shop rows in Products.jsx
export function ListSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-cream/70 paper rounded-3xl p-4 shadow-soft border border-border/30 relative overflow-hidden animate-pulse select-none">
      {/* Left: Product Image Placeholder */}
      <div className="w-full sm:w-32 h-32 rounded-2xl bg-muted/70 shrink-0 relative overflow-hidden border border-border/40">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cream/35 to-transparent -translate-x-full animate-[shimmer_1.6s_infinite]" />
      </div>

      {/* Center: Details Placeholder */}
      <div className="flex-1 text-center sm:text-left py-2 space-y-2.5">
        {/* Category Pill Tag */}
        <div className="h-4.5 w-20 bg-muted/50 rounded-full" />
        {/* Product Title */}
        <div className="h-5 w-48 bg-muted/70 rounded-md" />
        {/* Stars */}
        <div className="flex items-center justify-center sm:justify-start gap-0.5">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Heart key={idx} className="w-3.5 h-3.5 text-muted/30 fill-muted/30" />
          ))}
          <div className="w-8 h-3 bg-muted/40 rounded ml-1" />
        </div>
      </div>

      {/* Right: Actions Placeholder */}
      <div className="text-center sm:text-right shrink-0 flex flex-col items-center sm:items-end gap-3.5 pr-2">
        {/* Price tag */}
        <div className="h-5 w-16 bg-muted/70 rounded-md" />
        {/* Add to Basket button */}
        <div className="h-8 w-28 bg-muted/60 rounded-full" />
      </div>
    </div>
  );
}

// Table row skeleton loader for the AdminDashboard tables
export function TableSkeleton({ cols = 5, rows = 4 }) {
  return (
    <div className="space-y-4 py-2 select-none animate-pulse">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="grid gap-4 py-3.5 px-2 border-b border-border/30 items-center"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {Array.from({ length: cols }).map((_, colIdx) => (
            <div
              key={colIdx}
              className={`h-3 bg-muted/70 rounded-md ${
                colIdx === 0 ? "w-2/3 font-semibold" :
                colIdx === cols - 1 ? "w-1/2 justify-self-end" : "w-4/5"
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
