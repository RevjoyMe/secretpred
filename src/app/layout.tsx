import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { Providers } from "@/components/providers/Providers"
import { Toaster } from "sonner"
import "./globals.css"
import "./test-styles.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "SecretPredictions - Web3 Prediction Market",
  description: "Decentralized prediction market platform with encrypted betting and oracle integration",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <style>{`
html {
  font-family: ${dmSans.style.fontFamily};
  --font-sans: ${dmSans.variable};
}
        `}</style>
      </head>
      <body className={`${dmSans.variable} antialiased bg-gray-50 text-gray-900`}>
        <Providers>
          {children}
          <Toaster theme="light" />
        </Providers>
      </body>
    </html>
  )
}
