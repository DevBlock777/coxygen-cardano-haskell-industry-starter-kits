# NFT Marketplace Frontend

This frontend is the user-facing application of the NFT marketplace. It lets users connect a Cardano wallet, mint NFTs, list owned NFTs for sale, browse active listings, buy listed NFTs, update sale prices, and cancel listings.

The application is built with React and Vite and interacts with three main external layers:

- the Cardano Preprod network through Lucid
- Blockfrost for blockchain asset data
- the backend API for file uploads and transaction logging

## What This Frontend Does

The frontend is responsible for:

- connecting a supported Cardano browser wallet
- minting NFT assets and metadata on Cardano Preprod
- uploading NFT files through the backend to Lighthouse/IPFS
- reading wallet NFTs and marketplace listings
- submitting smart-contract transactions for sell, buy, update, and cancel actions
- showing user feedback after blockchain transactions are submitted

## Tech Stack

- React 19
- Vite
- React Router
- Lucid Cardano
- Blockfrost API
- Lighthouse
- SweetAlert2
- TypeScript support for tooling

## Project Structure

```text
frontend/
├── package.json                  # Scripts and dependencies
├── vite.config.ts                # Vite configuration
├── index.html                    # App entry HTML
├── public/                       # Static assets
├── services/
│   └── lightHouse.js             # Lighthouse upload helper
└── src/
    ├── main.jsx                  # React entry point
    ├── App.jsx                   # Router configuration
    ├── index.css                 # Global styles
    ├── Components/
    │   ├── Home.jsx              # Marketplace listing page
    │   ├── Mint.jsx              # NFT mint page
    │   ├── Sell.jsx              # Wallet NFT sell page
    │   ├── NavBar.jsx            # Main navigation + wallet connect
    │   └── MintPDF.jsx           # Extra minting component not currently routed
    ├── utilities/
    │   ├── connectWallet.js      # Cardano wallet and contract logic
    │   ├── showTx.ts             # Success and error modal helpers
    │   └── validator.js          # Plutus validator CBOR
    └── css/                      # Page-specific styles
```

## Application Flow

### 1. App startup

The app starts in `src/main.jsx` and wraps the application with `BrowserRouter`.

Routing is defined in `src/App.jsx`:

- `/` -> `Home`
- `/sell` -> `Sell`
- `/mint` -> `Mint`

A shared navigation bar is rendered above the page routes.

### 2. Wallet connection

The wallet connection logic lives in `src/utilities/connectWallet.js`.

The app currently supports these browser wallets if they are installed:

- Lace
- Nami
- Eternl

When a wallet is connected, the app:

- initializes Lucid with Blockfrost
- selects the wallet API
- reads the user wallet address
- derives the validator address used by the marketplace contract

The app is configured to work on the Cardano `Preprod` network.

### 3. Minting flow

The minting page is implemented in `src/Components/Mint.jsx`.

When a user mints an NFT, the frontend:

- collects the NFT name, description, and file
- sends the file to the backend `POST /upload` endpoint
- receives a CID from the backend after the file is uploaded to Lighthouse
- builds NFT metadata using the returned CID
- submits the mint transaction with Lucid
- sends the transaction hash to the backend `POST /tx` endpoint with `txType: "MINT"`
- shows a success modal with a Preprod explorer link

### 4. Selling flow

The sell page is implemented in `src/Components/Sell.jsx`.

It loads NFTs from the connected wallet, lets the user enter a price, and submits a smart-contract transaction that locks the NFT at the marketplace validator with an inline datum containing sale information.

### 5. Marketplace listing flow

The home page is implemented in `src/Components/Home.jsx`.

It loads NFTs currently held by the validator address and displays active listings. From this page, a user can:

- buy a listed NFT
- update the listing price
- cancel the listing

The page also detects whether the connected wallet is the seller of a listing.

## Smart Contract Integration

The frontend contains the validator script in `src/utilities/validator.js` and the transaction logic in `src/utilities/connectWallet.js`.

Main blockchain actions implemented in the frontend:

- `mintNFT(...)`
- `sellNft(...)`
- `buyNft(...)`
- `updateNft(...)`
- `cancelNft(...)`
- `getWalletNft()`
- `getValidatorNfts()`

The frontend therefore contains most of the client-side Cardano interaction logic, while the backend mainly supports file upload and transaction persistence.

## Backend Communication

The frontend communicates with the backend through a base URL defined by an environment variable.

Currently used backend endpoints:

### `POST /upload`

Used by the mint page to upload the selected NFT file before minting.

### `POST /tx`

Used after minting to persist the transaction hash and wallet address in the backend database.

## Environment Variables

Create a `.env` file in the `frontend/` directory.

Variables used by the frontend code:

```env
VITE_LIGHTHOUSE_API_KEY=your_lighthouse_api_key
VITE_BLOCKFROST_PROJECT_ID=your_blockfrost_project_id
VITE_BASE_URL=http://localhost:3000
```

### Notes

- `VITE_BLOCKFROST_PROJECT_ID` is required to query blockchain and asset data through Blockfrost.
- `VITE_BASE_URL` is required by the mint flow to call the backend API.
- `VITE_LIGHTHOUSE_API_KEY` exists in the project configuration and helper service, although the main mint flow currently uploads through the backend instead of using the frontend Lighthouse helper directly.

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

## Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Lint the project:

```bash
npm run lint
```

## User-Facing Pages

### `Home`

- shows NFTs listed on the marketplace validator
- displays price information extracted from inline datum values
- allows buy, update, and cancel actions

### `Sell`

- reads NFTs from the connected wallet
- allows the user to set a listing price in ADA
- sends the NFT to the marketplace smart contract

### `Mint`

- accepts image or PDF uploads
- previews the selected file
- uploads the file through the backend
- mints a new NFT with metadata pointing to IPFS

## Alerts and Feedback

The app uses SweetAlert2 in `src/utilities/showTx.ts` to:

- show success messages with a Preprod CExplorer transaction link
- show error messages for wallet and transaction failures

## Supported Assets and Metadata

The UI attempts to render NFT media using on-chain metadata fetched from Blockfrost. If an NFT has an `ipfs://` image link, the app converts it to a Lighthouse gateway URL for display.

If no usable image is available, the interface falls back to a deterministic emoji placeholder.

## Important Implementation Notes

- The application is designed for Cardano `Preprod`, not mainnet.
- A supported Cardano browser wallet is required for most actions.
- The mint flow depends on the backend being available and correctly configured.
- The app stores the connected wallet address in `localStorage` and tries to reconnect on reload.
- Some transaction types such as sell, buy, update, and cancel are handled directly on-chain in the frontend without currently being logged to the backend.

## Current Frontend Responsibilities Summary

This frontend is the main interaction layer of the NFT marketplace. It:

- manages wallet connection and blockchain actions
- displays wallet NFTs and marketplace NFTs
- coordinates minting with the backend upload service
- submits marketplace smart-contract transactions
- provides the full user interface for the marketplace workflow

## Possible Future Improvements

- add stronger form validation before submitting blockchain actions
- add loading and error states consistently across every page
- document wallet compatibility and setup in more detail
- log additional transaction types to the backend, not only minting
- add route protection or clearer wallet-required UI states
- keep `.env.example` aligned with every environment variable actually required by the app
