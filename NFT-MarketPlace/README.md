# Cardano NFT Marketplace

This project is a Cardano NFT marketplace built around a React frontend, an Express backend, and smart-contract interactions on the Cardano `Preprod` network.

It allows users to:

- connect a supported Cardano wallet
- mint NFTs with metadata and media files
- upload NFT media to Lighthouse/IPFS
- list NFTs for sale through a marketplace validator
- browse active listings
- buy listed NFTs
- update listing prices
- cancel listings
- store selected transaction records in a backend database

## Project Overview

The application is split into two main parts:

- `frontend/`: the user interface and Cardano interaction layer
- `backend/`: the API for file uploads and transaction persistence

The frontend handles most blockchain actions directly with Lucid, while the backend supports upload and database concerns.

## Main Features

- Cardano wallet connection
- NFT minting on Cardano Preprod
- Lighthouse/IPFS media upload
- Marketplace listing display
- Sell, buy, update, and cancel marketplace actions
- Transaction logging for mint activity
- MariaDB persistence through Prisma

## Architecture

```text
User
  -> Frontend (React + Vite)
     -> Cardano wallet extension
     -> Blockfrost API
     -> Smart contract / validator on Cardano Preprod
     -> Backend API (Express)
        -> Lighthouse upload service
        -> MariaDB database via Prisma
```

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Lucid Cardano
- Blockfrost API
- SweetAlert2

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- MariaDB adapter
- Multer
- Lighthouse Web3 SDK

## Repository Structure

```text
.
├── frontend/                    # React application
│   ├── src/                     # Components, utilities, styles
│   ├── services/                # External service helpers
│   └── README.md                # Frontend documentation
├── backend/                     # Express API and database layer
│   ├── src/                     # Server, routes, Prisma config
│   ├── uploads/                 # Temporary uploaded files
│   └── README.md                # Backend documentation
└── README.md                    # Project overview
```

## How The Project Works

### 1. Wallet connection

The frontend connects to a Cardano browser wallet such as Lace, Nami, or Eternl.

Once connected, the app initializes Lucid on the `Preprod` network and can:

- read wallet UTxOs
- derive the validator address
- build and submit transactions

### 2. NFT minting

When a user mints an NFT:

- the frontend collects the NFT name, description, and media file
- the file is sent to the backend
- the backend uploads the file to Lighthouse and returns a CID
- the frontend creates NFT metadata using that CID
- the frontend submits the mint transaction on Cardano Preprod
- the frontend sends the mint transaction hash to the backend for storage

### 3. NFT selling

When a user lists an NFT for sale:

- the frontend loads NFTs from the connected wallet
- the user chooses a price in ADA
- the frontend builds a transaction that locks the NFT at the marketplace validator
- the listing becomes visible on the marketplace home page

### 4. Buying, updating, and canceling listings

The home page reads NFTs currently held by the validator address.

From there, the frontend can:

- buy a listed NFT
- update the sale price
- cancel a listing

These actions are executed directly through Cardano transactions built in the frontend.

### 5. Transaction persistence

The backend stores transaction data in a MariaDB database through Prisma.

The current schema includes a `Transaction` table with:

- wallet address
- timestamp
- transaction hash
- transaction type

## Network and Services

This project currently targets:

- Cardano `Preprod`
- Blockfrost for blockchain API access
- Lighthouse for decentralized file storage
- MariaDB for backend persistence

## Environment Variables

### Frontend

Create `frontend/.env` with values such as:

```env
VITE_BLOCKFROST_PROJECT_ID=your_blockfrost_project_id
VITE_LIGHTHOUSE_API_KEY=your_lighthouse_api_key
VITE_BASE_URL=http://localhost:3000
```

### Backend

Create `backend/.env` with values such as:

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

## Getting Started

### 1. Install frontend dependencies

```bash
cd frontend
npm install
```

### 2. Install backend dependencies

```bash
cd ../backend
npm install
```

### 3. Configure environment variables

Create and fill:

- `frontend/.env`
- `backend/.env`

### 4. Start the backend

From `backend/`:

```bash
npm run dev
```

Backend default URL:

```text
http://localhost:3000
```

### 5. Start the frontend

From `frontend/`:

```bash
npm run dev
```

Frontend default URL:

```text
http://localhost:5173
```

## Build Commands

### Frontend

```bash
cd frontend
npm run build
```

### Backend

```bash
cd backend
npm run build
```

## Development Notes

- The frontend contains the main smart-contract logic.
- The backend is intentionally small and focused on uploads and transaction storage.
- NFT media is displayed through an IPFS gateway when available.
- A Cardano wallet extension is required for most marketplace actions.
- The project is currently designed for test and development usage on `Preprod`, not production mainnet usage.

## Documentation

More detailed documentation is available here:

- [frontend/README.md](/home/dakdak/code/nft-market-place-frontend/frontend/README.md)
- [backend/README.md](/home/dakdak/code/nft-market-place-frontend/backend/README.md)

## Current Scope

This project demonstrates a full Cardano NFT marketplace workflow across:

- wallet connection
- NFT minting
- decentralized media upload
- smart-contract-based listing and purchasing
- backend transaction persistence

## Possible Future Improvements

- add authentication and stronger access control
- add validation and better API error handling
- log more transaction types in the backend
- improve loading states and UX feedback in the frontend
- add automated tests for frontend and backend flows
- prepare configuration for mainnet deployment if needed
