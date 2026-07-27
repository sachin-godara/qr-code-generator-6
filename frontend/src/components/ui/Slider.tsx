import React from 'react';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  min: number | string;
  max: number | string;
  step?: number | string;
  onChange: (value: number) => void;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({ 
  value, 
  min, 
  max, 
  step = 1, 
  onChange, 
  className = '', 
  ...props 
}) => {
  const numericMin = Number(min);
  const numericMax = Number(max);
  // Calculate percentage to fill the left side of the track
  const percentage = Math.min(Math.max(((value - numericMin) / (numericMax - numericMin)) * 100, 0), 100);
  
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className={`w-full h-1.5 rounded-full appearance-none cursor-pointer focus:outline-none transition-all ${className}`}
      style={{
        background: `linear-gradient(to right, var(--color-primary, #4f46e5) ${percentage}%, var(--color-outline-variant, #e4e4e7) ${percentage}%)`,
      }}
      {...props}
    />
  );
};
