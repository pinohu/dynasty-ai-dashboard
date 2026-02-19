import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDashboardStore } from '@/store/dashboardStore';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/services', label: 'Services', icon: '🔧' },
  { href: '/costs', label: 'Costs', icon: '💰' },
  { href: '/agents', label: 'Agents', icon: '🤖' },
  { href: '/knowledge-base', label: 'Knowledge Base', icon: '📚' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export const Sidebar: React.FC = () => {
  const router = useRouter();
  const { sidebarOpen, toggleSidebar } = useDashboardStore();

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white p-6 transform transition-transform duration-300 md:translate-x-0 z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="mb-8 mt-4 md:mt-0">
          <h1 className="text-2xl font-bold">
            <span className="text-indigo-400">Dynasty</span> AI
          </h1>
          <p className="text-sm text-gray-400 mt-1">Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a
                  onClick={() => {
                    // Close sidebar on mobile after navigation
                    if (window.innerWidth < 768) {
                      toggleSidebar();
                    }
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </a>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-gray-800 rounded-lg p-4 text-sm">
            <p className="text-gray-400">Status</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-green-400">Connected</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};
