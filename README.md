# Logam Mulia API

Cloudflare Workers API untuk Logam Mulia. Dibangun dengan Hono framework dan TypeScript.

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Framework**: Hono
- **Language**: TypeScript

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

API akan tersedia di `http://localhost:8787`

## Deploy

```bash
npm run deploy
```

## Endpoints

| Method | Endpoint    | Description    |
|--------|-------------|----------------|
| GET    | `/`         | Welcome message |
| GET    | `/health`   | Health check    |

## Project Structure (Feature-Based)

```
src/
├── index.ts                 # Main entry point
└── features/
    ├── root/                # Root endpoint feature
    │   ├── root.route.ts    # Route handlers
    │   └── index.ts         # Feature exports
    └── health/              # Health check feature
        ├── health.route.ts  # Route handlers
        ├── health.service.ts # Business logic
        └── index.ts         # Feature exports
```

### Adding a New Feature

1. Create a new directory under `src/features/your-feature/`
2. Create `your-feature.route.ts` for routes
3. Create `your-feature.service.ts` for business logic
4. Create `index.ts` to export the feature
5. Import and register in `src/index.ts`

## Environment Variables

Copy `.env.example` to `.dev.vars` untuk development:

```bash
cp .env.example .dev.vars
```

## License

MIT
