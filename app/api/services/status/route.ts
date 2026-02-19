import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const SERVICES = {
  langfuse: process.env.LANGFUSE_URL || "http://localhost:3000",
  anythingllm: process.env.ANYTHINGLLM_URL || "http://localhost:3001",
  ollama: process.env.OLLAMA_URL || "http://localhost:11434",
  qdrant: process.env.QDRANT_URL || "http://localhost:6333",
  chroma: process.env.CHROMA_URL || "http://localhost:8000",
  searxng: process.env.SEARXNG_URL || "http://localhost:8080",
};

async function checkService(name: string, url: string) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    let checkUrl = url;
    if (name === "langfuse") checkUrl = `${url}/api/public/health`;
    if (name === "anythingllm") checkUrl = `${url}/api/ping`;
    if (name === "ollama") checkUrl = `${url}/api/tags`;
    if (name === "qdrant") checkUrl = `${url}/healthz`;
    if (name === "chroma") checkUrl = `${url}/api/v2/heartbeat`;

    const response = await fetch(checkUrl, {
      signal: controller.signal,
      method: "GET",
    });

    clearTimeout(timeoutId);

    return {
      name,
      status: response.ok ? "online" : "error",
      url,
      responseTime: response.headers.get("X-Response-Time") || "N/A",
    };
  } catch (error) {
    return {
      name,
      status: "offline",
      url,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const checks = await Promise.all(
    Object.entries(SERVICES).map(([name, url]) => checkService(name, url))
  );

  const summary = {
    total: checks.length,
    online: checks.filter((c) => c.status === "online").length,
    offline: checks.filter((c) => c.status === "offline").length,
    services: checks,
  };

  return NextResponse.json(summary);
}
