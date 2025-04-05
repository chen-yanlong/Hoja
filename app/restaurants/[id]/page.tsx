"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SimpleReviewForm } from "@/components/simple-review-form"
import { ReviewCard } from "@/components/review-card"
import { MenuItem } from "@/components/menu-item"
import { CartButton } from "@/components/cart-button"
import { Star, MapPin, Clock, Wallet, ArrowLeft } from "lucide-react"

export default function RestaurantPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("menu")
  const searchParams = useSearchParams()

  // Check if we have a proof ID in the URL and switch to reviews tab
  useEffect(() => {
    const proofId = searchParams.get("proof")
    if (proofId) {
      setActiveTab("reviews")
    }
  }, [searchParams])

  // This would normally fetch data based on the ID
  const restaurant = {
    id: params.id,
    name: "Cool Bistro",
    cuisine: "Italian",
    description:
      "A modern restaurant specializing in Italian cuisine with a crypto twist. We source all our ingredients locally and accept various cryptocurrencies for payment.",
    rating: "0",
    reviewCount: 0,
    address: "ZhongXiao E. Street, Taipei City",
    hours: "9:00 AM - 10:00 PM",
    image: "/images/italia.png",
    menu: [
      {
        id: 1,
        name: "Pizza",
        price: "0.02 USD",
        priceInUSD: 0.02,
        description: "Margherita pizza with fresh basil and mozzarella",
      },
      {
        id: 2,
        name: "Pasta",
        price: "0.02 USD",
        priceInUSD: 0.02,
        description: "Homemade pasta with truffle sauce",
      },
      {
        id: 0.3,
        name: "Salad",
        price: "0.03 USD",
        priceInUSD: 0.03,
        description: "Fresh greens with balsamic vinaigrette",
      },
      {
        id: 4,
        name: "Tiramisu",
        price: "0.03 USD",
        priceInUSD: 0.03,
        description: "Classic Italian dessert with a modern twist",
      },
    ],
    reviews: [
      {
        id: 1,
        rating: 5,
        text: "Amazing food and great atmosphere! Love that I could pay with crypto.",
        verified: true,
      },
      { id: 2, rating: 4, text: "Good food, but service was a bit slow. Will come back though!", verified: true },
      { id: 3, rating: 5, text: "Best Italian food in the area. The Blockchain Pasta is to die for!", verified: true },
    ],
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6 md:px-8">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to restaurants</span>
          </Link>
          <CartButton />
        </div>
      </header>
      <main className="flex-1">
        <div className="relative h-[300px] w-full overflow-hidden">
          <img
            src={restaurant.image || "/placeholder.svg"}
            alt={restaurant.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="container px-6 py-8 md:px-8">
          <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
            <div>
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold">{restaurant.name}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                  <Badge>{restaurant.cuisine}</Badge>
                  <div className="flex items-center">
                    <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{restaurant.rating}</span>
                    <span className="text-muted-foreground">({restaurant.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" />
                    {restaurant.address}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    {restaurant.hours}
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      <Wallet className="mr-1 h-3 w-3" />
                      Accepts Crypto
                    </Badge>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">{restaurant.description}</p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
                <TabsList>
                  <TabsTrigger value="menu">Menu</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="menu" className="mt-4">
                  <div className="grid gap-4">
                    {restaurant.menu.map((item) => (
                      <MenuItem key={item.id} item={item} restaurantId={restaurant.id} />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="mt-4">
                  <div className="space-y-6">
                    <div id="review-form">
                      <SimpleReviewForm restaurantId={restaurant.id} />
                    </div>
                    <div className="space-y-4">
                      {restaurant.reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="rounded-lg border p-4">
              <h2 className="text-xl font-bold">Zero-Knowledge Verified</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                All reviews on this platform are verified using Zero-Knowledge Proofs, ensuring that reviewers have
                actually dined and paid at this restaurant without revealing their identity or transaction details.
              </p>
              <div className="mt-4 rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                <h3 className="font-medium text-green-700 dark:text-green-400">How it works</h3>
                <ul className="mt-2 space-y-2 text-sm text-green-600 dark:text-green-400">
                  <li className="flex items-start">
                    <span className="mr-2">1.</span>
                    <span>Dine at the restaurant and pay with cryptocurrency</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">2.</span>
                    <span>Transaction is recorded on the blockchain</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">3.</span>
                    <span>Customer generates a ZK proof of payment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">4.</span>
                    <span>Review is posted with proof but without revealing identity</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  Learn More About ZK Proofs
                </Button>
              </div>
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

