
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { Menu, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export default function Header(){
  const { publicKey } = useWallet(); 

  return (
    <header className="w-full bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-900 fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
    
        <div className="flex items-center gap-3 select-none">
          <div className="h-9 w-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <span className="font-bold text-base text-indigo-500">K</span>
          </div>
          <span className="font-bold text-sm tracking-tight text-white uppercase sm:normal-case">
            Token Launchpad
          </span>
        </div>

        {/* Desktop Interface Button Display */}
        <div className="hidden md:flex items-center">
          <WalletMultiButton>
            {/* Removed 'asChild'. Only pass children if not connected. */}
            {!publicKey ? "Connect Wallet" : null}
          </WalletMultiButton>
        </div>

        {/* Mobile Configuration */}
        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger >
              <button className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            
            <SheetContent side="right" className="w-full sm:max-w-full bg-[#09090b] border-l-0 p-6 flex flex-col justify-between">
              <div>
                <SheetHeader className="flex flex-row items-center justify-between border-b border-zinc-900 pb-4 mb-8">
                  <SheetTitle className="text-white text-base font-semibold">Account Options</SheetTitle>
                  <SheetClose className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                    <X className="h-4 w-4" />
                  </SheetClose>
                </SheetHeader>
                
                <div className="w-full [&>*]:w-full [&_button]:w-full [&_button]:justify-center">
                  <WalletMultiButton>
                    {/* Removed 'asChild' here as well */}
                    {!publicKey ? "Connect Wallet" : null}
                  </WalletMultiButton>
                </div>
              </div>
              
              <div className="text-center text-xs text-zinc-600 font-mono select-none">
                Kaanch Network Terminal v1.0
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}