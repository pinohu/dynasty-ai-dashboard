import React, { useEffect } from 'react';
import { Card } from './ui/Card';
import { StatusBadge } from './ui/StatusBadge';
import { useAgentActivity, useDashboardStream } from '@/hooks/useAPI';
import { useDashboardStore } from '@/store/dashboardStore';
import { AgentSession } from '@/types/api';

export const AgentActivity: React.FC = () => {
  const { data: agents, isLoading, error, refetch } = useAgentActivity();
  const [streamEvents, isConnected] = useDashboardStream(true);
  const { addNotification } = useDashboardStore();

  useEffect(() => {
    // Refetch when new stream events arrive
    if (streamEvents.some((e) => e.type === 'agent_update')) {
      refetch();
    }
  }, [streamEvents, refetch]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse h-24"></Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card variant="outlined" className="border-red-300">
        <div className="text-red-600 dark:text-red-400">
          ⚠️ Failed to load agent activity
        </div>
      </Card>
    );
  }

  const agents_ = agents || [];

  const getStatusColor = (
    status: 'active' | 'idle' | 'offline'
  ): 'active' | 'idle' | 'offline' => status;

  const getTimeAgo = (timestamp: string): string => {
    const now = new Date().getTime();
    const then = new Date(timestamp).getTime();
    const diff = now - then;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Agent Activity
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${
              isConnected
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              } animate-pulse`}
            ></span>
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="elevated">
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
              Total Agents
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {agents_.length}
            </p>
          </div>
        </Card>

        <Card variant="elevated">
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
              Active Now
            </p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {agents_.filter((a) => a.status === 'active').length}
            </p>
          </div>
        </Card>

        <Card variant="elevated">
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
              Total Tasks
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {agents_.reduce((sum, a) => sum + a.tasksCompleted, 0)}
            </p>
          </div>
        </Card>
      </div>

      {/* Agent List */}
      <div className="space-y-4">
        {agents_.map((agent: AgentSession) => (
          <Card
            key={agent.id}
            variant="elevated"
            className="hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-3">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {agent.agentName}
                    </h3>
                  </div>
                  <StatusBadge status={agent.status} />
                </div>

                {/* Current Task */}
                {agent.currentTask && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border-l-4 border-blue-500">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Current Task
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      {agent.currentTask}
                    </p>
                  </div>
                )}

                {/* Details */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Session Started</p>
                    <p className="font-mono text-xs text-gray-700 dark:text-gray-300 mt-1">
                      {new Date(agent.sessionStarted).toLocaleDateString()}
                      <br />
                      {new Date(agent.sessionStarted).toLocaleTimeString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Last Heartbeat</p>
                    <p className="font-semibold text-gray-900 dark:text-white mt-1">
                      {getTimeAgo(agent.lastHeartbeat)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Tasks Completed</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-xl mt-1">
                      {agent.tasksCompleted}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {agents_.length === 0 && (
        <Card variant="outlined">
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No active agents
          </p>
        </Card>
      )}

      {/* Real-time Events Feed */}
      {streamEvents.length > 0 && (
        <Card>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Real-time Events (Last 10)
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {streamEvents.slice(0, 10).map((event, idx) => (
                <div
                  key={idx}
                  className="text-xs p-2 bg-gray-100 dark:bg-gray-800 rounded border-l-2 border-indigo-500"
                >
                  <div className="flex justify-between">
                    <span className="font-mono text-gray-700 dark:text-gray-300">
                      {event.type}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
