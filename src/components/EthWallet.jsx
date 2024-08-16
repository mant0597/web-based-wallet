import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";

export const EthWallet = ({ mnemonic }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [addresses, setAddresses] = useState([]);

    const handleAddWallet = async () => {
        try {
            const seed = await mnemonicToSeed(mnemonic);
            const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
            const hdNode = HDNodeWallet.fromSeed(seed);
            const child = hdNode.derivePath(derivationPath);
            const privateKey = child.privateKey;
            const wallet = new Wallet(privateKey);
            setCurrentIndex(currentIndex + 1);
            setAddresses([...addresses, wallet.address]);
        } catch (error) {
            console.error("Error generating wallet:", error);
        }
    };

    return (
        <div className='app-container'>
            <button onClick={handleAddWallet}>
                Add ETH wallet
            </button>
            <ul className="wallet-list">
                {addresses.map((address, index) => (
                    <li key={index} className="wallet-item">
                        Eth - {address}
                    </li>
                ))}
            </ul>
        </div>
    );
}
