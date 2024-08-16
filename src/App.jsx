import { useState } from 'react';
import './App.css';
import { generateMnemonic } from 'bip39';
import { SolanaWallet } from './components/SolanaWallet';
import { EthWallet } from './components/ETHWallet';
function App() {
  const [mnemonic, setMnemonic] = useState("");

  const handleGenerateMnemonic = async () => {
    const mn = await generateMnemonic();
    setMnemonic(mn);
  };

  return (
    <div className="app-container">
      <input
        type="text"
        placeholder='Press the button to generate'
        value={mnemonic}
        readOnly
        className="mnemonic-input"
      />
      <button onClick={handleGenerateMnemonic} className="generate-button">
        Create Seed Phrase
      </button>
      {mnemonic && (
        <>
          <SolanaWallet mnemonic={mnemonic} />
          <EthWallet mnemonic={mnemonic} />
        </>
      )}
    </div>
  );
}

export default App;
