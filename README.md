# Book Creation

Web-based photobook generator built as an Nx monorepo.

## Stack

- Angular 21 frontend with Hebrew-first RTL UI
- Express + TypeScript backend
- PostgreSQL + Prisma
- Local file storage for uploads, thumbnails, and generated PDFs
- Python renderer pipeline for PDF generation
- Docker-based deployment for Railway

## Workspace

- `apps/web`: Angular application
- `apps/api`: Express API
- `prisma/schema.prisma`: database schema
- `tools/renderer/render_book.py`: PDF rendering entrypoint

## Local Development

1. Copy environment values from `.env.example` into `.env` if needed.
2. Install dependencies:

```bash
npm install
```

3. Generate Prisma client:

```bash
npm run prisma:generate
```

4. Run the API:

```bash
npm run dev:api
```

5. Run the frontend:

```bash
npm run dev:web
```

## Build

```bash
npm run build:api
npm run build:web
```

Note: the Angular production build is pinned to Node 22 for reliable packaging. The repository includes `.nvmrc` for that reason.

## Deployment

The repository includes a `Dockerfile` so Railway can build and run the full-stack app as a single service.
