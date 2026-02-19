import { NextRequest, NextResponse } from 'next/server';

// In-memory storage (would be database in production)
let settings = {
  alerts: {
    costThreshold: 300,
    costAlertEmail: 'polycarpohu@gmail.com',
    costAlertSlack: false,
    serviceDownAlertEnabled: true,
    agentInactivityThreshold: 3600000, // 1 hour
  },
  monitoring: {
    enableRealtime: true,
    updateInterval: 5000, // 5 seconds
    retentionDays: 30,
    logLevel: 'info',
  },
  services: {
    whitelist: [
      'Clawdbot Gateway',
      'n8n',
      'Languase',
      'Chroma',
      'Odrant',
    ],
    checkInterval: 60000, // 1 minute
  },
  agents: {
    maxConcurrent: 8,
    defaultModel: 'claude-3-5-sonnet-20241022',
    telemetryEnabled: true,
  },
};

export async function GET() {
  return NextResponse.json({
    settings,
    lastUpdated: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Merge new settings with existing
    if (body.alerts) {
      settings.alerts = { ...settings.alerts, ...body.alerts };
    }
    if (body.monitoring) {
      settings.monitoring = { ...settings.monitoring, ...body.monitoring };
    }
    if (body.services) {
      settings.services = { ...settings.services, ...body.services };
    }
    if (body.agents) {
      settings.agents = { ...settings.agents, ...body.agents };
    }

    return NextResponse.json({
      success: true,
      settings,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 400 }
    );
  }
}
