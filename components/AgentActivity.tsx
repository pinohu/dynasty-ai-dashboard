"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

interface Agent {
  name: string;
  status: "active" | "idle";
  lastActive: string;
  tasksToday: number;
}

export function AgentActivity() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      name: "Flint (CTO)",
      status: "active",
      lastActive: "2 minutes ago",
      tasksToday: 47,
    },
    {
      name: "ContentBot",
      status: "active",
      lastActive: "5 minutes ago",
      tasksToday: 156,
    },
    {
      name: "LeadBot",
      status: "idle",
      lastActive: "1 hour ago",
      tasksToday: 23,
    },
    {
      name: "SDBot",
      status: "active",
      lastActive: "10 minutes ago",
      tasksToday: 12,
    },
    {
      name: "BDBot",
      status: "idle",
      lastActive: "3 hours ago",
      tasksToday: 8,
    },
  ]);

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="p-6">
        <div className="space-y-4">
          {agents.map((agent) => (
            <div
              key={agent.name}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    agent.status === "active"
                      ? "bg-green-500 animate-pulse"
                      : "bg-gray-300"
                  }`}
                />
                <div>
                  <p className="font-medium text-gray-900">{agent.name}</p>
                  <p className="text-sm text-gray-500">
                    Last active: {agent.lastActive}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-dynasty-blue">
                  {agent.tasksToday}
                </p>
                <p className="text-xs text-gray-500">tasks today</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
