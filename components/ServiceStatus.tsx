"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader } from "lucide-react";

interface Service {
  name: string;
  status: "online" | "offline" | "error";
  url: string;
  responseTime?: string;
}

export function ServiceStatus() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  async function fetchStatus() {
    try {
      const response = await fetch("/api/services/status");
      const data = await response.json();
      setServices(data.services || []);
    } catch (error) {
      console.error("Failed to fetch service status:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="w-8 h-8 animate-spin text-dynasty-blue" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <div
          key={service.name}
          className="bg-white rounded-lg shadow p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold capitalize">
              {service.name}
            </h3>
            {service.status === "online" ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Status:{" "}
            <span
              className={
                service.status === "online"
                  ? "text-green-600 font-medium"
                  : "text-red-600 font-medium"
              }
            >
              {service.status}
            </span>
          </p>
          {service.responseTime && (
            <p className="text-xs text-gray-500">
              Response: {service.responseTime}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
