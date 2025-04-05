import Link from "next/link"
import { ConnectWallet } from "@/components/connect-wallet"
import { CartButton } from "@/components/cart-button"
import { UserNav } from "@/components/user-nav"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6 md:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">Hoja</span>
        </Link>
        <div className="flex items-center gap-4">
          <ConnectWallet />
          <CartButton />
          <UserNav />
        </div>
      </div>
    </header>
  )
}

