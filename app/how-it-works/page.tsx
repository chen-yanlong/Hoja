import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-6 md:px-8">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to home</span>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <div className="container px-6 py-12 md:px-8 md:py-24">
          <div className="mx-auto max-w-3xl space-y-12">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">How Hoja Works</h1>
              <p className="text-xl text-muted-foreground">
                Hoja is a crypto-native food review platform that uses blockchain technology and Zero-Knowledge Proofs
                to create a trustworthy ecosystem for restaurant reviews.
              </p>
            </div>

            <div className="space-y-8">
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Wallet-Based Authentication</h2>
                <p className="text-muted-foreground">
                  Instead of traditional email/password login, Hoja uses cryptocurrency wallets for authentication. This
                  provides a secure and pseudonymous way to interact with the platform.
                </p>
                <div className="rounded-lg bg-green-50 p-6 dark:bg-green-900/20">
                  <h3 className="font-medium text-green-700 dark:text-green-400">Benefits:</h3>
                  <ul className="mt-2 space-y-2 text-green-600 dark:text-green-400">
                    <li>• No need to remember passwords</li>
                    <li>• Enhanced security through cryptographic signatures</li>
                    <li>• Pseudonymous identity protection</li>
                    <li>• Seamless integration with payment system</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Crypto Payments</h2>
                <p className="text-muted-foreground">
                  Hoja enables users to pay for their meals using cryptocurrency at participating restaurants. This
                  creates a fully on-chain record of transactions that can be used for verification.
                </p>
                <div className="rounded-lg bg-green-50 p-6 dark:bg-green-900/20">
                  <h3 className="font-medium text-green-700 dark:text-green-400">Supported Cryptocurrencies:</h3>
                  <ul className="mt-2 space-y-2 text-green-600 dark:text-green-400">
                    <li>• Ethereum (ETH)</li>
                    <li>• Bitcoin (BTC) via Lightning Network</li>
                    <li>• Stablecoins (USDC, DAI)</li>
                    <li>• And more based on restaurant preferences</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Zero-Knowledge Proofs for Reviews</h2>
                <p className="text-muted-foreground">
                  The core innovation of Hoja is the use of Zero-Knowledge Proofs (ZKPs) to verify that reviewers have
                  actually dined and paid at a restaurant without revealing their identity or transaction details.
                </p>
                <div className="rounded-lg border p-6">
                  <h3 className="font-medium">How ZK Proofs Work in Hoja:</h3>
                  <ol className="mt-4 space-y-6">
                    <li className="flex">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/50">
                        1
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium">Transaction Occurs</h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          A user pays for their meal using cryptocurrency at a participating restaurant. This
                          transaction is recorded on the blockchain.
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/50">
                        2
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium">ZK Proof Generation</h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          When writing a review, the user generates a Zero-Knowledge Proof that cryptographically proves
                          they made a transaction at the restaurant without revealing their wallet address or
                          transaction details.
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/50">
                        3
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium">Verification</h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          The platform verifies the proof, confirming that the reviewer is legitimate without knowing
                          who they are. This prevents fake reviews while maintaining privacy.
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/50">
                        4
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium">Anonymous Publication</h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          The review is published with a "ZK Verified" badge, indicating it comes from a real customer
                          without revealing their identity.
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Technical Implementation</h2>
                <p className="text-muted-foreground">
                  Hoja uses a combination of blockchain technology, smart contracts, and Zero-Knowledge cryptography to
                  create a trustless review system.
                </p>
                <div className="overflow-hidden rounded-lg border">
                  <div className="bg-muted px-4 py-2 font-mono text-sm">Technical Stack</div>
                  <div className="p-4">
                    <ul className="space-y-2 text-sm">
                      <li>
                        <strong>Frontend:</strong> Next.js, React, Tailwind CSS
                      </li>
                      <li>
                        <strong>Blockchain:</strong> Ethereum, Polygon for scalability
                      </li>
                      <li>
                        <strong>Wallet Connection:</strong> ethers.js, WalletConnect
                      </li>
                      <li>
                        <strong>ZK Proofs:</strong> circom, snarkjs for ZK-SNARKs implementation
                      </li>
                      <li>
                        <strong>Smart Contracts:</strong> Solidity for on-chain verification
                      </li>
                      <li>
                        <strong>Storage:</strong> IPFS for decentralized review storage
                      </li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>

            <div className="flex justify-center">
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/">Explore Restaurants</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 px-6 md:px-8 md:flex-row md:gap-8">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Hoja. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

