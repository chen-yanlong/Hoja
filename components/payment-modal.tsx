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
import { ethers } from "ethers"

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
  usdcAddress: string
  chainId: number
}

const networks: BlockchainNetwork[] = [
  {
    id: "polygon",
    name: "Polygon Amoy",
    icon: "MATIC",
    currency: "MATIC",
    fee: 0.01,
    usdcAddress: "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582", 
    chainId: 80002, 
  },
  {
    id: "celo",
    name: "Celo Testnet",
    icon: "CELO",
    currency: "CELO",
    fee: 0.01,
    usdcAddress: "0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B", 
    chainId: 44787, 
  },
]

const USDC_ABI = [
  "function transfer(address recipient, uint256 amount) public returns (bool)",
  "function balanceOf(address account) external view returns (uint256)"
]

export function PaymentModal({ isOpen, onClose, totalAmount, items }: PaymentModalProps) {
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "generating" | "error">("idle")
  const [selectedNetwork, setSelectedNetwork] = useState<string>("ethereum")
  const { clearCart } = useCart()
  const router = useRouter()
  const { addProof } = useProofs()

  const network = networks.find((n) => n.id === selectedNetwork) || networks[0]

  const handlePayment = async () => {
    setPaymentStatus("processing")
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const chainId = await provider.getNetwork().then((network) => network.chainId)
    if (chainId.toString() !== network.chainId.toString()) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${network.chainId.toString(16)}` }],
      })
      window.location.reload()
    }
    const usdc = new ethers.Contract(network.usdcAddress, USDC_ABI, signer)
    const amountInWei = ethers.parseUnits(totalAmount.toString(), 6)
    const tx = await usdc.transfer("0xddAdE2642C66A757e3850d6E8F89B02F9c63f659", amountInWei)
    await tx.wait()

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
            price: item.priceInUSD,
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
                  <span className="font-mono">{(item.priceInUSD * item.quantity).toFixed(4)} USD</span>
                </div>
              ))}
              <div className="border-t my-2 pt-2 flex justify-between font-medium">
                <span>Total</span>
                <span className="font-mono text-green-600">{totalAmount.toFixed(4)} USD</span>
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

              {/* <div className="flex justify-between text-sm">
                <span>Network Fee (estimated)</span>
                <span className="font-mono">
                  {network.fee} {network.currency}
                </span>
              </div> */}
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
                Pay {totalAmount.toFixed(4)} USD
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

