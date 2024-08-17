import { useState } from 'react';
import { mnemonicToSeed } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { Keypair, Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import nacl from 'tweetnacl';
const alchemySolanaRpcUrl = 'https://solana-mainnet.g.alchemy.com/v2/YTOtieFe3dC8dZlHtg2mlDl0vi4fFSBz';
const connection = new Connection(alchemySolanaRpcUrl, 'confirmed'); 

export function SolanaWallet({ mnemonic }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);
  const [balances, setBalances] = useState({});

  const handleAddWallet = () => {
    const seed = mnemonicToSeed(mnemonic);
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString('hex')).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);
    const publicKey = keypair.publicKey.toBase58();

    setCurrentIndex(currentIndex + 1);
    setPublicKeys([...publicKeys, publicKey]);
    fetchBalance(publicKey); 
  };

  const fetchBalance = async (publicKeyString) => {
    try {
      const publicKey = new PublicKey(publicKeyString); 
      const balance = await connection.getBalance(publicKey);
      setBalances(prev => ({
        ...prev,
        [publicKeyString]: balance / LAMPORTS_PER_SOL 
      }));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  return (
    <div className='app-container'>
      <button onClick={handleAddWallet}>
        Add SOL wallet
      </button>
      <ul className="wallet-list">
        {publicKeys.map((publicKey, index) => (
          <li key={index} className="wallet-item">
            {publicKey} - Balance: {balances[publicKey] !== undefined ? `${balances[publicKey]} SOL` : 'trying to fetch'}
            <button onClick={() => fetchBalance(publicKey)} className="balance-button">
              Refresh Balance
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
