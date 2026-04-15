# 🧠 Plutus Smart Contracts Setup Guide with Nix & Cabal

<img src="https://github.com/user-attachments/assets/fe3da9b9-c2cf-4c2a-8ad6-b66e543e530a" alt="placeholder" width="80" height="50">
**Pheidippides — rapid Plutus Application Development (rPAD)**

Aim: To promote rapid, easy learning, simplification, and development on Cardano. Just like a Greek messenger Pheidippides, who ran to deliver good news of victory, rPAD aims to quickly deliver quick dApps to Cardano communities.

Welcome to the Plutus development onboarding guide! This document walks you through:

* Installing **Nix** (with **flakes** + `nix-command`) on **Ubuntu, Fedora, Arch, Windows WSL2, and Windows native**
* Entering a reproducible dev shell
* Building with **Cabal**
* Understanding the **Vesting** contracts and utilities

> 📂 NOTE: Detailed tutorials live in `/code/wspace/lecture`.

---

## 📚 Table of Contents

1. [🧰 Prerequisites](#1-🧰-prerequisites)
2. [⚙️ Environment Setup (Nix + Flakes)](#2-⚙️-environment-setup-nix--flakes)

   * 2.1 [Ubuntu](#21-ubuntu)
   * 2.2 [Fedora](#22-fedora)
   * 2.3 [Arch](#23-arch)
   * 2.4 [Windows (WSL2)](#24-windows-wsl2)
   * 2.5 [Windows (Native)](#25-windows-native)
   * 2.6 [Verify Your Setup](#26-verify-your-setup)
3. [📦 Building the Project](#3-📦-building-the-project)
4. [📁 Folder Structure](#4-📁-folder-structure)
5. [🔍 Understanding the Contracts](#5-🔍-understanding-the-contracts)

   * 5.1 [Basic Vesting](#51-basic-vesting)
   * 5.2 [Parameterized Vesting](#52-parameterized-vesting)
6. [🔧 Utilities Breakdown](#6-🔧-utilities-breakdown)
7. [🧪 Testing and Debugging](#7-🧪-testing-and-debugging)
8. [📖 Glossary of Terms](#8-📖-glossary-of-terms)
9. [📝 License and Contributions](#9-📝-license-and-contributions)

From Zero to Hero Haskell Plutus Flake.nix Template

![image](https://github.com/user-attachments/assets/b6a0150c-e1cc-4fe9-91d9-46eac28deb29)

![image](https://github.com/user-attachments/assets/e6206f18-9231-42ed-8456-10a936e21b15)

[Coming... Offchain Helios](https://github.com/wimsio/coxygen/wiki/Helios-Haskell-Smart-Contract-Development)

---

## 1. 🧰 Prerequisites

* **Git** CLI
* **Nix** (we’ll install it below with flakes enabled)
* Optional: **VS Code** + [Haskell extension](https://marketplace.visualstudio.com/items?itemName=haskell.haskell)

---

## 2. ⚙️ Environment Setup (Nix + Flakes)

### Start with # 🚀 NIX SETUP.md Tutorial (with Problems & Solutions) file in this directory

> We recommend **multi-user (daemon) installs** on Linux and **WSL2** for Windows. Flakes are enabled via `NIX_CONFIG` or `/etc/nix/nix.conf`.

### 🔧 Common shell snippet (Linux/WSL)

Add to `~/.bashrc` (or `~/.zshrc`) to always load Nix and enable flakes:

```bash
# Nix profile (added by me)
if [ -e /nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh ]; then
  . /nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh
elif [ -e "$HOME/.nix-profile/etc/profile.d/nix.sh" ]; then
  . "$HOME/.nix-profile/etc/profile.d/nix.sh"
fi

# Enable Nix experimental features for this shell
export NIX_CONFIG="experimental-features = nix-command flakes"
```

> ✅ **System-wide alternative** (Linux/WSL):
> Create `/etc/nix/nix.conf` (no need for the `export` above if you do this):
>
> ```conf
> experimental-features = nix-command flakes
> ```

---

### 2.1 Ubuntu

**Install (daemon):**

```bash
sh <(curl -L https://nixos.org/nix/install) --daemon
. /nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh
```

**Optional system-wide flakes:**

```bash
sudo mkdir -p /etc/nix
echo 'experimental-features = nix-command flakes' | sudo tee /etc/nix/nix.conf
```

---

### 2.2 Fedora

> SELinux is enabled by default. If the daemon won’t start, check `journalctl -u nix-daemon`.

**Install (daemon):**

```bash
sh <(curl -L https://nixos.org/nix/install) --daemon
. /nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh
sudo systemctl enable --now nix-daemon
```

**Optional system-wide flakes:**

```bash
sudo mkdir -p /etc/nix
echo 'experimental-features = nix-command flakes' | sudo tee /etc/nix/nix.conf
```

---

### 2.3 Arch

**Install (daemon):**

```bash
sh <(curl -L https://nixos.org/nix/install) --daemon
. /nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh
sudo systemctl enable --now nix-daemon
```

**Optional system-wide flakes:**

```bash
sudo mkdir -p /etc/nix
echo 'experimental-features = nix-command flakes' | sudo tee /etc/nix/nix.conf
```

---

### 2.4 Windows (WSL2)

> **Recommended** Windows path for Plutus dev.

**Enable systemd in WSL (once):**

```bash
sudo tee /etc/wsl.conf >/dev/null <<'EOF'
[boot]
systemd=true
EOF
```

Then, in **Windows PowerShell**:

```powershell
wsl --shutdown
```

Reopen Ubuntu (WSL).

**Install (daemon) inside WSL:**

```bash
sh <(curl -L https://nixos.org/nix/install) --daemon
. /nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh
sudo systemctl enable --now nix-daemon
```

**Optional system-wide flakes (inside WSL):**

```bash
sudo mkdir -p /etc/nix
echo 'experimental-features = nix-command flakes' | sudo tee /etc/nix/nix.conf
```

---

### 2.5 Windows (Native)

> Native Nix on Windows is evolving. Prefer WSL2 if possible. If you proceed natively, enable flakes via **PowerShell**:

**User-level persistent env:**

```powershell
setx NIX_CONFIG "experimental-features = nix-command flakes"
```

(Reopen PowerShell.)

**Optional profile for immediate effect:**

```powershell
if (!(Test-Path $PROFILE)) { New-Item -Type File -Path $PROFILE -Force | Out-Null }
Add-Content $PROFILE '$env:NIX_CONFIG = "experimental-features = nix-command flakes"'
```

**If you use Git Bash/MSYS**, you can add the same Linux snippet to `~/.bashrc` and adjust any profile paths installed by the native Nix package.

---

### 2.6 Verify Your Setup

```bash
nix --version
nix flake --help
nix doctor
```

On Linux/WSL:

```bash
systemctl status nix-daemon
```

---

## 3. 📦 Building the Project

### a) Clone and Enter

```bash
git clone <your-repo-url>
cd plutus-nix
```

### b) Enter the Dev Shell (flakes)

```bash
nix develop
```

If not using flakes:

```bash
nix-shell
```

### c) Build with Cabal

```bash
cabal update
cabal build all
```

This builds both the **`Utilities`** library and the **`wspace`** smart contract/test modules.

---

## 4. 📁 Folder Structure

```text
plutus-nix/
├── .devcontainer/
├── .vscode/
├── code/
│   ├── dist-newstyle/
│   ├── nix/
│   ├── Utilities/
│   │   ├── src/
│   │   │   └── Utilities/
│   │   │       ├── Conversions.hs
│   │   │       ├── PlutusTx.hs
│   │   │       ├── Serialise.hs
│   │   │       └── Utilities.hs
│   │   ├── Utilities.cabal
│   │   └── hie.yaml
│   ├── wspace/
│   │   ├── assets/
│   │   ├── lecture/
│   │   │   ├── Main.hs
│   │   │   ├── NFTMarketPlace.hs
│   │   ├── test/
│   │   │   ├── Spec.hs
│   │   ├── docs/
│   │   ├── Tutorials.md
│   │   ├── cabal.project
│   │   └── wspace.cabal
├── .gitignore
├── flake.nix
└── README.md
```

---

## 5. 🔍 Understanding the Contracts

### 5.1 Basic Vesting

* **File**: `lecture/Vesting.hs`
* Validates that:

  * A transaction is signed by the **beneficiary**
  * The **deadline** has been reached

### 5.2 Parameterized Vesting

* **File**: `lecture/ParameterizedVesting.hs`
* Accepts:

  * `beneficiary :: PubKeyHash`
  * `deadline :: POSIXTime`
* Uses `liftCode` to embed these at compile time

---

## 6. 🔧 Utilities Breakdown

### Address Utilities

* **File**: `lecture/CGPlutusUtilsv1.hs`

  * Decode Bech32 → PubKeyHash
  * Encode PubKeyHash → Bech32 (mainnet/testnet)

### Time Utilities

* **File**: `lecture/CGTime.hs`

  * POSIX, ISO8601, UTC conversions
  * Time arithmetic: add/diff/getNow

---

## 7. 🧪 Testing and Debugging

### Test Entry

```haskell
main :: IO ()
main = defaultMain tests
```

### Test Files

```text
test/
├── CGPlutusUtilsSpec.hs
├── CGTimeSpec.hs
├── VestingSpec.hs
├── ParameterizedVestingSpec.hs
├── Spec.hs
└── Main.hs
```

Run tests via:

```bash
cabal test all
```

---

## 8. 📖 Glossary of Terms

| Term                     | Description                                         |
| ------------------------ | --------------------------------------------------- |
| **POSIXTime**            | Seconds since the Unix epoch                        |
| **PubKeyHash (PKH)**     | Hash of a wallet's public key                       |
| **Validator**            | The on-chain logic for validation                   |
| **ScriptContext**        | Transaction context during validation               |
| **liftCode / applyCode** | Embeds values directly into compiled code           |
| **Bech32**               | Human-readable address format for Cardano           |
| **txSignedBy**           | Checks if a transaction is signed by a specific PKH |
| **Utilities Library**    | Helper functions for off-chain dev/test             |
| **Cabal / Nix**          | Build and environment tools for Haskell & Plutus    |

### 🆕 Additional Glossary Terms

| Term      | Description                                            |
| --------- | ------------------------------------------------------ |
| **UTxO**  | Unspent transaction output, Cardano’s accounting model |
| **Datum** | On-chain data attached to UTxOs                        |
| **GADT**  | Generalized Algebraic Data Type in Haskell             |
| **HRP**   | Human-Readable Part of a Bech32 string                 |

---

## 9. 📝 License and Contributions

### License

```
MIT License

Copyright (c) 2025 Women In Move Solutions (Pty) Ltd & Coxygen Global (Pty) Ltd
...
```

### Author & Ownership

* **Author:** Bernard Sibanda
* **Company:** Coxygen Global (Pty) Ltd
* **Date:** 27 September, 2025

**Who is Bernard Sibanda?** (Professional Intro omitted here for brevity; keep your original “Professional Introduction” section beneath this license block as-is.)

---

## 🔧 Troubleshooting (Quick)

* **`nix flake` unknown:** Ensure your shell loaded the snippet or `/etc/nix/nix.conf` has `experimental-features = nix-command flakes`.
* **Daemon issues (Linux/WSL):**

  ```bash
  sudo systemctl status nix-daemon
  journalctl -u nix-daemon -e
  ```

  On WSL, confirm `/etc/wsl.conf` has `systemd=true` and you ran `wsl --shutdown`.
* **`nix develop` not found:** You’re not on flakes; either enable flakes or use `nix-shell`.
* **Cabal can’t find GHC:** Enter the Nix dev shell first (`nix develop`) so toolchains are pinned.

---

