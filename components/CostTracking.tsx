"use client";

import { useEffect, useState } from "react";
import { TrendingDown, DollarSign } from "lucide-react";

interface CostData {
  today: number;
  yesterday: number;
  week: number;
  month: number;
  savings: number;
}

export function CostTracking() {
  const [costs, setCosts] = useState<CostData>({
    today: 0,
    yesterday: 0,
    week: 0,
    month: 0,
    savings: 0,
  });

  useEffect(() => {
    // Mock data - replace with actual Langfuse API call
    setCosts({
      today: 5.42,
      yesterday: 6.18,
      week: 38.76,
      month: 152.34,
      savings: 2847.66, // vs $3000 before
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Today's Cost */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Today</h3>
          <DollarSign className="w-5 h-5 text-dynasty-blue" />
        </div>
        <p className="text-3xl font-bold text-gray-900">${costs.today}</p>
        <p className="text-sm text-green-600 mt-1">
          ↓ ${(costs.yesterday - costs.today).toFixed(2)} vs yesterday
        </p>
      </div>

      {/* This Month */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">This Month</h3>
          <DollarSign className="w-5 h-5 text-dynasty-purple" />
        </div>
        <p className="text-3xl font-bold text-gray-900">${costs.month}</p>
        <p className="text-sm text-gray-600 mt-1">
          Target: $150-300 ({((costs.month / 300) * 100).toFixed(0)}%)
        </p>
      </div>

      {/* Monthly Savings */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-white">Monthly Savings</h3>
          <TrendingDown className="w-5 h-5 text-white" />
        </div>
        <p className="text-3xl font-bold text-white">${costs.savings}</p>
        <p className="text-sm text-green-100 mt-1">
          95% reduction vs before AI Stack
        </p>
      </div>
    </div>
  );
}
