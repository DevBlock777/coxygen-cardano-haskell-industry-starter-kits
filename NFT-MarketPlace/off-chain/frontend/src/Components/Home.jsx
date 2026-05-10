import { useEffect, useState } from "react";
import "../css/home.css";
import { getValidatorNfts, getNftEmoji, hexToString, buyNft, cancelNft, updateNft } from "../utilities/connectWallet";
import { Data } from "https://unpkg.com/lucid-cardano@0.10.11/web/mod.js";
import { showErrorMsg, showTx } from "../utilities/showTx";

function Home() {
    const [nfts, setNfts] = useState([]);
    const [editingNft, setEditingNft] = useState(null);
    const [newPrice, setNewPrice] = useState("");
    const [loading,setLoading] = useState(true)

    useEffect(() => {
        async function fetchNfts() {
            const fetchedNfts = await getValidatorNfts();
            setNfts(fetchedNfts);
        }
        fetchNfts();
        // setLoading(false)
    }, []);

    async function handleBuy(nft) {
        const price = extractPriceFromDatum(nft.utxo);
        if (!price) {
            alert("This NFT is not for sale.");
            return;
        }
        const {txHash, walletAddress} = await buyNft(price, nft);
         const BASE_URL = import.meta.env.VITE_BASE_URL
        console.log({BASE_URL, txHash, walletAddress});
        const res = await fetch(`${BASE_URL}/tx`,{
                    method: "POST",
                    headers: {
                       "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        address: walletAddress,
                        txHash: txHash,
                        txType: "BUY",
                    })
                 })
                const data = await res.json()
                const {result} = data
                console.log({data} , " updata");
        const updatedNfts = await getValidatorNfts();
        setNfts(updatedNfts);
        showTx(txHash);
    }

    async function handleCancel(nft) {
        const {txHash, walletAddress} = await cancelNft(nft);
        const updatedNfts = await getValidatorNfts();
           const BASE_URL = import.meta.env.VITE_BASE_URL
        console.log({BASE_URL, txHash, walletAddress});
        const res = await fetch(`${BASE_URL}/tx`,{
                    method: "POST",
                    headers: {
                       "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        address: walletAddress,
                        txHash: txHash,
                        txType: "CANCEL",
                    })
                 })
                const data = await res.json()
                const {result} = data
                console.log({data} , " updata");
        setNfts(updatedNfts);

        if (txHash !== undefined) showTx(txHash);
    }

    async function handleUpdate(nft) {
        if (!newPrice || parseFloat(newPrice) <= 0) {
            alert("Please enter a valid price");
            return;
        }
        const {txHash,walletAddress} = await updateNft(parseInt(newPrice), nft);
        setEditingNft(null);
        setNewPrice("");
        const updatedNfts = await getValidatorNfts();
        setNfts(updatedNfts);
        const BASE_URL = import.meta.env.VITE_BASE_URL
        console.log({BASE_URL, txHash, walletAddress});
        const res = await fetch(`${BASE_URL}/tx`,{
                    method: "POST",
                    headers: {
                       "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        address: walletAddress,
                        txHash: txHash,
                        txType: "UPDATE",
                    })
                 })
                const data = await res.json()
                const {result} = data
                console.log({data} , " updata");
                
            
        if (txHash !== undefined) showTx(txHash);
    }

    function startEditing(nft) {
        setEditingNft(nft.unit);
        const currentPrice = extractPriceFromDatum(nft.utxo);
        setNewPrice(currentPrice || "");
    }

    function cancelEditing() {
        setEditingNft(null);
        setNewPrice("");
    }

    function extractPriceFromDatum(utxo) {
        try {
            if (!utxo.datum) return null;
            const datum = Data.from(utxo.datum);
            if (datum && datum.fields && datum.fields.length >= 1) {
                const priceInLovelace = datum.fields[0];
                const priceInADA = Number(priceInLovelace) / 1_000_000;
                return priceInADA.toFixed(2);
            }
            return null;
        } catch (error) {
            console.error("Error extracting price:", error);
            return null;
        }
    }

    return (
        <div className="wrap">
            <header>
                <h1>NFT <span style={{ color: 'var(--gold)' }}>Market</span></h1>
                <div className="header-right">
                    <span className="nft-count">{nfts.length} LISTINGS</span>
                </div>
            </header>

            <div className="layout">
                <main className="card">
                    <h2>Active Listings</h2>

                    <div className="listings" aria-live="polite">
                        {!loading ? (
                            <div className="no-nfts">
                                <p>No NFTs currently listed for sale.</p>
                            </div>
                        ) : (
                            nfts.map((nft, index) => {
                                const price = extractPriceFromDatum(nft.utxo);
                                const isEditing = editingNft === nft.unit;

                                return (
                                    <article key={index} className="nft" aria-label={`NFT ${nft.assetName}`}>
                                        <div className="nft-media">
                                            <div className="nft-emoji">
                                                {nft.image ? (
                                                    <img
                                                        src={nft.image.replace("ipfs://", "https://gateway.lighthouse.storage/ipfs/")}
                                                        alt="NFT preview"
                                                    />
                                                ) : (
                                                    getNftEmoji(nft)
                                                )}
                                            </div>
                                        </div>

                                        <div className="nft-body">
                                            <div className="meta">
                                                <div className="title">{nft.assetName}</div>
                                                {price && (
                                                    <div className="price">{price} ₳</div>
                                                )}
                                            </div>

                                            <div className="policy-info">
                                                <span className="policy-text">
                                                    {nft.policyId.slice(0, 8)}…{nft.policyId.slice(-4)}
                                                </span>
                                                {price && <span className="badge">For Sale</span>}
                                                {nft.result && <span className="badge owner-badge">Owned</span>}
                                            </div>

                                            {isEditing ? (
                                                <div className="update-form">
                                                    <div className="form-row">
                                                        <label>New Price (ADA)</label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            min="0.01"
                                                            value={newPrice}
                                                            onChange={(e) => setNewPrice(e.target.value)}
                                                            placeholder="Enter new price"
                                                            className="price-input"
                                                        />
                                                    </div>
                                                    <div className="controls">
                                                        <button
                                                            onClick={() => handleUpdate(nft)}
                                                            className="primary"
                                                            disabled={!newPrice || parseInt(newPrice) <= 0}
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button onClick={cancelEditing} className="ghost">
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="controls">
                                                    {price ? (
                                                        <>
                                                            <button onClick={() => handleBuy(nft)} className="primary">Buy</button>
                                                            <button onClick={() => startEditing(nft)} className="ghost">Update</button>
                                                            <button onClick={() => handleCancel(nft)} className="ghost">Cancel</button>
                                                        </>
                                                    ) : (
                                                        <button className="primary">Sell</button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </article>
                                );
                            })
                        )}
                    </div>
                </main>
            </div>

            <footer>
                Connected to Cardano Smart Contract · Blockchain Verified
            </footer>
        </div>
    );
}

export default Home;