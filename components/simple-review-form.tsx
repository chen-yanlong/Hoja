"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Shield, Star, Check, AlertTriangle } from "lucide-react"
import { useProofs } from "@/hooks/use-proofs"

interface SimpleReviewFormProps {
  restaurantId: string
}

export function SimpleReviewForm({ restaurantId }: SimpleReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [proofId, setProofId] = useState<string | null>(null)
  const [proofError, setProofError] = useState<string | null>(null)
  const [hasValidProof, setHasValidProof] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()
  const { proofs, getProofById, markProofAsUsed } = useProofs()

  // Check if we have a proof ID in the URL
  useEffect(() => {
    const urlProofId = searchParams.get("proof")
    if (urlProofId) {
      const proof = getProofById(urlProofId)

      if (!proof) {
        setProofError("The proof you're trying to use doesn't exist.")
        return
      }

      if (proof.restaurantId !== restaurantId) {
        setProofError("This proof is for a different restaurant.")
        return
      }

      if (proof.used) {
        setProofError("This proof has already been used for a review.")
        return
      }

      // Valid proof
      setProofId(urlProofId)
      setHasValidProof(true)
      setProofError(null)
    }
  }, [searchParams, getProofById, restaurantId])

  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
  }

  const submitReview = () => {
    if (rating === 0 || review.trim() === "") {
      return
    }

    setIsSubmitting(true)

    // If we have a proofId, mark it as used
    if (proofId) {
      markProofAsUsed(proofId)
    }

    // Simulate review submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Reset form after showing success message
      setTimeout(() => {
        setRating(0)
        setReview("")
        setIsSuccess(false)
        setProofId(null)
        setHasValidProof(false)

        // Redirect to remove the proof query param
        if (searchParams.has("proof")) {
          router.push(`/restaurants/${restaurantId}`)
        }
      }, 3000)
    }, 1500)
  }

  // Check if user has any unused proofs for this restaurant
  const hasUnusedProofs = proofs.some((p) => p.restaurantId === restaurantId && !p.used)

  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-lg font-medium">Write a Review</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Share your dining experience with others. Your review will be verified using Zero-Knowledge Proofs.
      </p>

      {proofError && (
        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{proofError}</AlertDescription>
        </Alert>
      )}

      {isSuccess && (
        <Alert className="mt-4 bg-green-50 text-green-700 border-green-200">
          <Check className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>Your verified review has been submitted. Thank you!</AlertDescription>
        </Alert>
      )}

      {!isSuccess && (
        <>
          <div className="mt-4">
            <div className="flex items-center justify-center sm:justify-start space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <Star
                    className={`h-5 w-5 sm:h-6 sm:w-6 ${
                      rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="mt-4">
              <Textarea
                placeholder="Write your review here..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {hasValidProof ? (
              // If we have a valid proof from URL
              <div className="mt-4 space-y-4">
                <div className="rounded-md bg-green-50 p-3 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-600" />
                  <span className="text-sm text-green-700">Using your verified proof for this review</span>
                </div>
                <Button
                  onClick={submitReview}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                  disabled={rating === 0 || review.trim() === "" || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Verified Review"}
                </Button>
              </div>
            ) : hasUnusedProofs ? (
              // If user has unused proofs, show button to go to proofs page
              <Button asChild className="mt-4 w-full sm:w-auto bg-green-600 hover:bg-green-700">
                <a href="/my-proofs">
                  <Shield className="mr-2 h-4 w-4" />
                  Use Existing Proof
                </a>
              </Button>
            ) : (
              // Otherwise show normal submit button
              <Button
                onClick={submitReview}
                className="mt-4 w-full sm:w-auto bg-green-600 hover:bg-green-700"
                disabled={rating === 0 || review.trim() === "" || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

