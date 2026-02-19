"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { ServiceStatus } from "@/components/ServiceStatus";
import { CostTracking } from "@/components/CostTracking";
import { AgentActivity } from "@/components/AgentActivity";
import { QuickActions } from "@/components/QuickActions";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Dynasty AI Stack Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Real-time monitoring and control of your AI infrastructure
          </p>
        </div>

        {/* Service Status Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Service Status</h2>
          <ServiceStatus />
        </div>

        {/* Cost Tracking */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cost Tracking</h2>
          <CostTracking />
        </div>

        {/* Agent Activity */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Agent Activity</h2>
          <AgentActivity />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <QuickActions />
        </div>
      </div>
    </DashboardLayout>
  );
}
