import { NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const homeDir = process.env.HOME || '/home/pinohu';
    const clawdDir = join(homeDir, 'clawd');
    const memoryDir = join(clawdDir, 'memory');

    // Read MEMORY.md
    let memoryContent = '';
    try {
      memoryContent = await readFile(join(clawdDir, 'MEMORY.md'), 'utf-8');
    } catch {
      memoryContent = 'No MEMORY.md found';
    }

    // Read recent daily memory files
    const dailyMemories: Record<string, string> = {};
    try {
      const files = await readdir(memoryDir);
      const sortedFiles = files.sort().reverse().slice(0, 7); // Last 7 days

      for (const file of sortedFiles) {
        if (file.match(/^\d{4}-\d{2}-\d{2}\.md$/)) {
          try {
            const content = await readFile(join(memoryDir, file), 'utf-8');
            dailyMemories[file] = content.substring(0, 500); // First 500 chars
          } catch {
            // Skip if unreadable
          }
        }
      }
    } catch {
      // Memory dir might not exist
    }

    // Structure knowledge base
    const knowledgeBase = {
      sections: [
        {
          title: 'Long-Term Memory',
          description: 'Curated decisions, lessons, and strategic context',
          content: memoryContent.substring(0, 1000),
          fullPath: 'MEMORY.md',
        },
        {
          title: 'Daily Logs',
          description: 'Recent activity and task completions',
          entries: Object.entries(dailyMemories).map(([date, content]) => ({
            date,
            preview: content,
          })),
        },
        {
          title: 'Governance & Rules',
          description: 'DEOS policies, autonomy levels, escalation paths',
          keywords: ['governance', 'autonomy', 'escalation', 'delegation'],
        },
        {
          title: 'Agent Capabilities',
          description: 'What each specialist agent does',
          keywords: ['agents', 'skills', 'expertise', 'tools'],
        },
        {
          title: 'Procedures & Standards',
          description: 'Conversion standards, deployment protocols, quality gates',
          keywords: ['standards', 'procedures', 'quality', 'gates'],
        },
      ],
      stats: {
        totalEntries: Object.keys(dailyMemories).length + 1,
        lastUpdated: new Date().toISOString(),
      },
    };

    return NextResponse.json(knowledgeBase);
  } catch (error) {
    console.error('Error fetching knowledge base:', error);
    return NextResponse.json(
      {
        sections: [],
        error: 'Could not fetch knowledge base',
        lastUpdated: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
