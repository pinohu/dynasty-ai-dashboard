import React, { useEffect } from 'react';
import { Card } from './ui/Card';
import { StatusBadge } from './ui/StatusBadge';
import { useServiceStatus } from '@/hooks/useAPI';
import { useDashboardStore } from '@/store/dashboardStore';
import { ServiceStatus as ServiceStatusType } from '@/types/api';

export const ServiceStatus: React.FC = () => {
  const { data: services, isLoading, error, isRefetching } = useServiceStatus();
  const { autoRefresh, refreshInterval } = useDashboardStore();

  useEffect(() => {
    if (error) {
      console.error('Failed to fetch service status:', error);
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card variant="outlined" className="border-red-300">
        <div className="text-red-600 dark:text-red-400">
          ⚠️ Failed to load service status
        </div>
      </Card>
    );
  }

  const services_ = services || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Service Status
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          {isRefetching && <span className="animate-spin">⟳</span>}
          <span>Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services_.map((service: ServiceStatusType) => (
          <Card
            key={service.id}
            variant="elevated"
            className="hover:shadow-xl transition-shadow"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {service.name}
                </h3>
                <StatusBadge status={service.status} />
              </div>

              {/* Metrics */}
              <div className="space-y-3">
                {/* Uptime */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Uptime</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {service.uptime.toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        service.uptime >= 99
                          ? 'bg-green-500'
                          : service.uptime >= 95
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${service.uptime}%` }}
                    ></div>
                  </div>
                </div>

                {/* Response Time */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Response Time</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {service.responseTime}ms
                  </span>
                </div>

                {/* Last Check */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Last Check</span>
                  <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                    {new Date(service.lastCheck).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Details */}
              {service.details && (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {service.details}
                  </p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {services_.length === 0 && (
        <Card variant="outlined">
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No services configured
          </p>
        </Card>
      )}
    </div>
  );
};
