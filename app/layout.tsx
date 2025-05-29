import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import VisitorTracker from "@/components/visitor-tracker"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Muhammad Salman Abid - Portfolio",
  description: "Portfolio website of Muhammad Salman Abid, a Backend Developer",
  keywords: "backend developer, javascript, typescript, golang, telkom indonesia, crypto, blockchain, nft",
  openGraph: {
    title: "Muhammad Salman Abid | Backend Developer",
    description:
      "Experienced Backend Developer with 5+ years specializing in telecommunications solutions, JavaScript, TypeScript, and Golang.",
    url: "https://muhsalmanabid.tech",
    siteName: "Muhammad Salman Abid Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Salman Abid | Backend Developer",
    description:
      "Experienced Backend Developer with 5+ years specializing in telecommunications solutions, JavaScript, TypeScript, and Golang.",
  },
  verification: {
    google: 'Y3DmI33lxP2DdU6em5Cns2cViP0ygE3nDNzkB-lZxh4',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
      <meta name="google-site-verification" content="Y3DmI33lxP2DdU6em5Cns2cViP0ygE3nDNzkB-lZxh4" />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Muhammad Salman Abid",
              url: "https://muhsalmanabid.tech",
              jobTitle: "Backend Developer",
              worksFor: {
                "@type": "Organization",
                name: "Telkom Indonesia",
              },
              alumniOf: {
                "@type": "EducationalOrganization",
                name: "Binus University",
              },
              knowsAbout: ["JavaScript", "TypeScript", "Node.js", "Golang", "Kafka", "MongoDB", "PostgreSQL"],
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans bg-gray-900 text-white`}>
        <VisitorTracker />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
