import { useRef, useState } from "react";
import "../css/mint.css";
import { mintNFT } from "../utilities/connectWallet";
import { showTx } from "../utilities/showTx";
import { useNavigate } from "react-router-dom";



export default function Mint() {
    const navigate = useNavigate()
    const nftNameRef = useRef(null);
    const nftImageRef = useRef(null)
    const nftDes = useRef(null)
    const [preview, setPreview] = useState(null);
    const [minting, setMinting] = useState(false)
    async function handleMint(e) {
        e.preventDefault();
        setMinting(true)
        const name = nftNameRef.current?.value;
        const description = nftDes.current?.value
        console.log("Minting NFT with name:", name);
        let hash, minterAddress;
        const BASE_URL = import.meta.env.VITE_BASE_URL
        console.log("Base urk",BASE_URL);
        if(nftImageRef.current.files[0]){
        const file = nftImageRef.current.files[0]
        
        let formData = new FormData()
        formData.append("file",file)
         let res= await fetch(`${BASE_URL}/upload`,{
            method: "POST",
            body: formData
        })
        let data = await res.json()
        const {cid} = data
        console.log("data",{data});
        
        // alert("File uploaded to IPFS with CID: " + cid);
         const {txHash,walletAddress} = await mintNFT(name, cid, description);
         hash = txHash
         minterAddress = walletAddress
    } else {
        const {txHash,walletAddress} = await mintNFT(name,  null, description);
        hash = txHash
        minterAddress = walletAddress
    }
            res = await fetch(`${BASE_URL}/tx`,{
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({
                address: minterAddress,
                txHash: hash,
                txType: "MINT",
            })
         })
        data = await res.json()
        const {result} = data
        setMinting(false)
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
                    NFT Image (Optional):
                    <input type="file" accept="application/pdf,image/*" ref={nftImageRef}

                        onChange={(e) => {
                            const file = e.target.files[0];
                            console.log({file});
                            
                            if (file) {
                                setPreview({
                                    url: URL.createObjectURL(file),
                                    type: file.type,
                                }
                                );
                                
                            }
                        }}
                         />
                    {preview && (
  <div className="preview" style={{ marginTop: "10px" }}>
    {preview.type.startsWith("image/") && (
      <img
        src={preview.url}
        alt="Image preview"
        style={{ width: "200px", borderRadius: "8px" }}
      />
    )}

    {preview.type === "application/pdf" && (
      <iframe
        src={preview.url}
        title="PDF preview"
        width="200"
        height="260"
        style={{ border: "1px solid #ccc", borderRadius: "8px" }}
      />
    )}
  </div>
)}
                </label>

                <button type="submit" onClick={handleMint} className="mint-btn" >
                    {minting && <p>Minting...</p>}
                     {!minting && <p>Mint</p>}
                </button>
            </form>
        </div>
    );
}