# NFT Marketplace

This project is a Cardano NFT marketplace. Its structure is based on a clear separation between:

- `on-chain`: everything that is intended to be used on the blockchain
- `off-chain`: everything that is used outside the blockchain

This organization makes it easier to distinguish the blockchain logic from the application, interface, and backend service layers.

## Overall Project Structure

```text
NFT-MarketPlace/
├── on-chain/
│   ├── code/
│   │   ├── Utilities/
│   │   ├── nix/
│   │   └── wspace/
│   ├── README.md
│   ├── NIX SETUP.md
│   ├── flake.nix
│   └── default.nix
├── off-chain/
│   ├── frontend/
│   └── backend/
└── README.md
```

## Folder Meaning

### `on-chain`

The `on-chain` folder contains everything related to the blockchain logic of the project.

It mainly includes:

- smart contracts and validator logic written in Haskell/Plutus
- marketplace rules executed through blockchain scripts
- the Nix-based development and build environment
- tests and documentation related to the blockchain part

In other words, `on-chain` corresponds to what is meant to run on or define behavior for the Cardano blockchain.

#### Important `on-chain` subfolders

- `on-chain/code/`
  Contains the main source code for the blockchain part of the project.

- `on-chain/code/wspace/`
  Main Haskell workspace for the project.

- `on-chain/code/wspace/lecture/`
  Contains the core on-chain business logic files, especially `NFTMarketPlace.hs` and `Main.hs`.

- `on-chain/code/wspace/tests/`
  Contains tests for the on-chain code.

- `on-chain/code/Utilities/`
  Utility library used by the Haskell project.

- `on-chain/code/nix/`
  Contains files related to the Nix environment setup.

- `on-chain/flake.nix`, `on-chain/default.nix`, `on-chain/code/cabal.project`
  Configuration files used to build and run the on-chain project.

### `off-chain`

The `off-chain` folder contains everything used outside the blockchain.

This is the application layer that interacts with the smart contracts, the user, and external services.

In other words, `off-chain` contains everything that does not execute on the blockchain itself.

#### Important `off-chain` subfolders

- `off-chain/frontend/`
  User interface of the application. This part allows users to connect their wallet, view NFTs, and trigger actions such as minting, listing, buying, updating, or canceling.

- `off-chain/backend/`
  Backend server of the application. It handles complementary off-chain services such as API management, file uploads, data persistence, and communication with external services.

## Functional Reading Of The Project

The project can be understood in the following way:

1. `on-chain` defines the blockchain rules of the NFT marketplace.
2. `off-chain/frontend` provides the interface and prepares user interactions.
3. `off-chain/backend` provides the technical services required outside the blockchain.

This separation makes the responsibilities clear:

- `on-chain` = blockchain logic, validation, scripts
- `off-chain` = interface, orchestration, APIs, storage, integrations

## Key Files To Start With

If you want to understand the project quickly, the most useful files to start with are:

- `on-chain/code/wspace/lecture/NFTMarketPlace.hs`
- `on-chain/code/wspace/lecture/Main.hs`
- `on-chain/README.md`
- `off-chain/frontend/README.md`
- `off-chain/backend/README.md`

## Summary

The project structure follows one simple idea:

- `on-chain` contains what lives on the blockchain side
- `off-chain` contains what lives outside the blockchain

This makes the project easier to read, maintain, and extend.
