import React, { memo } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Button Component
const Button = memo(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  'aria-label': ariaLabel,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  );
});

// Composant pour les boutons Avant et Après
export function StepButtons({ onPrev, onNext, disabledPrev, disabledNext }) {
  return (
    <div className="flex space-x-2">
      <Button onClick={onPrev} disabled={disabledPrev} variant="outline" aria-label="Précédent">
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button onClick={onNext} disabled={disabledNext} variant="primary" aria-label="Suivant">
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}

export default Button; 