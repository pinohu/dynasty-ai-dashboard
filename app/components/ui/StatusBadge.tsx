import React from 'react';

interface StatusBadgeProps {
  status: 'healthy' | 'degraded' | 'down' | 'maintenance' | 'active' | 'idle' | 'offline';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'md' }) => {
  const statusConfig = {
    healthy: {
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      dot: 'bg-green-500',
    },
    degraded: {
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      dot: 'bg-yellow-500',
    },
    down: {
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
      dot: 'bg-red-500',
    },
    maintenance: {
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      dot: 'bg-blue-500',
    },
    active: {
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      dot: 'bg-green-500',
    },
    idle: {
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
      dot: 'bg-gray-500',
    },
    offline: {
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
      dot: 'bg-red-500',
    },
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const config = statusConfig[status];

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full ${config.color} ${sizeStyles[size]} font-medium`}
    >
      <div className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`}></div>
      {label || status}
    </div>
  );
};
