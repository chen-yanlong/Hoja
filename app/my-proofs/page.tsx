"use client"

import Link from "next/link"
import { useProofs } from "@/hooks/use-proofs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Shield, ExternalLink, Calendar, Receipt } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function MyProofsPage() {
  const { proofs } = useProofs()

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6 md:px-8">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to home</span>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <div className="container px-6 py-8 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">My ZK Proofs</h1>
              <p className="mt-2 text-muted-foreground">
                These are your Zero-Knowledge Proofs of in-restaurant purchases. You can use them to leave verified
                reviews without revealing your identity.
              </p>
            </div>

            {proofs.length === 0 ? (
              <div className="rounded-lg border p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Shield className="h-6 w-6 text-muted-foreground" />
                </div>
                <h2 className="mt-4 text-lg font-medium">No proofs yet</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  After you dine at a restaurant and pay with crypto, your Zero-Knowledge Proofs will appear here.
                </p>
                <Button asChild className="mt-4 bg-green-600 hover:bg-green-700">
                  <Link href="/">Explore Restaurants</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {proofs.map((proof) => (
                  <div key={proof.id} className="rounded-lg border overflow-hidden">
                    <div className="bg-muted px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-green-600" />
                        <span className="font-medium">{proof.restaurantName}</span>
                      </div>
                      <Badge
                        variant={proof.used ? "outline" : "default"}
                        className={proof.used ? "bg-muted-foreground/20" : "bg-green-600"}
                      >
                        {proof.used ? "Used" : "Available"}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Transaction Details</h3>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center text-sm">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{formatDistanceToNow(new Date(proof.date), { addSuffix: true })}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Receipt className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>
                                {proof.amount.toFixed(4)} {proof.currency} on {proof.network}
                              </span>
                            </div>
                            <div className="flex items-center text-sm">
                              <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="font-mono text-xs truncate">{proof.transactionHash}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Order Summary</h3>
                          <div className="mt-2 space-y-1">
                            {proof.items.map((item, index) => (
                              <div key={index} className="text-sm flex justify-between">
                                <span>
                                  {item.quantity}× {item.name}
                                </span>
                                <span className="font-mono">{(item.price * item.quantity).toFixed(4)} ETH</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        {proof.used ? (
                          <Button disabled className="bg-muted text-muted-foreground">
                            Already Used
                          </Button>
                        ) : (
                          <Button asChild className="bg-green-600 hover:bg-green-700">
                            <Link href={`/restaurants/${proof.restaurantId}?proof=${proof.id}`}>
                              Leave Verified Review
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

