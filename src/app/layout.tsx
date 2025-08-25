import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { Providers } from "@/components/providers/Providers"
import { Toaster } from "sonner"
import "./globals.css"

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

/* Critical styles to ensure basic layout works */
body {
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #faf8f5 0%, #f5f5f0 50%, #e8e6e1 100%);
  color: #2d2d2d;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  line-height: 1.6;
}

/* Ensure critical Tailwind classes work */
.bg-white { background-color: #ffffff !important; }
.bg-gray-50 { background-color: #f9fafb !important; }
.text-gray-900 { color: #111827 !important; }
.text-gray-600 { color: #4b5563 !important; }
.border-gray-200 { border-color: #e5e7eb !important; }
.border { border-width: 1px !important; }
.rounded-lg { border-radius: 0.5rem !important; }
.shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important; }
.p-6 { padding: 1.5rem !important; }
.mb-4 { margin-bottom: 1rem !important; }
.flex { display: flex !important; }
.items-center { align-items: center !important; }
.justify-between { justify-content: space-between !important; }
.gap-4 { gap: 1rem !important; }
.grid { display: grid !important; }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
.min-h-screen { min-height: 100vh !important; }
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
