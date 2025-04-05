"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface ProofItem {
  name: string
  quantity: number
  price: number
}

export interface Proof {
  id: string
  restaurantId: string
  restaurantName: string
  date: string
  amount: number
  currency: string
  network: string
  transactionHash: string
  items: ProofItem[]
  used: boolean
}

interface ProofsContextType {
  proofs: Proof[]
  addProof: (proof: Proof) => void
  markProofAsUsed: (proofId: string) => void
  getProofById: (proofId: string) => Proof | undefined
  getProofsByRestaurant: (restaurantId: string) => Proof[]
}

const ProofsContext = createContext<ProofsContextType | undefined>(undefined)

export function ProofsProvider({ children }: { children: ReactNode }) {
  const [proofs, setProofs] = useState<Proof[]>([])

  // Load proofs from localStorage on mount
  useEffect(() => {
    const savedProofs = localStorage.getItem("hoja-proofs")
    if (savedProofs) {
      try {
        setProofs(JSON.parse(savedProofs))
      } catch (error) {
        console.error("Failed to parse saved proofs:", error)
      }
    }
  }, [])

  // Save proofs to localStorage when they change
  useEffect(() => {
    localStorage.setItem("hoja-proofs", JSON.stringify(proofs))
  }, [proofs])

  const addProof = (proof: Proof) => {
    setProofs((prevProofs) => [...prevProofs, proof])
  }

  const markProofAsUsed = (proofId: string) => {
    setProofs((prevProofs) => prevProofs.map((proof) => (proof.id === proofId ? { ...proof, used: true } : proof)))
  }

  const getProofById = (proofId: string) => {
    return proofs.find((proof) => proof.id === proofId)
  }

  const getProofsByRestaurant = (restaurantId: string) => {
    return proofs.filter((proof) => proof.restaurantId === restaurantId)
  }

  return (
    <ProofsContext.Provider
      value={{
        proofs,
        addProof,
        markProofAsUsed,
        getProofById,
        getProofsByRestaurant,
      }}
    >
      {children}
    </ProofsContext.Provider>
  )
}

export function useProofs() {
  const context = useContext(ProofsContext)
  if (context === undefined) {
    throw new Error("useProofs must be used within a ProofsProvider")
  }
  return context
}

