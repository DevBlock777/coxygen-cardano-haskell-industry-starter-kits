# NFT Marketplace Frontend

This frontend is the user-facing application of the Cardano NFT Marketplace. It lets users connect a Cardano wallet, mint NFTs, list owned NFTs for sale, browse active listings, buy listed NFTs, update listing prices, and cancel listings.

The application is built with React and Vite. It interacts with:

- Cardano Preprod through Lucid;
- Blockfrost for asset and metadata lookup;
- the backend API for file uploads and transaction persistence.

## What This Frontend Does

The frontend is responsible for:

- connecting a supported Cardano browser wallet;
- minting NFT assets on Cardano Preprod;
- uploading NFT media only when a file is selected during minting;
- displaying wallet NFTs and marketplace listings;
- using an emoji fallback when an NFT has no uploaded media;
- submitting smart-contract transactions for sell, buy, update, and cancel actions;
- sending submitted transaction hashes to the backend;
- showing success and error feedback to users.

## Tech Stack

- React 19
- Vite
- React Router
- Lucid Cardano
- Blockfrost API
- SweetAlert2
- TypeScript support for tooling and helper files

## Project Structure

```text
frontend/
├── package.json
├── vite.config.ts
├── index.html
├── public/
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── Components/
    │   ├── Home.jsx
    │   ├── Mint.jsx
    │   ├── Sell.jsx
    │   └── NavBar.jsx
    ├── utilities/
    │   ├── connectWallet.js
    │   ├── showTx.ts
    │   └── validator.js
    └── css/
```

## Frontend Routes

Routing is defined in `src/App.jsx`:

- `/` -> `Home`
- `/sell` -> `Sell`
- `/mint` -> `Mint`

A shared navigation bar is rendered above all page routes.

## Application Flow

### 1. Wallet Connection

Wallet connection logic lives in `src/utilities/connectWallet.js`.

The app supports these browser wallets when installed:

- Lace
- Nami
- Eternl

When a wallet is connected, the app initializes Lucid with Blockfrost on Cardano Preprod, selects the wallet API, reads the wallet address, and derives the marketplace validator address.

The connected wallet address is stored in `localStorage` so the interface can attempt to reconnect after a reload.

### 2. Minting

The minting page is implemented in `src/Components/Mint.jsx`.

The user provides:

- NFT name;
- NFT description;
- optional image or PDF file.

The file is optional. If a file is selected, the frontend uploads it through the backend before minting. The backend returns a CID, and the NFT is minted with CIP-721 metadata containing the IPFS media reference.

If no file is selected:

- the frontend does not call the upload route;
- Lighthouse/IPFS is not used for that mint;
- the NFT is minted without image metadata;
- the UI later displays an emoji placeholder instead of media.

After minting, the frontend records the submitted transaction through the backend transaction route with transaction type `MINT`.

### 3. Selling

The sell page is implemented in `src/Components/Sell.jsx`.

It loads NFTs from the connected wallet, displays each NFT with either its media or emoji fallback, lets the user enter a price in ADA, and submits a transaction that locks the NFT at the marketplace validator.

After the sell transaction is submitted, the frontend records it through the backend transaction route with transaction type `SELL`.

### 4. Marketplace Listings

The home page is implemented in `src/Components/Home.jsx`.

It loads NFTs currently locked at the marketplace validator and displays active listings. From this page, users can:

- buy a listed NFT;
- update a listing price;
- cancel a listing.

After each action, the frontend refreshes the listings and records the transaction through the backend transaction route with the matching transaction type.

## NFT Media Display

NFT media is read from on-chain metadata fetched through Blockfrost.

If an NFT has an `ipfs://` image link, the app displays it through the Lighthouse gateway:

```text
https://gateway.lighthouse.storage/ipfs/
```

If no usable media exists, the app displays a deterministic emoji generated from the NFT identifier. This keeps the same NFT visually consistent across the `Home` and `Sell` pages.

This behavior is important for NFTs minted without a file: since no file was uploaded, there is no Lighthouse/IPFS image to display.

## Backend Routes Used By The Frontend

The frontend calls the backend using the base URL from `VITE_BASE_URL`.

### `POST /upload`

Used only by the mint flow when the user selected a file.

Purpose:

- receives the selected image or PDF from the frontend;
- uploads the file through the backend storage flow;
- returns a CID used by the frontend as the NFT media reference.

Used by:

- `Mint` page

Called when:

- the user mints an NFT with a file.

Not called when:

- the user mints an NFT without a file.

Expected result:

- a CID that can be used as `ipfs://<cid>` in NFT metadata.

### `POST /tx`

Used after each submitted blockchain transaction.

Purpose:

- persists the wallet address;
- persists the submitted transaction hash;
- stores the transaction type for backend history/tracking.

Used by:

- `Mint` page after minting;
- `Sell` page after listing an NFT;
- `Home` page after buy, update, and cancel actions.

Payload shape:

```json
{
  "address": "wallet_address",
  "txHash": "transaction_hash",
  "txType": "TRANSACTION_TYPE"
}
```

Transaction types sent by the frontend:

- `MINT`: after a successful mint transaction.
- `SELL`: after a successful listing transaction.
- `BUY`: after a successful purchase transaction.
- `UPDATE`: after a successful listing price update.
- `CANCEL`: after a successful listing cancellation.

## Smart Contract Integration

The frontend contains the validator script reference in `src/utilities/validator.js` and the Cardano transaction logic in `src/utilities/connectWallet.js`.

Main blockchain actions handled by the frontend:

- minting NFTs;
- reading NFTs from the connected wallet;
- reading listed NFTs from the validator address;
- locking NFTs at the marketplace contract for sale;
- buying listed NFTs;
- updating listing prices;
- cancelling listings.

The marketplace listing datum stores the sale price, policy id, asset name, and seller identity. The home page reads this datum to display listing prices and execute marketplace actions.

## Environment Variables

Create a `.env` file in the `frontend/` directory.

Variables used by the frontend:

```env
VITE_BLOCKFROST_PROJECT_ID=your_blockfrost_project_id
VITE_BASE_URL=http://localhost:3000
```

`VITE_BLOCKFROST_PROJECT_ID` is required for Cardano Preprod access through Blockfrost.

`VITE_BASE_URL` is required for backend calls to `/upload` and `/tx`.

## Installation

From the `frontend/` directory:

```bash
npm install
```

## Development

Start the Vite development server:

```bash
npm run dev
```

The app is usually available at:

```text
http://localhost:5173
```

## Build And Verification

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run the linter:

```bash
npm run lint
```

## Important Notes

- The application is configured for Cardano Preprod, not mainnet.
- A supported Cardano browser wallet is required for blockchain actions.
- The backend must be running for file uploads and transaction persistence.
- Lighthouse/IPFS is used only when a file is selected during minting.
- NFTs minted without an uploaded file are represented with an emoji fallback in the UI.
- Transaction success modals link to the submitted transaction on Preprod CExplorer.
