"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Shield, Star, Check, Loader2, AlertTriangle } from "lucide-react"
import { useProofs } from "@/hooks/use-proofs"
import { useRouter } from "next/navigation"

interface ReviewFormProps {
  restaurantId: string
}

export function ReviewForm({ restaurantId }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const [isGeneratingProof, setIsGeneratingProof] = useState(false)
  const [isProofGenerated, setIsProofGenerated] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [proofId, setProofId] = useState<string | null>(null)
  const [proofError, setProofError] = useState<string | null>(null)
  const [dialogMode, setDialogMode] = useState<"generate" | "use">("generate")

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

      // Valid proof - set it and automatically open the dialog
      setProofId(urlProofId)
      setIsProofGenerated(true)
      setDialogMode("use")
      setIsDialogOpen(true)
      setProofError(null)
    }
  }, [searchParams, getProofById, restaurantId])

  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
  }

  const generateZkProof = () => {
    setIsGeneratingProof(true)
    // Simulate ZK proof generation
    setTimeout(() => {
      setIsGeneratingProof(false)
      setIsProofGenerated(true)
    }, 2000)
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
      setIsDialogOpen(false)
      setRating(0)
      setReview("")
      setIsProofGenerated(false)
      setProofId(null)

      // Redirect to remove the proof query param
      router.push(`/restaurants/${restaurantId}`)
    }, 1500)
  }

  // Check if user has any unused proofs for this restaurant
  const hasUnusedProofs = proofs.some((p) => p.restaurantId === restaurantId && !p.used)

  const handleOpenDialog = () => {
    if (proofId) {
      setDialogMode("use")
    } else {
      setDialogMode("generate")
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    // If we came from a URL with a proof, remove the proof param
    if (searchParams.has("proof")) {
      router.push(`/restaurants/${restaurantId}`)
    }
  }

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

        {proofId ? (
          // If we have a proof from URL, show direct submit button
          <Button
            onClick={handleOpenDialog}
            className="mt-4 w-full sm:w-auto bg-green-600 hover:bg-green-700"
            disabled={rating === 0 || review.trim() === ""}
          >
            <Shield className="mr-2 h-4 w-4" />
            Submit Verified Review
          </Button>
        ) : hasUnusedProofs ? (
          // If user has unused proofs, show button to go to proofs page
          <Button asChild className="mt-4 w-full sm:w-auto bg-green-600 hover:bg-green-700">
            <a href="/my-proofs">
              <Shield className="mr-2 h-4 w-4" />
              Use Existing Proof
            </a>
          </Button>
        ) : (
          // Otherwise show normal flow
          <Button
            onClick={handleOpenDialog}
            className="mt-4 w-full sm:w-auto bg-green-600 hover:bg-green-700"
            disabled={rating === 0 || review.trim() === ""}
          >
            Submit Review
          </Button>
        )}
      </div>

      {/* Single dialog with different content based on mode */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseDialog()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogMode === "use" ? "Submit Verified Review" : "Verify Your Review"}</DialogTitle>
            <DialogDescription>
              {dialogMode === "use"
                ? "You're using a Zero-Knowledge Proof to verify your review."
                : "Generate a Zero-Knowledge Proof to verify your purchase without revealing your identity."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {dialogMode === "use" ? (
              // Using existing proof
              <div className="flex flex-col items-center justify-center space-y-4 p-4">
                <div className="rounded-full bg-green-100 p-3">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-center font-medium">Using Existing Proof</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Your review will be submitted with your Zero-Knowledge Proof, verifying your purchase without
                  revealing your identity.
                </p>
              </div>
            ) : // Generate new proof
            !isProofGenerated ? (
              <div className="flex flex-col items-center justify-center space-y-4 p-4">
                <Shield className="h-16 w-16 text-green-600" />
                <p className="text-center text-sm">
                  This will generate a cryptographic proof that you dined at this restaurant without revealing your
                  wallet address or transaction details.
                </p>
                <Button
                  onClick={generateZkProof}
                  disabled={isGeneratingProof}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isGeneratingProof ? "Generating Proof..." : "Generate ZK Proof"}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4 p-4">
                <div className="rounded-full bg-green-100 p-3">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-center font-medium">Proof Generated Successfully</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Your Zero-Knowledge Proof has been generated. You can now submit your review anonymously.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={submitReview}
              disabled={(dialogMode === "generate" && !isProofGenerated) || isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  {dialogMode === "use" ? <Check className="mr-2 h-4 w-4" /> : null}
                  Submit Verified Review
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

