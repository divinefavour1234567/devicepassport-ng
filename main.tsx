import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { PollarProvider, WalletButton } from '@pollar/react';
import '@pollar/react/styles.css';
import './style.css';

const publishableKey = import.meta.env.VITE_POLLAR_PUBLISHABLE_KEY as string | undefined;
function Root(){
  if (!publishableKey) return <App />;
  return <PollarProvider client={{ apiKey: publishableKey, stellarNetwork: 'testnet' }}><App /></PollarProvider>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><Root /></React.StrictMode>);
