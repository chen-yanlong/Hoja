import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/hooks/use-cart"
import { ProofsProvider } from "@/hooks/use-proofs"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hoja - Crypto-Native Food Reviews",
  description: "Discover restaurants, pay with crypto, and leave anonymous verified reviews",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ProofsProvider>
            <CartProvider>{children}</CartProvider>
          </ProofsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'