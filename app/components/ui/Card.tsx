import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  variant = 'default',
  hover = true,
}) => {
  const baseStyles =
    'rounded-lg border transition-all duration-200 p-6';

  const variantStyles = {
    default: 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 border-gray-100 shadow-lg dark:border-gray-700',
    outlined:
      'bg-transparent border-2 border-gray-300 dark:border-gray-600',
  };

  const hoverStyles = hover
    ? 'hover:shadow-md dark:hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-500 cursor-pointer'
    : '';

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
