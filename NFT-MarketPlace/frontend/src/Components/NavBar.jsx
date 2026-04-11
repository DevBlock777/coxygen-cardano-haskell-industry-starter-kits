import { useNavigate } from "react-router-dom";
import "../css/navbar.css";
import { connectWallet } from "../utilities/connectWallet";
import { useEffect, useState } from "react";

const NavBar = () => {
    const navigate = useNavigate();
    const [lucid, setLucid] = useState(null);
    const [walletAddress, setWalletAddress] = useState(null);

    useEffect(() => {
        const connectedBefore = localStorage.getItem("ADDRESS")
        if (!connectedBefore) return

        const reconnect = async () => {
            const result = await connectWallet()
            setWalletAddress(result.walletAddress)
        }

        reconnect()

    }, [])

    const handleConnectWallet = async () => {
        const result = await connectWallet();
        if (result) {
            setWalletAddress(result.walletAddress);
            setLucid(result.lucid);
            localStorage.setItem("WALLET", lucid)
            localStorage.setItem("ADDRESS", result.walletAddress)
        }

    }

    return (
        <nav>
            <ul>
                <li>
                    <button type="button" onClick={() => navigate("/")}>Home</button>
                </li>
                <li>
                    <button type="button" onClick={() => navigate("/sell")}>Sell</button>
                </li>
                <li>
                    <button type="button" onClick={() => navigate("/mint")}>Mint</button>
                </li>
                {/* <li>
                    <button type="button" onClick={() => navigate("/mintpdf")}>MintPDF</button>
                </li> */}
                <li>
                    <button type="button" onClick={handleConnectWallet}>
                        {walletAddress
                            ? walletAddress.slice(0, 6) + "..." + walletAddress.slice(-6)
                            : "Connect Wallet"}
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;