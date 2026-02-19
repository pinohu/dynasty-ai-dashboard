# Dynasty AI Dashboard

A real-time monitoring dashboard for Dynasty AI infrastructure and agents, built with Next.js and React.

## Features

### 🔧 Service Status
- Real-time service health monitoring
- Uptime percentage tracking
- Response time metrics
- Status indicators (healthy, degraded, down, maintenance)
- Auto-refreshing status updates

### 💰 Cost Tracking
- Monthly cost tracking against budget
- Cost trend analysis over the last 30 days
- Cost breakdown by service type (compute, storage, network, services)
- Budget alerts and warnings
- Daily cost averages

### 🤖 Agent Activity
- Live agent session monitoring
- Real-time heartbeat tracking
- Task completion counters
- Current task display
- Session duration tracking
- Real-time event stream (WebSocket/SSE)

### 📚 Knowledge Base
- Display of MEMORY.md contents
- Documentation browser
- Full-text search
- Category filtering
- Markdown rendering support

### ⚙️ Settings
- Cost alert thresholds
- Uptime alert thresholds
- Response time alert thresholds
- Alert channel configuration (Email, In-App, Slack)
- Theme preferences
- Auto-refresh frequency settings

## API Integration

The dashboard consumes the following APIs:

### Core Dashboard
- `GET /api/dashboard` - Full dashboard state
- `GET /api/dashboard/stream` - Server-Sent Events for real-time updates

### Service Status
- `GET /api/services/status` - List of all services with status
- `GET /api/services/status/{id}` - Individual service details

### Cost Tracking
- `GET /api/costs` - Current cost data and metrics
- `GET /api/costs/trend?days=30` - Historical cost trend
- `GET /api/costs/breakdown` - Breakdown by service type

### Agent Activity
- `GET /api/agents/activity` - List of active agent sessions
- `GET /api/agents/activity/{id}` - Individual agent details

### Knowledge Base
- `GET /api/knowledge-base` - Memory and documentation

### Settings
- `GET /api/settings` - Current user settings
- `POST /api/settings` - Update user settings

## Installation

```bash
# Clone the repository
cd dashboard

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with your API base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## Development

```bash
# Start development server
npm run dev

# Build for production
npm build

# Start production server
npm start

# Run linter
npm run lint
```

The dashboard will be available at `http://localhost:3000`

## Architecture

### Components

- **ServiceStatus** - Displays live service health with metrics
- **CostTracking** - Cost visualization and alerts
- **AgentActivity** - Real-time agent monitoring
- **KnowledgeBase** - Documentation and memory browsing
- **Settings** - User preferences and alerts configuration

### Hooks

- `useDashboardState()` - Main dashboard state
- `useServiceStatus()` - Service metrics
- `useCostData()` - Cost information
- `useAgentActivity()` - Agent sessions
- `useKnowledgeBase()` - Documentation
- `useSettings()` - User preferences
- `useDashboardStream()` - Real-time event streaming

### Store (Zustand)

Global state management for:
- Sidebar visibility
- Auto-refresh settings
- Notifications
- User settings
- UI preferences

## Real-Time Updates

The dashboard supports three real-time update methods:

1. **HTTP Polling** - Automatic refetch at configurable intervals
2. **Server-Sent Events (SSE)** - Streaming updates via `/api/dashboard/stream`
3. **WebSocket** - Full-duplex real-time communication (optional)

## Configuration

Edit `NEXT_PUBLIC_API_BASE_URL` in `.env.local` to point to your API server:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
# or for production
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

## Styling

The dashboard uses Tailwind CSS with custom components:

- Dark mode support (via `dark:` classes)
- Responsive design (mobile-first)
- Custom color scheme (indigo primary, gray neutral)
- Smooth transitions and animations

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Response time: < 200ms for most API calls
- Auto-refresh: Configurable from 10s to 10m
- Real-time updates via SSE (low bandwidth)
- Code splitting and lazy loading
- Optimized re-renders with React.memo

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- Proper semantic HTML
- High contrast mode support

## Monitoring Dashboard Metrics

The dashboard tracks:
- API response times
- Service uptime percentages
- Cost burn rates
- Agent task completion rates
- Real-time event latency

## Troubleshooting

### API Connection Issues
1. Check `NEXT_PUBLIC_API_BASE_URL` configuration
2. Verify API server is running
3. Check CORS headers in API responses
4. Review browser console for errors

### Real-time Updates Not Working
1. Ensure API server supports Server-Sent Events
2. Check network tab for `/api/dashboard/stream` connection
3. Verify EventSource compatibility in browser

### Performance Issues
1. Reduce auto-refresh frequency in settings
2. Disable real-time streaming if not needed
3. Check for memory leaks in browser DevTools

## Contributing

When adding new features:
1. Create reusable components in `/components`
2. Add API methods to `/utils/api-client.ts`
3. Create hooks in `/hooks` for data fetching
4. Update TypeScript types in `/types`
5. Test with real API responses

## License

Proprietary - Dynasty AI 2024

## Support

For issues or feature requests, contact the Dynasty AI team.
