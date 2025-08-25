import type React from "react"
import type { Metadata } from "next"
import { Work_Sans, Open_Sans } from "next/font/google"
import { Providers } from "@/components/providers/Providers"
import { Toaster } from "sonner"
import "./globals.css"

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
})

export const metadata: Metadata = {
  title: "SecretPredictions - Predict the Future",
  description: "Join the world's most advanced prediction market platform. Make informed bets on real-world events with encrypted, secure transactions powered by Zama FHE.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${workSans.variable} ${openSans.variable}`}>
      <body className="font-sans antialiased">
        <Providers>
          {children}
          <Toaster theme="light" />
        </Providers>
      </body>
    </html>
  )
}
