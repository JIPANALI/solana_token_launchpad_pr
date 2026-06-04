
import Header from './components/Header';
import TokenLaunchPad from './components/TokenLaunchPad';

export default function App() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 pt-24 pb-12">
      <Header />
      <main className="max-w-3xl mx-auto px-2">
        <div className="bg-zinc-900/50 border border-zinc-800  p-2 md:p-10 shadow-xl">
          <h1 className="text-3xl font-extrabold text-white mb-2">Token Launchpad</h1>
          <p className="text-zinc-400 mb-8">
            Create your custom token on Solana Token-2022. Please ensure your metadata URI is valid.
          </p>
          <TokenLaunchPad />
        </div>
      </main>
    </div>
  );
}
