# Shopify Artist Management App

A Shopify embedded app built with Remix, Shopify Polaris, and Prisma/SQLite.

## Stack

- **Framework**: Remix (Shopify app template)
- **UI**: Shopify Polaris components + App Bridge
- **Database**: Prisma ORM with SQLite (`prisma/dev.sqlite`)
- **Auth**: Shopify OAuth (via `@shopify/shopify-app-remix`)

## Database Model

```prisma
model Artist {
  id       Int     @id @default(autoincrement())
  name     String
  isActive Boolean @default(true)
}
```

## Routes

| Route | Description |
|-------|-------------|
| `/app/artists` | Admin dashboard — list, add, edit, toggle artists |
| `/api/artists` | Public JSON API — returns active artists |

## Getting Started

1. Install dependencies:
   ```bash
   cd shopify-app && npm install
   ```

2. Set up environment variables (copy `.env.example` or configure via Shopify CLI):
   ```
   SHOPIFY_API_KEY=your_api_key
   SHOPIFY_API_SECRET=your_api_secret
   SHOPIFY_APP_URL=https://your-app-url
   ```

3. Push the database schema:
   ```bash
   npm run prisma db push
   ```

4. Start the development server (requires Shopify CLI and Partner account):
   ```bash
   npm run dev
   ```

## API Endpoint

`GET /api/artists` — Returns a JSON array of active artists:

```json
[
  { "id": 1, "name": "Taylor Swift", "isActive": true },
  { "id": 2, "name": "Beyoncé", "isActive": true }
]
```

## Admin Dashboard Features

- View all artists in a table with their active status
- Add a new artist via modal form
- Edit an artist's name via modal
- Toggle an artist's active/inactive status
- Delete an artist (with confirmation)

## Note on POS Extension

The POS UI extension is intentionally not included. Generate it manually via:
```bash
npm run generate extension
```
