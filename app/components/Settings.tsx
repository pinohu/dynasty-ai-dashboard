import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useSettings, useUpdateSettings } from '@/hooks/useAPI';
import { useDashboardStore } from '@/store/dashboardStore';
import { UserSettings } from '@/types/api';

export const Settings: React.FC = () => {
  const { data: settings, isLoading, error } = useSettings();
  const { updateSettings, loading: updating, error: updateError } = useUpdateSettings();
  const { addNotification, setAutoRefresh, setRefreshInterval } = useDashboardStore();

  const [formData, setFormData] = useState<Partial<UserSettings> | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;

      const keys = key.split('.');
      if (keys.length === 1) {
        return { ...prev, [key]: value };
      }

      // Handle nested updates
      const newData = { ...prev };
      let obj: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) {
          obj[keys[i]] = {};
        }
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;

      return newData;
    });

    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!formData) return;

    try {
      await updateSettings(formData);
      addNotification('Settings saved successfully', 'info');
      setHasChanges(false);
    } catch (err) {
      addNotification('Failed to save settings', 'error');
    }
  };

  const handleReset = () => {
    if (settings) {
      setFormData(settings);
      setHasChanges(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-40 animate-pulse"></Card>
        ))}
      </div>
    );
  }

  if (error || !formData) {
    return (
      <Card variant="outlined" className="border-red-300">
        <div className="text-red-600 dark:text-red-400">
          ⚠️ Failed to load settings
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Configure dashboard behavior, alerts, and thresholds
        </p>
      </div>

      {updateError && (
        <Card variant="outlined" className="border-red-300">
          <p className="text-red-600 dark:text-red-400">Error: {updateError}</p>
        </Card>
      )}

      {/* Cost Alert Thresholds */}
      <Card>
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            💰 Cost Alert Thresholds
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cost Alert Threshold (%)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.thresholds?.costAlertThreshold || 80}
                  onChange={(e) =>
                    handleChange('thresholds.costAlertThreshold', parseInt(e.target.value))
                  }
                  className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-right min-w-12">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.thresholds?.costAlertThreshold || 80}
                    onChange={(e) =>
                      handleChange('thresholds.costAlertThreshold', parseInt(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <span className="text-gray-600 dark:text-gray-400">%</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Alert when budget usage exceeds this percentage
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Uptime Alert Threshold (%)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.thresholds?.uptimeAlertThreshold || 95}
                  onChange={(e) =>
                    handleChange('thresholds.uptimeAlertThreshold', parseInt(e.target.value))
                  }
                  className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-right min-w-12">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.thresholds?.uptimeAlertThreshold || 95}
                    onChange={(e) =>
                      handleChange('thresholds.uptimeAlertThreshold', parseInt(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <span className="text-gray-600 dark:text-gray-400">%</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Alert when uptime drops below this percentage
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Response Time Alert Threshold (ms)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={formData.thresholds?.responseTimeAlert || 1000}
                onChange={(e) =>
                  handleChange('thresholds.responseTimeAlert', parseInt(e.target.value))
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Alert when response time exceeds this value
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Alert Channels */}
      <Card>
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            🔔 Alert Channels
          </h2>

          <div className="space-y-3">
            {[
              { key: 'email', label: '📧 Email Alerts', icon: '✉️' },
              { key: 'inApp', label: '💬 In-App Notifications', icon: '🔔' },
              { key: 'slack', label: '💬 Slack Notifications', icon: '🚀' },
            ].map((channel) => (
              <label
                key={channel.key}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={formData.alerts?.[channel.key as keyof typeof formData.alerts] || false}
                  onChange={(e) =>
                    handleChange(`alerts.${channel.key}`, e.target.checked)
                  }
                  className="w-5 h-5 rounded border-gray-300 text-indigo-600 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-gray-900 dark:text-white font-medium">
                  {channel.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </Card>

      {/* Display Preferences */}
      <Card>
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            🎨 Display Preferences
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Theme
              </label>
              <div className="space-y-2">
                {(['light', 'dark', 'auto'] as const).map((theme) => (
                  <label
                    key={theme}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="theme"
                      value={theme}
                      checked={formData.preferences?.theme === theme}
                      onChange={(e) =>
                        handleChange('preferences.theme', e.target.value)
                      }
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span className="text-gray-900 dark:text-white capitalize">
                      {theme === 'auto' ? 'Auto (System)' : theme}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Auto-Refresh Update Frequency
              </label>
              <select
                value={formData.preferences?.updateFrequency || 30}
                onChange={(e) =>
                  handleChange('preferences.updateFrequency', parseInt(e.target.value))
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value={10}>10 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
                <option value={300}>5 minutes</option>
                <option value={600}>10 minutes</option>
              </select>
            </div>

            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={formData.preferences?.autoRefresh || true}
                onChange={(e) =>
                  handleChange('preferences.autoRefresh', e.target.checked)
                }
                className="w-5 h-5 rounded border-gray-300 text-indigo-600 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-gray-900 dark:text-white font-medium">
                Enable Auto-Refresh
              </span>
            </label>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 sticky bottom-0 bg-white dark:bg-gray-950 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSave}
          disabled={!hasChanges || updating}
          loading={updating}
        >
          💾 Save Settings
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={handleReset}
          disabled={!hasChanges}
        >
          ↩️ Reset Changes
        </Button>
      </div>
    </div>
  );
};
