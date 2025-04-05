"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wallet, Check, Loader2, Shield } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import type { CartItem } from "@/hooks/use-cart"
import { useRouter } from "next/navigation"
import { useProofs } from "@/hooks/use-proofs"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  totalAmount: number
  items: CartItem[]
}

interface BlockchainNetwork {
  id: string
  name: string
  icon: string
  currency: string
  fee: number
}

const networks: BlockchainNetwork[] = [
  { id: "ethereum", name: "Ethereum", icon: "ETH", currency: "ETH", fee: 0.0005 },
  { id: "polygon", name: "Polygon", icon: "MATIC", currency: "MATIC", fee: 0.01 },
  { id: "optimism", name: "Optimism", icon: "OP", currency: "ETH", fee: 0.0001 },
  { id: "arbitrum", name: "Arbitrum", icon: "ARB", currency: "ETH", fee: 0.0002 },
]

export function PaymentModal({ isOpen, onClose, totalAmount, items }: PaymentModalProps) {
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "generating" | "error">("idle")
  const [selectedNetwork, setSelectedNetwork] = useState<string>("ethereum")
  const { clearCart } = useCart()
  const router = useRouter()
  const { addProof } = useProofs()

  const network = networks.find((n) => n.id === selectedNetwork) || networks[0]

  const handlePayment = () => {
    setPaymentStatus("processing")

    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus("success")

      // After payment success, generate proof
      setTimeout(() => {
        setPaymentStatus("generating")

        // Simulate proof generation
        setTimeout(() => {
          // Create a new proof
          const restaurantId = items[0]?.restaurantId || "unknown"
          const proofId = `proof-${Date.now()}`

          addProof({
            id: proofId,
            restaurantId,
            restaurantName: "Blockchain Bistro", // In a real app, this would come from the restaurant data
            date: new Date().toISOString(),
            amount: totalAmount,
            currency: network.currency,
            network: network.name,
            transactionHash: `0x${Math.random().toString(16).substring(2, 42)}`,
            items: items.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.priceInEth,
            })),
            used: false,
          })

          // Reset cart and redirect to proofs page
          clearCart()
          setPaymentStatus("idle")
          onClose()
          router.push("/my-proofs")
        }, 2000)
      }, 1000)
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && paymentStatus === "idle" && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Order</DialogTitle>
          <DialogDescription>Pay with your connected cryptocurrency wallet</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-lg border p-4 mb-4">
            <h3 className="font-medium mb-2">Order Summary</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}× {item.name}
                  </span>
                  <span className="font-mono">{(item.priceInEth * item.quantity).toFixed(4)} ETH</span>
                </div>
              ))}
              <div className="border-t my-2 pt-2 flex justify-between font-medium">
                <span>Total</span>
                <span className="font-mono text-green-600">{totalAmount.toFixed(4)} ETH</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-medium mb-2">Payment Details</h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="network" className="text-sm font-medium">
                  Blockchain Network
                </label>
                <Select value={selectedNetwork} onValueChange={setSelectedNetwork} disabled={paymentStatus !== "idle"}>
                  <SelectTrigger id="network">
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent>
                    {networks.map((network) => (
                      <SelectItem key={network.id} value={network.id}>
                        <div className="flex items-center">
                          <span className="font-mono text-xs bg-muted rounded px-1 mr-2">{network.icon}</span>
                          {network.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between text-sm">
                <span>Network Fee (estimated)</span>
                <span className="font-mono">
                  {network.fee} {network.currency}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Table Number</span>
                <span>#42</span>
              </div>
              <div className="flex items-center text-sm text-green-600 bg-green-50 p-2 rounded">
                <Shield className="h-4 w-4 mr-2" />
                <span>A Zero-Knowledge Proof will be generated after payment</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={paymentStatus !== "idle"}>
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={paymentStatus !== "idle"}
            className="bg-green-600 hover:bg-green-700"
          >
            {paymentStatus === "idle" && (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Pay {totalAmount.toFixed(4)} {network.currency}
              </>
            )}
            {paymentStatus === "processing" && (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Transaction...
              </>
            )}
            {paymentStatus === "success" && (
              <>
                <Check className="mr-2 h-4 w-4" />
                Payment Successful!
              </>
            )}
            {paymentStatus === "generating" && (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating ZK Proof...
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

