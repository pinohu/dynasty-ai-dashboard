import React, { useState } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';

export const Header: React.FC<{ title?: string }> = ({ title = 'Dashboard' }) => {
  const { autoRefresh, setAutoRefresh } = useDashboardStore();
  const [showMenu, setShowMenu] = useState(false);
  const currentTime = new Date().toLocaleTimeString();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="ml-0 md:ml-64 px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Title & Time */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Last updated: {currentTime}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Auto-Refresh Toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                autoRefresh
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
              }`}
              title={autoRefresh ? 'Auto-refresh is ON' : 'Auto-refresh is OFF'}
            >
              {autoRefresh ? '🔄 Live' : '⏸️ Paused'}
            </button>

            {/* Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors"
              >
                👤
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    👤 Profile
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    ⚙️ Settings
                  </button>
                  <hr className="my-2 border-gray-200 dark:border-gray-700" />
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
