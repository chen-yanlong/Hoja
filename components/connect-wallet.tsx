"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Wallet, LogOut, User, History } from "lucide-react"

declare global {
  interface Window {
    ethereum?: any
  }
}

export function ConnectWallet() {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState("")

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!")
      return
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])
      const userAddress = accounts[0]
      setAddress(userAddress)
      setConnected(true)
    } catch (error) {
      console.error("Error connecting wallet:", error)
    }
  }

  const disconnectWallet = () => {
    setConnected(false)
    setAddress("")
  }

  const shortenAddress = (addr: string) => {
    return addr.slice(0, 6) + "..." + addr.slice(-4)
  }

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      setAddress(window.ethereum.selectedAddress)
      setConnected(true)
    }

    // Auto handle disconnects / account changes
    window.ethereum?.on("accountsChanged", (accounts: string[]) => {
      if (accounts.length > 0) {
        setAddress(accounts[0])
        setConnected(true)
      } else {
        disconnectWallet()
      }
    })
  }, [])

  if (!connected) {
    return (
      <Button onClick={connectWallet} className="bg-green-600 hover:bg-green-700 whitespace-nowrap">
        <Wallet className="mr-2 h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Connect Wallet</span>
        <span className="sm:hidden">Connect</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
        >
          <Wallet className="mr-1 h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">{shortenAddress(address)}</span>
          <span className="sm:hidden">Wallet</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <History className="mr-2 h-4 w-4" />
          Transaction History
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnectWallet}>
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
