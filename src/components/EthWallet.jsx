import { useEffect, useState } from "react";
import { mnemonicToSeed } from "bip39";
import { ethers } from "ethers";
import Web3 from "web3";

export const EthWallet = ({ mnemonic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    const provider = new Web3.providers.HttpProvider(
      "https://mainnet.infura.io/v3/Yur_Infra_id" 
    );
    const newWeb3 = new Web3(provider);
    setWeb3(newWeb3);
  }, []);

  const handleAddWallet = async () => {
    try {
      const seed = await mnemonicToSeed(mnemonic);
      const hdNode = ethers.utils.HDNode.fromSeed(seed);
      const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
      const childNode = hdNode.derivePath(derivationPath);
      const wallet = new ethers.Wallet(childNode.privateKey);

      setCurrentIndex(currentIndex + 1);
      setAddresses([...addresses, wallet.address]);

      const newBalance = await web3.eth.getBalance(wallet.address);
      const ether = web3.utils.fromWei(newBalance, "ether");
      setBalances([...balances, Number(ether)]);
    } catch (error) {
      console.error("Error generating wallet or fetching balance:", error);
    }
  };

  return (
    <div className="app-container">
      <button onClick={handleAddWallet} className="add-wallet-button">Add ETH wallet</button>

      <ul className="wallet-list">
        {addresses.map((address, index) => (
          <li key={index} className="wallet-item">
            <div>Eth - {address}</div>
            <div>
              Balance - {balances[index] !== undefined ? `${balances[index]} ETH` : "Loading"}
            </div>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};
