"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { Trash2, Plus, Minus, Wallet } from "lucide-react"
import { PaymentModal } from "@/components/payment-modal"
import { getUniversalLink, SelfAppBuilder } from '@selfxyz/core';

export function CartItems() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  function birthday() {
    // Generate the Self app deeplink for birthday verification
    const selfApp = new SelfAppBuilder({
      appName: "Hoja", // Replace with your app's name
      scope: "birthday_verification", // Define your app's scope
      // endpoint: "https://feaa-111-235-226-130.ngrok-free.app/api/verify",
      endpoint: "https://hoja-swart.vercel.app/api/verify", 
      endpointType: "https",
      userIdType: 'hex', // Example: use 'uuid' or 'hex' based on your user ID format
      userId: "0xC064a24Ec8ab00Bd67924d007b94FD8EebD4Bc25", // Replace with the user's ID (e.g., UUID or address)
      disclosures: {
        date_of_birth: true
      },
      devMode: false,
    }).build();
  
    // Get the universal deeplink
    const deeplink = getUniversalLink(selfApp);
  
    // Redirect user to the Self app for birthday verification
    window.location.href = deeplink;
  }

  if (items.length === 0) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground" />
        <p className="mt-4 text-center text-muted-foreground">No items in cart. Please add items to your order.</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto py-6">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.price} × {item.quantity}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                  <span className="sr-only">Decrease quantity</span>
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                  <span className="sr-only">Increase quantity</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-600"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove item</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between py-2">
          <span className="font-medium">Total</span>
          <span className="font-mono font-medium text-green-600">{totalPrice.toFixed(4)} USD</span>
        </div>
        <div className="mt-4 space-y-2">
          <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => setIsPaymentModalOpen(true)}>
            <Wallet className="mr-2 h-4 w-4" />
            Pay at the counter
          </Button>
          <Button variant="outline" className="w-full" onClick={birthday}>
            It's your birthday?
          </Button>
          <Button variant="outline" className="w-full" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={totalPrice}
        items={items}
      />
    </div>
  )
}

function ShoppingCart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}

