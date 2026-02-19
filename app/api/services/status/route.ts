import { NextResponse } from 'next/server';

const SERVICES = [
  { name: 'Languase', url: 'http://localhost:3000', timeout: 2000 },
  { name: 'Anythinglin', url: 'http://anythinglin.local', timeout: 2000 },
  { name: 'Oliama', url: 'http://oliama.local', timeout: 2000 },
  { name: 'Odrant', url: 'http://qdrant.local:6333', timeout: 2000 },
  { name: 'Chroma', url: 'http://chroma.local:8000', timeout: 2000 },
  { name: 'Searxng', url: 'http://searxng.local', timeout: 2000 },
  { name: 'n8n', url: 'http://172.20.192.47:30678', timeout: 2000 },
  { name: 'Clawdbot Gateway', url: 'http://localhost:18789', timeout: 2000 },
];

export async function GET() {
  const results = await Promise.allSettled(
    SERVICES.map(async (service) => {
      const startTime = performance.now();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), service.timeout);

      try {
        const response = await fetch(service.url, {
          signal: controller.signal,
          method: 'GET',
        });
        
        clearTimeout(timeout);
        const latency = Math.round(performance.now() - startTime);

        return {
          name: service.name,
          url: service.url,
          status: response.ok || response.status < 500 ? 'online' : 'offline',
          latency,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        clearTimeout(timeout);
        return {
          name: service.name,
          url: service.url,
          status: 'offline',
          latency: null,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        };
      }
    })
  );

  const services = results.map((r) => 
    r.status === 'fulfilled' ? r.value : {
      name: 'Unknown',
      status: 'offline',
      timestamp: new Date().toISOString(),
    }
  );

  const onlineCount = services.filter((s) => s.status === 'online').length;

  return NextResponse.json({
    status: onlineCount === services.length ? 'all-healthy' : 'degraded',
    onlineCount,
    totalCount: services.length,
    services,
    timestamp: new Date().toISOString(),
  });
}
