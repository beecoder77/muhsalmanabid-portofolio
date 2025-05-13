import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Muhammad Salman Abid | Backend Developer",
  description:
    "Experienced Backend Developer with 5+ years specializing in telecommunications solutions, JavaScript, TypeScript, and Golang.",
  keywords: "backend developer, javascript, typescript, golang, telkom indonesia, crypto, blockchain, nft",
  openGraph: {
    title: "Muhammad Salman Abid | Backend Developer",
    description:
      "Experienced Backend Developer with 5+ years specializing in telecommunications solutions, JavaScript, TypeScript, and Golang.",
    url: "https://muhsalmanabid.com",
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
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/my-character.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Muhammad Salman Abid",
              url: "https://muhsalmanabid.com",
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
      <body className={`${inter.variable} font-sans bg-gray-900 text-white`}>{children}</body>
    </html>
  )
}
