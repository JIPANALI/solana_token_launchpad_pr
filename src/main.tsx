import  { useMemo } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Style & Theme Custom Components
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { Toaster } from "./components/ui/sonner.tsx";

// Solana Web3 Context Providers
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';

// Import Official Wallet Selection Modal Styles
import '@solana/wallet-adapter-react-ui/styles.css';

const RootComponent = () => {
  // Direct RPC endpoint targeting Solana Devnet ecosystem nodes
  const endpoint = "https://api.devnet.solana.com";

  // Cache supported wallet options explicitly to optimize re-render cycles
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter()
  ], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <App />
            <Toaster />
          </ThemeProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

createRoot(document.getElementById("root")!).render(<RootComponent />);