"use client";

import { forwardRef } from "react";

export interface ProgressProps {
  value?: number;
  max?: number;
  className?: string;
}

const Progress = forwardRef<
  HTMLDivElement,
  ProgressProps
>(({ value = 0, max = 100, className = "" }, ref) => {
  const percentage = (value / max) * 100;
  
  return (
    <div 
      ref={ref} 
      className={`w-full bg-gray-200 rounded-full h-2 ${className}`}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemax={max}
    >
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
});

Progress.displayName = "Progress";

export { Progress };