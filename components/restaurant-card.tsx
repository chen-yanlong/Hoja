import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Wallet } from "lucide-react"

type Restaurant = {
  id: number
  name: string
  cuisine: string
  rating: number
  reviewCount: number
  distance: number
  image: string
}

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link href={`/restaurants/${restaurant.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md h-full">
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={restaurant.image || "/placeholder.svg"}
            alt={restaurant.name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold line-clamp-1">{restaurant.name}</h3>
              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <Wallet className="mr-1 h-3 w-3" />
                Crypto
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{restaurant.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({restaurant.reviewCount})</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-3 w-3" />
                {restaurant.distance.toFixed(1)} km
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              Verified Reviews
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Fast Delivery
            </Badge>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
