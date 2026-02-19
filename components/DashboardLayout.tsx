"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Home, Database, Brain, Zap, Settings, LogOut } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-dynasty-blue">
            Dynasty AI ⚙️
          </h1>
          <p className="text-sm text-gray-500">Mission Control</p>
        </div>

        <nav className="mt-6">
          <Link
            href="/"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <Home className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link
            href="/langfuse"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <Zap className="w-5 h-5 mr-3" />
            Cost Tracking
          </Link>
          <Link
            href="/knowledge"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <Brain className="w-5 h-5 mr-3" />
            Knowledge Base
          </Link>
          <Link
            href="/memory"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <Database className="w-5 h-5 mr-3" />
            Agent Memory
          </Link>
          <Link
            href="/settings"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Link>
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-dynasty-purple rounded-full flex items-center justify-center text-white font-semibold">
                {session?.user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {session?.user?.email?.split("@")[0]}
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="text-gray-400 hover:text-gray-600"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
