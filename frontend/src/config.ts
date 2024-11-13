import { webSocket, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';

// use NODE_ENV to not have to change config based on where it's deployed
export const NEXT_PUBLIC_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://tic-tac-toe-gamma-ruby.vercel.app/';
// Add your API KEY from the Coinbase Developer Portal
export const NEXT_PUBLIC_CDP_API_KEY = process.env.NEXT_PUBLIC_CDP_API_KEY;
export const NEXT_PUBLIC_WC_PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID;

export const config = createConfig({
  chains: [base],
  ssr: true,
  syncConnectedChain: true,
  transports: {
    [base.id]: webSocket(`wss://base-mainnet.infura.io/ws/v3/5c94ec345f4d48558614c815668641d6`),
  }
});