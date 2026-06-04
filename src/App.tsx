import Header from './components/Header';
import TokenLaunchPad from './components/TokenLaunchPad';

export default function App() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col selection:bg-indigo-500/30">
      {/* Navigation/Header element */}
      <Header />

      {/* Main content section: Uses calc() to ensure it takes up exactly the remaining 
        viewport space and centers the inner form perfectly vertically and horizontally.
      */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-3xl bg-zinc-900/30 border border-zinc-800/60 p-6 md:p-10 rounded-2xl shadow-2xl backdrop-blur-md">
          <div className="text-center md:text-left mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
              Token Launchpad
            </h1>
            <p className="text-zinc-400 text-sm max-w-xl">
              Create your custom token on Solana Token-2022. Please ensure your metadata URI is valid.
            </p>
          </div>
          
          {/* Inner form component layout wrapper */}
          <div className="flex justify-center items-center w-full">
            <TokenLaunchPad />
          </div>
        </div>
      </main>
    </div>
  );
}