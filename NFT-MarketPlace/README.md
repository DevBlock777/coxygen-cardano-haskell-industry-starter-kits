# NFT Marketplace

Ce projet est une marketplace NFT sur Cardano. Il est organisé autour d'une séparation claire entre :

- `on-chain` : tout ce qui concerne la logique exécutée ou déployée sur la blockchain
- `off-chain` : tout ce qui fonctionne en dehors de la blockchain pour piloter l'application

L'objectif de cette structure est de bien distinguer la partie smart contracts/validator de la partie application métier, interface utilisateur et services backend.

## Structure générale du projet

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

## Signification des dossiers

### `on-chain`

Le dossier `on-chain` contient les éléments qui servent à définir la logique blockchain du projet.

On y retrouve notamment :

- les scripts et smart contracts écrits en Haskell/Plutus
- la logique de validation utilisée par la marketplace NFT
- l'environnement de compilation et d'exécution Nix
- les fichiers de test et de documentation liés à la partie blockchain

Autrement dit, `on-chain` correspond à ce qui va être utilisé sur la blockchain Cardano.

#### Sous-structure importante de `on-chain`

- `on-chain/code/`
  Contient le code source principal de la partie blockchain.

- `on-chain/code/wspace/`
  Espace de travail principal du projet Haskell.

- `on-chain/code/wspace/lecture/`
  Contient les fichiers de la logique métier on-chain, notamment `NFTMarketPlace.hs` et `Main.hs`.

- `on-chain/code/wspace/tests/`
  Contient les tests de la partie on-chain.

- `on-chain/code/Utilities/`
  Bibliothèque utilitaire utilisée par le projet Haskell.

- `on-chain/code/nix/`
  Contient les fichiers liés à la gestion de l'environnement Nix.

- `on-chain/flake.nix`, `on-chain/default.nix`, `on-chain/code/cabal.project`
  Fichiers de configuration pour construire et exécuter le projet on-chain.

### `off-chain`

Le dossier `off-chain` regroupe tout ce qui est utilisé hors de la blockchain.

Il correspond à la partie applicative qui permet d'interagir avec les smart contracts, avec l'utilisateur et avec les services externes.

Autrement dit, `off-chain` contient tout ce qui n'est pas exécuté sur la blockchain elle-même.

#### Sous-structure importante de `off-chain`

- `off-chain/frontend/`
  Interface utilisateur de l'application. C'est la partie qui permet à l'utilisateur de connecter son wallet, consulter les NFTs et lancer des actions comme le mint, la vente, l'achat, la mise à jour ou l'annulation.

- `off-chain/backend/`
  Serveur backend de l'application. Il prend en charge les services complémentaires hors blockchain comme la gestion d'API, l'upload de fichiers, la persistance de certaines données et la communication avec des services externes.

## Lecture fonctionnelle du projet

Le projet peut donc se comprendre comme suit :

1. La partie `on-chain` définit les règles blockchain de la marketplace NFT.
2. La partie `off-chain/frontend` fournit l'interface et prépare les interactions utilisateur.
3. La partie `off-chain/backend` fournit les services techniques nécessaires en dehors de la blockchain.

Cette séparation permet de mieux comprendre les responsabilités :

- `on-chain` = logique blockchain, validation, scripts
- `off-chain` = interface, orchestration, API, stockage, intégrations

## Fichiers clés pour démarrer

Si vous souhaitez comprendre rapidement le projet, les fichiers les plus utiles sont :

- `on-chain/code/wspace/lecture/NFTMarketPlace.hs`
- `on-chain/code/wspace/lecture/Main.hs`
- `on-chain/README.md`
- `off-chain/frontend/README.md`
- `off-chain/backend/README.md`

## Résumé

La structuration du projet repose sur une idée simple :

- `on-chain` contient ce qui vit côté blockchain
- `off-chain` contient ce qui vit en dehors de la blockchain

Cette organisation rend le projet plus lisible, plus maintenable et plus simple à faire évoluer.
