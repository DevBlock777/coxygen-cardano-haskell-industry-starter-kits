# NFT Marketplace Backend

This backend powers the server-side features of the NFT marketplace application. It is responsible for accepting asset uploads, sending uploaded files to Lighthouse/IPFS storage, and recording blockchain transaction metadata in a MariaDB database through Prisma.

## What This Backend Does

The backend provides two main responsibilities:

- Upload NFT-related files received from the frontend.
- Store transaction history linked to wallet addresses.

In practice, the backend sits between the frontend and external services:

- It receives HTTP requests from the frontend application.
- It uploads files to Lighthouse decentralized storage.
- It saves transaction information in the database.
- It applies CORS protection so only the configured frontend origin can access the API.

## Tech Stack

- Node.js
- Express 5
- TypeScript
- Prisma ORM
- MariaDB Prisma adapter
- Multer for file uploads
- Lighthouse Web3 SDK for IPFS-style storage
- dotenv for environment variables

## Project Structure

```text
backend/
├── package.json               # Scripts and dependencies
├── tsconfig.json              # TypeScript configuration
├── src/
│   ├── app.ts                 # Express application setup
│   ├── server.ts              # Server startup entry point
│   ├── router/index.ts        # API routes
│   ├── config/db.ts           # Prisma + MariaDB connection
│   ├── config/functions.ts    # Transaction helper
│   ├── tests/                 # Backend tests
│   ├── prisma/schema.prisma   # Database schema
│   ├── prisma/migrations/     # Prisma migrations
│   └── generated/prisma/      # Generated Prisma client
└── uploads/                   # Temporary uploaded files
```

## How It Works

### 1. Server startup

The server starts from `src/server.ts`.

At startup it:

- Loads environment variables.
- Imports the Express app from `src/app.ts`.
- Enables JSON body parsing.
- Enables CORS for the frontend URL defined in the environment.
- Mounts the main router.
- Listens on port `3000`.

### 2. File upload flow

The `POST /upload` route:

- Accepts a single file with Multer using the `file` field name.
- Stores the file temporarily in the local `uploads/` folder.
- Uploads that file to Lighthouse.
- Returns the generated CID hash to the frontend.

This CID can then be used to build a public gateway URL such as:

```text
https://gateway.lighthouse.storage/ipfs/<CID>
```

### 3. Transaction storage flow

The `POST /tx` route:

- Receives `address`, `txHash`, and `txType` in the request body.
- Calls the `addTx(...)` helper.
- Saves the transaction in the `Transaction` table through Prisma.
- Returns a boolean result indicating whether the insert succeeded.

## API Endpoints

### `POST /upload`

Uploads a file to Lighthouse.

Expected form-data:

- `file`: the file to upload

Success response example:

```json
{
  "cid": "QmExampleHash"
}
```

### `POST /tx`

Stores a blockchain transaction in the database.

Expected JSON body:

```json
{
  "address": "addr_test1...",
  "txHash": "abc123...",
  "txType": "SELL"
}
```

Allowed `txType` values:

- `MINT`
- `SELL`
- `BUY`
- `CANCEL`
- `UPDATE`

Success response example:

```json
{
  "result": true
}
```

## Database Model

The backend currently defines one main Prisma model:

### `Transaction`

- `id`: unique UUID
- `address`: wallet address
- `tStamp`: creation timestamp
- `txHash`: blockchain transaction hash
- `txType`: transaction type enum

This model is used to keep a lightweight transaction history for marketplace activity.

## Environment Variables

Create a `.env` file in the `backend/` directory with the required values.

Required variables used by the code:

```env
FRONTEND_URL=http://localhost:5173
VITE_LIGHTHOUSE_API_KEY=your_lighthouse_api_key
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_NAME=your_db_name
DATABASE_URL=mysql://user:password@localhost:3306/database
```

### Notes

- `FRONTEND_URL` is used by CORS to allow frontend requests.
- `LIGHTHOUSE_API_KEY` is used to authenticate uploads to Lighthouse.
   You can get yours here https://files.lighthouse.storage/dashboard/apikey
- `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, and `DATABASE_NAME` are used by the MariaDB Prisma adapter at runtime.
- `DATABASE_URL` is used by Prisma configuration for migrations and Prisma tooling.

## Installation

From the `backend/` directory:

```bash
npm install
```

## Development

Run the backend in watch mode:

```bash
npm run dev
```

The server listens on:

```text
http://localhost:3000
```

## Build

Compile the TypeScript project:

```bash
npm run build
```

## Tests

The backend includes automated tests for the API.

Current coverage includes:

- `POST /upload` error handling when no file is provided

Run the test suite from the `backend/` directory:

```bash
npm run test
```

The tests are written with:

- Mocha
- Chai
- Supertest
- TypeScript via `tsx`

## Database and Prisma

The backend uses Prisma with a MySQL-compatible datasource and a MariaDB adapter.

After creating a database named `nft`, go to the `backend/src` directory and run the following commands to initialize the database schema:

```bash
npx prisma reset
npx prisma migrate dev
npx prisma generate
```

These commands will reset the Prisma state, apply the migrations, and generate the Prisma client used by the backend.

Typical Prisma workflow:

```bash
npx prisma generate --schema src/prisma/schema.prisma
npx prisma migrate dev --schema src/prisma/schema.prisma
```

Existing migrations are stored in:

```text
src/prisma/migrations/
```

## Current Backend Responsibilities Summary

This backend is intentionally small and focused. Its current role is to:

- expose the HTTP API used by the frontend
- upload NFT assets to Lighthouse storage
- persist transaction metadata in MariaDB
- provide a simple bridge between marketplace actions and stored backend records

