import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from './ui/Card';
import { useCostData } from '@/hooks/useAPI';
import { useDashboardStore } from '@/store/dashboardStore';

export const CostTracking: React.FC = () => {
  const { data: costData, isLoading, error } = useCostData();
  const { autoRefresh } = useDashboardStore();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse h-40"></Card>
        <Card className="animate-pulse h-64"></Card>
      </div>
    );
  }

  if (error || !costData) {
    return (
      <Card variant="outlined" className="border-red-300">
        <div className="text-red-600 dark:text-red-400">
          ⚠️ Failed to load cost data
        </div>
      </Card>
    );
  }

  const budgetRemaining = costData.monthlyBudget - costData.totalCost;
  const budgetPercentage = (costData.totalCost / costData.monthlyBudget) * 100;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Cost Tracking
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Cost */}
        <Card variant="elevated">
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
              Total Cost
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${costData.totalCost.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Month to date
            </p>
          </div>
        </Card>

        {/* Budget */}
        <Card variant="elevated">
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
              Monthly Budget
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${costData.monthlyBudget.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {budgetPercentage.toFixed(1)}% used
            </p>
          </div>
        </Card>

        {/* Remaining */}
        <Card
          variant="elevated"
          className={budgetRemaining < 0 ? 'border-red-300' : ''}
        >
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
              Remaining
            </p>
            <p
              className={`text-3xl font-bold ${
                budgetRemaining < 0
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-green-600 dark:text-green-400'
              }`}
            >
              ${Math.abs(budgetRemaining).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {budgetRemaining < 0 ? 'Over budget' : 'Budget available'}
            </p>
          </div>
        </Card>

        {/* Daily Average */}
        <Card variant="elevated">
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
              Daily Average
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${costData.costPerDay.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Current month
            </p>
          </div>
        </Card>
      </div>

      {/* Budget Usage */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Budget Progress
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Used</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {budgetPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  budgetPercentage > 90
                    ? 'bg-red-500'
                    : budgetPercentage > 70
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Cost Trend Chart */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Cost Trend (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={costData.costTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#6b7280' }}
                style={{ fontSize: '12px' }}
              />
              <YAxis
                tick={{ fill: '#6b7280' }}
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="cost"
                stroke="#6366f1"
                dot={false}
                strokeWidth={2}
                name="Cost"
              />
              <Line
                type="monotone"
                dataKey="budget"
                stroke="#ef4444"
                dot={false}
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Budget"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Cost Breakdown */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Cost Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: 'Compute', value: costData.breakdown.compute },
                { name: 'Storage', value: costData.breakdown.storage },
                { name: 'Network', value: costData.breakdown.network },
                { name: 'Services', value: costData.breakdown.services },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#6b7280' }}
                style={{ fontSize: '12px' }}
              />
              <YAxis
                tick={{ fill: '#6b7280' }}
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Alerts */}
      {costData.alerts && costData.alerts.length > 0 && (
        <Card variant="outlined" className="border-yellow-300">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Alerts
            </h3>
            {costData.alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg ${
                  alert.severity === 'critical'
                    ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500'
                    : alert.severity === 'warning'
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500'
                    : 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                }`}
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {alert.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
