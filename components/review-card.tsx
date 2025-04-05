import { Star, Shield, Check } from "lucide-react"

interface ReviewProps {
  review: {
    id: number
    rating: number
    text: string
    verified: boolean
  }
}

export function ReviewCard({ review }: ReviewProps) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>
        {review.verified && (
          <div className="flex items-center text-xs text-green-600">
            <Shield className="mr-1 h-3 w-3" />
            <Check className="mr-1 h-3 w-3" />
            ZK Verified
          </div>
        )}
      </div>
      <p className="mt-2 text-sm">{review.text}</p>
      <div className="mt-2 flex items-center text-xs text-muted-foreground">
        <span>Anonymous User</span>
        <span className="mx-1">•</span>
        <span>Verified Purchase</span>
      </div>
    </div>
  )
}

