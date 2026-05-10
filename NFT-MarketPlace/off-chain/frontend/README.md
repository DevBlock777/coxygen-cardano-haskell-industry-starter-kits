# NFT Marketplace Frontend

React/Vite frontend for the Cardano NFT marketplace. It lets users connect a wallet, mint NFTs, view wallet NFTs, list NFTs for sale, browse active listings, buy NFTs, update listing prices, and cancel sales.

The app targets the Cardano `Preprod` network and uses Lucid, Blockfrost, and the project backend.

## Features

- Connects a Cardano browser wallet: Lace, Nami, or Eternl.
- Mints NFTs with a name and description.
- Supports an optional image or PDF file during minting.
- Uploads the file through the backend only when a file is selected.
- Creates CIP-721 metadata with `image: ipfs://...` only when a CID is returned.
- Displays NFTs from the connected wallet and NFTs locked at the marketplace smart contract.
- Shows a deterministic emoji fallback when no IPFS image/file is available.
- Supports sell, buy, price update, and cancel transactions through the smart contract.
- Shows user feedback with SweetAlert2 and a Preprod explorer link.

## Stack

- React 19
- Vite
- React Router
- Lucid Cardano
- Blockfrost API
- SweetAlert2
- TypeScript for configuration and helper files

## Structure

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
    │   ├── Home.jsx      # Active marketplace listings
    │   ├── Mint.jsx      # Mint form
    │   ├── Sell.jsx      # Wallet NFTs available to sell
    │   └── NavBar.jsx    # Navigation and wallet connection
    ├── utilities/
    │   ├── connectWallet.js
    │   ├── showTx.ts
    │   └── validator.js
    └── css/
```

## Routes

Routes are defined in `src/App.jsx`:

- `/`: `Home`, active marketplace listings.
- `/sell`: `Sell`, NFTs in the connected wallet.
- `/mint`: `Mint`, NFT creation form.

The navigation bar is rendered above all routes.

## Wallet Connection

Wallet logic lives in `src/utilities/connectWallet.js`.

When a wallet is connected, the app:

- initializes Lucid with Blockfrost on `Preprod`;
- enables Lace, Nami, or Eternl depending on the available wallet;
- reads the wallet address;
- derives the marketplace validator address.

The connected address is stored in `localStorage` so the app can try to reconnect after a page reload.

## Minting

Minting is implemented in `src/Components/Mint.jsx` and `mintNFT(...)` in `src/utilities/connectWallet.js`.

The file input is optional. The behavior is:

- if the user selects an image or PDF, the frontend sends the file to the backend with `POST /upload`;
- the backend returns a `cid` for the file stored through Lighthouse/IPFS;
- the frontend mints the NFT with CIP-721 metadata containing `name`, `description`, and `image: ipfs://<cid>`;
- if no file is selected, the frontend does not call `POST /upload`;
- in that case, Lighthouse is not used by the frontend and the NFT is minted without image metadata;
- after minting, the frontend sends the transaction hash to the backend with `POST /tx` and `txType: "MINT"`.

The file input accepts:

- images with `image/*`;
- PDFs with `application/pdf`.

When a file is selected, `Mint.jsx` shows a preview: an image preview for images, and an iframe preview for PDFs.

## NFT Display

NFTs are read from Blockfrost in `getWalletNft()` and `getValidatorNfts()`.

When an NFT has an `ipfs://...` image in its metadata, the UI replaces the IPFS prefix with the Lighthouse gateway:

```text
https://gateway.lighthouse.storage/ipfs/
```

If no usable image link exists, the UI displays an emoji instead. The emoji is generated deterministically by `getNftEmoji(nft)` from the NFT identifier, so the same NFT keeps the same placeholder in both `Home` and `Sell`.

This fallback matters for NFTs minted without a file: since no Lighthouse upload was performed, there is no IPFS image to display.

## Selling And Marketplace

The `Sell` page loads wallet NFTs with `getWalletNft()`. For each NFT, the user enters a price in ADA, then `sellNft(...)` locks the NFT at the marketplace contract with an inline datum containing:

- the price in lovelace;
- the policy id;
- the asset name;
- the seller public key hash.

The `Home` page loads NFTs held at the validator address with `getValidatorNfts()`. It supports:

- buying an NFT with `buyNft(...)`;
- updating the listing price with `updateNft(...)`;
- cancelling a sale with `cancelNft(...)`.

## Backend

The frontend uses the URL defined by `VITE_BASE_URL`.

Called endpoints:

### `POST /upload`

Called only during minting when the user selected a file. The backend handles the Lighthouse/IPFS upload and returns a `cid`.

### `POST /tx`

Called after minting to store the transaction in the backend database:

```json
{
  "address": "wallet_address",
  "txHash": "transaction_hash",
  "txType": "MINT"
}
```

Sell, buy, update, and cancel transactions are currently handled on-chain by the frontend and are not sent to `/tx`.

## Environment Variables

Create a `.env` file in `frontend/`:

```env
VITE_BLOCKFROST_PROJECT_ID=your_blockfrost_project_id
VITE_BASE_URL=http://localhost:3000
```

`VITE_BLOCKFROST_PROJECT_ID` is used to read assets and interact with Cardano Preprod through Blockfrost.

`VITE_BASE_URL` is used to call the backend during minting.

## Installation

From the `frontend/` directory:

```bash
npm install
```

## Development

```bash
npm run dev
```

By default, Vite serves the app at:

```text
http://localhost:5173
```

## Build And Verification

```bash
npm run build
npm run preview
npm run lint
```

## Important Notes

- The application is configured for Cardano `Preprod`, not mainnet.
- A Cardano browser wallet is required for blockchain actions.
- The backend must be running to mint with a file and to store mint transactions.
- Lighthouse/IPFS is used only when a file is added during minting.
- Without an uploaded file, the UI displays an emoji instead of an image.
