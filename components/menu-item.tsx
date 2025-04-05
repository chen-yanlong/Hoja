"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, MinusCircle, ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

interface MenuItem {
  id: number
  name: string
  price: string
  description: string
  priceInEth: number
}

interface MenuItemProps {
  item: MenuItem
  restaurantId: string
}

export function MenuItem({ item, restaurantId }: MenuItemProps) {
  const [quantity, setQuantity] = useState(0)
  const { addToCart } = useCart()

  const incrementQuantity = () => {
    setQuantity(quantity + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1)
    }
  }

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        priceInEth: item.priceInEth,
        quantity,
        restaurantId,
      })
      setQuantity(0)
    }
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{item.name}</h3>
        <span className="font-mono text-sm font-medium text-green-600">{item.price}</span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={decrementQuantity}
            disabled={quantity === 0}
          >
            <MinusCircle className="h-4 w-4" />
            <span className="sr-only">Decrease quantity</span>
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={incrementQuantity}>
            <PlusCircle className="h-4 w-4" />
            <span className="sr-only">Increase quantity</span>
          </Button>
        </div>

        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700"
          onClick={handleAddToCart}
          disabled={quantity === 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Table Order
        </Button>
      </div>
    </div>
  )
}

