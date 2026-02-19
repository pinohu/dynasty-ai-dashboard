import { useEffect, useState, useCallback } from 'react';
import { useQuery, UseQueryResult } from 'react-query';
import { apiClient } from '@/utils/api-client';
import {
  DashboardState,
  ServiceStatus,
  CostData,
  AgentSession,
  KnowledgeBase,
  UserSettings,
  RealtimeEvent,
} from '@/types/api';

// Hook for dashboard state
export function useDashboardState(autoRefresh: boolean = true, intervalMs: number = 30000) {
  return useQuery<DashboardState>(
    'dashboard',
    () => apiClient.getDashboardState(),
    {
      refetchInterval: autoRefresh ? intervalMs : false,
      refetchOnWindowFocus: true,
      staleTime: 5000,
      retry: 2,
    }
  );
}

// Hook for service status
export function useServiceStatus(autoRefresh: boolean = true, intervalMs: number = 10000) {
  return useQuery<ServiceStatus[]>(
    'services-status',
    () => apiClient.getServicesStatus(),
    {
      refetchInterval: autoRefresh ? intervalMs : false,
      refetchOnWindowFocus: true,
      staleTime: 3000,
      retry: 2,
    }
  );
}

// Hook for cost data
export function useCostData(autoRefresh: boolean = true, intervalMs: number = 60000) {
  return useQuery<CostData>(
    'cost-data',
    () => apiClient.getCostData(),
    {
      refetchInterval: autoRefresh ? intervalMs : false,
      refetchOnWindowFocus: true,
      staleTime: 30000,
      retry: 2,
    }
  );
}

// Hook for agent activity
export function useAgentActivity(autoRefresh: boolean = true, intervalMs: number = 15000) {
  return useQuery<AgentSession[]>(
    'agent-activity',
    () => apiClient.getAgentActivity(),
    {
      refetchInterval: autoRefresh ? intervalMs : false,
      refetchOnWindowFocus: true,
      staleTime: 5000,
      retry: 2,
    }
  );
}

// Hook for knowledge base
export function useKnowledgeBase() {
  return useQuery<KnowledgeBase>(
    'knowledge-base',
    () => apiClient.getKnowledgeBase(),
    {
      staleTime: 300000, // 5 minutes
      retry: 2,
    }
  );
}

// Hook for settings
export function useSettings() {
  return useQuery<UserSettings>(
    'settings',
    () => apiClient.getSettings(),
    {
      staleTime: 300000, // 5 minutes
      retry: 2,
    }
  );
}

// Hook for real-time streaming
export function useDashboardStream(enabled: boolean = true): [RealtimeEvent[], boolean, string | null] {
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let unsubscribe: (() => void) | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = async () => {
      try {
        unsubscribe = await apiClient.streamDashboardUpdates((event) => {
          setEvents((prev) => [event, ...prev.slice(0, 99)]);
          setIsConnected(true);
          setError(null);
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Connection error');
        setIsConnected(false);
        // Reconnect after 5 seconds
        reconnectTimeout = setTimeout(connect, 5000);
      }
    };

    connect();

    return () => {
      if (unsubscribe) unsubscribe();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, [enabled]);

  return [events, isConnected, error];
}

// Hook for updating settings
export function useUpdateSettings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSettings = useCallback(
    async (settings: Partial<UserSettings>) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiClient.updateSettings(settings);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update settings';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { updateSettings, loading, error };
}
