# Logam Mulia API

Cloudflare Workers API untuk Logam Mulia.

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

- `GET /` - Welcome message
- `GET /health` - Health check

## Project Structure

```
├── src/
│   └── index.ts       # Main worker entry point
├── wrangler.toml      # Cloudflare Workers configuration
└── package.json
```
