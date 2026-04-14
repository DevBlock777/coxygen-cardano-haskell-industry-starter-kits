import { useRef, useState } from "react";
import "../css/mint.css";
import { mintNFT } from "../utilities/connectWallet";
import { showTx } from "../utilities/showTx";
import { useNavigate } from "react-router-dom";
import { uploadFile } from "../../services/lightHouse";



export default function MintPDF() {
    const navigate = useNavigate()
    const nftNameRef = useRef(null);
    const nftImageRef = useRef(null)
    const nftDes = useRef(null)
    const [preview, setPreview] = useState(null);
    async function handleMint(e) {
        e.preventDefault();
        const name = nftNameRef.current?.value;
        const description = nftDes.current?.value
        console.log("Minting NFT with name:", name);
        const file = nftImageRef.current.files[0]
        const CID = await uploadFile([file])
        // try {
        const txHash = await mintNFT(name, CID, description);
        showTx(txHash);
        // } catch (error) {
        //     console.error("Error minting NFT:", error);
        //     alert("Failed to mint NFT.");
        // }
        navigate("/")
    }
    return (
        <div className="mint-container">
            <h1>Mint An NFT</h1>

            <form className="mint-form">
                <label>
                    NFT Name:
                    <input type="text" id="name" ref={nftNameRef} required />
                </label>
                <label>
                    NFT Description:
                    <input type="text" id="description" ref={nftDes} required
                        maxLength={60} />
                </label>
                <label>
                    NFT Image:
                    <input type="file" accept="image/*" ref={nftImageRef}

                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                setPreview(URL.createObjectURL(file));
                            }
                        }}
                        required />
                    {preview && (
                        <div className="preview">
                            <img
                                src={preview}
                                alt="NFT preview"
                                style={{
                                    width: "200px",
                                    borderRadius: "8px",
                                    marginTop: "10px",
                                }}
                            />
                        </div>
                    )}
                </label>

                <button type="submit" onClick={handleMint} className="mint-btn" >
                    Mint
                </button>
            </form>
        </div>
    );
}