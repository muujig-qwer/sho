'use client'
import './globals.css'
import { SessionProvider } from "next-auth/react"
import { CartProvider } from '@/context/CartContext'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const hideNavbar = pathname === '/login' || pathname === '/register'

  return (
    <html lang="mn">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-montserrat">
        <SessionProvider>
          <CartProvider>
            {!hideNavbar && <Navbar />}
            <main>{children}</main>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  )
}