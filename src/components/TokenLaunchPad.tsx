import  { useState } from 'react';
import { Keypair, SystemProgram, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { 
    TOKEN_2022_PROGRAM_ID, 
    getMintLen, 
    createInitializeMetadataPointerInstruction, 
    createInitializeMintInstruction, 
    ExtensionType,
    getAssociatedTokenAddressSync,
    createAssociatedTokenAccountInstruction,
    createMintToInstruction,
    TYPE_SIZE,
    LENGTH_SIZE
} from "@solana/spl-token";
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, Copy, Check, ExternalLink } from "lucide-react";


const TokenLaunchPad = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [loading, setLoading] = useState(false);
    const [mintAddress, setMintAddress] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [uri, setUri] = useState('');
    const [supply, setSupply] = useState('100000');
    const [decimals, setDecimals] = useState('9');

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    async function createToken() {
        if (!publicKey) return alert("Please connect your wallet!");
        if (!name || !symbol || !uri) return alert("Please fill in Name, Symbol, and URI!");
        
        setLoading(true);
        setMintAddress(null); 

        try {
            const mintKeypair = Keypair.generate();

            const metaData = {
                updateAuthority: publicKey,
                mint: mintKeypair.publicKey,
                name: name,
                symbol: symbol,
                uri: uri,
                additionalMetadata: [],
            };

            const baseMintLen = getMintLen([ExtensionType.MetadataPointer]);
            const metadataExtensionOverhead = TYPE_SIZE + LENGTH_SIZE;
            const metadataPayloadLen = pack(metaData).length;
            
            const totalSpaceRequired = baseMintLen + metadataExtensionOverhead + metadataPayloadLen;
            const lamports = await connection.getMinimumBalanceForRentExemption(totalSpaceRequired);

            const associatedToken = getAssociatedTokenAddressSync(
                mintKeypair.publicKey, 
                publicKey, 
                false, 
                TOKEN_2022_PROGRAM_ID
            );

            const rawAmount = BigInt(supply) * (10n ** BigInt(decimals));

            const instructions = [
                SystemProgram.createAccount({
                    fromPubkey: publicKey,
                    newAccountPubkey: mintKeypair.publicKey,
                    space: baseMintLen, 
                    lamports,
                    programId: TOKEN_2022_PROGRAM_ID,
                }),
                createInitializeMetadataPointerInstruction(
                    mintKeypair.publicKey, 
                    publicKey, 
                    mintKeypair.publicKey, 
                    TOKEN_2022_PROGRAM_ID
                ),
                createInitializeMintInstruction(
                    mintKeypair.publicKey, 
                    Number(decimals), 
                    publicKey, 
                    null, 
                    TOKEN_2022_PROGRAM_ID
                ),
                createInitializeInstruction({
                    programId: TOKEN_2022_PROGRAM_ID,
                    mint: mintKeypair.publicKey,
                    metadata: mintKeypair.publicKey,
                    name: metaData.name, 
                    symbol: metaData.symbol, 
                    uri: metaData.uri,
                    mintAuthority: publicKey,
                    updateAuthority: publicKey,
                }),
                createAssociatedTokenAccountInstruction(
                    publicKey, 
                    associatedToken, 
                    publicKey, 
                    mintKeypair.publicKey, 
                    TOKEN_2022_PROGRAM_ID
                ),
                createMintToInstruction(
                    mintKeypair.publicKey, 
                    associatedToken, 
                    publicKey, 
                    rawAmount, 
                    [], 
                    TOKEN_2022_PROGRAM_ID
                )
            ];

            const latestBlockhash = await connection.getLatestBlockhash('confirmed');

            const messageV0 = new TransactionMessage({
                payerKey: publicKey,
                recentBlockhash: latestBlockhash.blockhash,
                instructions,
            }).compileToV0Message();

            const transaction = new VersionedTransaction(messageV0);
            transaction.sign([mintKeypair]);

            const signature = await sendTransaction(transaction, connection);
            console.log("Transaction Signature:", signature);
            
            setMintAddress(mintKeypair.publicKey.toBase58());
            
        } catch (error: any) {
            console.error("Token creation error details:", error);
            const errorString = String(error);
            if (errorString.includes("rejected") || errorString.includes("cancelled")) {
                console.log("Transaction signature cancelled by user.");
            } else {
                alert("Transaction simulation failed. Check console for log trace.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="launchpad-container">
            <div className="glass-card">
                <div className="glass-header">
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-zinc-100">
                        <Sparkles className="h-5 w-5 text-indigo-400" /> 
                        Token Launchpad
                    </h2>
                    <p className="text-sm text-zinc-400 mt-1">
                        Deploy your custom SPL token on the network with one click.
                    </p>
                </div>
                
                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="input-label">Token Name</label>
                            <Input 
                                className="modern-input" 
                                placeholder="e.g. JIPA" 
                                onChange={(e) => setName(e.target.value)} 
                            />
                        </div>
                        <div>
                            <label className="input-label">Symbol</label>
                            <Input 
                                className="modern-input" 
                                placeholder="e.g. JIP" 
                                onChange={(e) => setSymbol(e.target.value)} 
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="input-label">Metadata URI</label>
                        <Input 
                            className="modern-input" 
                            placeholder="https://arweave.net/..." 
                            onChange={(e) => setUri(e.target.value)} 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="input-label">Supply</label>
                            <Input 
                                type="number" 
                                className="modern-input hide-number-spinner" 
                                value={supply} 
                                onChange={(e) => setSupply(e.target.value)} 
                            />
                        </div>
                        <div>
                            <label className="input-label">Decimals</label>
                            <Input 
                                type="number" 
                                className="modern-input hide-number-spinner" 
                                value={decimals} 
                                onChange={(e) => setDecimals(e.target.value)} 
                            />
                        </div>
                    </div>

                    <Button 
                        className="w-full glow-button mt-4" 
                        onClick={createToken} 
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin mr-2 h-4 w-4" /> 
                                Deploying Token...
                            </>
                        ) : (
                            "Deploy Token"
                        )}
                    </Button>

                    {/* Success State */}
                    {mintAddress && (
                        <div className="success-panel">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                                    Deployment Successful
                                </span>
                                <span className="text-xs text-zinc-300 mt-1">Mint Address</span>
                            </div>
                            
                            <div className="mint-address-box">
                                <code className="text-xs text-zinc-100 font-mono select-all truncate flex-1">
                                    {mintAddress}
                                </code>
                                <div className="flex items-center gap-1">
                                    <button 
                                        onClick={() => handleCopy(mintAddress)}
                                        className="text-zinc-400 hover:text-white transition-colors p-1.5 rounded-md hover:bg-zinc-800"
                                        title="Copy Mint Address"
                                    >
                                        {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                                    </button>
                                    <a 
                                        href={`https://explorer.solana.com/address/${mintAddress}?cluster=devnet`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-zinc-400 hover:text-white transition-colors p-1.5 rounded-md hover:bg-zinc-800 flex items-center justify-center"
                                        title="View on Solana Explorer"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TokenLaunchPad;