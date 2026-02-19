import React from 'react';
import { useDashboardStore } from '@/store/dashboardStore';

export const NotificationCenter: React.FC = () => {
  const { notifications, removeNotification } = useDashboardStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => {
        const bgColor = {
          info: 'bg-blue-500',
          warning: 'bg-yellow-500',
          error: 'bg-red-500',
        }[notification.type];

        return (
          <div
            key={notification.id}
            className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex justify-between items-center animate-slideIn`}
          >
            <p className="text-sm font-medium">{notification.message}</p>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-4 hover:opacity-80 transition-opacity"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
};
