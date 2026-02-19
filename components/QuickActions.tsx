"use client";

import { Zap, Brain, Database, RefreshCw } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Link
        href="/ollama/generate"
        className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:border-dynasty-blue transition-colors cursor-pointer"
      >
        <Zap className="w-8 h-8 text-dynasty-blue mb-3" />
        <h3 className="font-semibold text-gray-900">Generate Content</h3>
        <p className="text-sm text-gray-600 mt-1">
          Use Ollama to create content for free
        </p>
      </Link>

      <Link
        href="/knowledge"
        className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:border-dynasty-purple transition-colors cursor-pointer"
      >
        <Brain className="w-8 h-8 text-dynasty-purple mb-3" />
        <h3 className="font-semibold text-gray-900">Query Knowledge</h3>
        <p className="text-sm text-gray-600 mt-1">
          Search 300+ Dynasty documents
        </p>
      </Link>

      <Link
        href="/memory"
        className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:border-green-600 transition-colors cursor-pointer"
      >
        <Database className="w-8 h-8 text-green-600 mb-3" />
        <h3 className="font-semibold text-gray-900">Browse Memories</h3>
        <p className="text-sm text-gray-600 mt-1">
          View agent memory database
        </p>
      </Link>

      <button
        onClick={() => window.location.reload()}
        className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:border-gray-400 transition-colors"
      >
        <RefreshCw className="w-8 h-8 text-gray-600 mb-3" />
        <h3 className="font-semibold text-gray-900">Refresh Data</h3>
        <p className="text-sm text-gray-600 mt-1">
          Update all dashboard metrics
        </p>
      </button>
    </div>
  );
}
