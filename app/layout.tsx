import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Muhammad Salman Abid | Backend Developer & Blockchain Expert",
  description:
    "Backend Developer with 5 years of experience in building scalable server-side solutions. Skilled in Node.js, TypeScript, and Golang, with expertise in RESTful APIs, microservices, and blockchain technology. Experienced in developing cryptocurrency and NFT solutions. Passionate about creating efficient, maintainable code and solving complex technical challenges.",
  keywords: "backend developer, javascript, typescript, golang, telkom indonesia, crypto, blockchain, nft, cryptocurrency, web3, indonesia developer, pekalongan developer, blockchain developer, microservices expert",
  openGraph: {
    title: "Muhammad Salman Abid | Backend Developer & Blockchain Expert",
    description:
      "Backend Developer with 5 years of experience in building scalable server-side solutions. Skilled in Node.js, TypeScript, and Golang, with expertise in RESTful APIs, microservices, and blockchain technology. Experienced in developing cryptocurrency and NFT solutions. Passionate about creating efficient, maintainable code and solving complex technical challenges.",
    url: "https://muhsalmanabid.com",
    siteName: "Muhammad Salman Abid Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-09%20at%2013.09.10-tvWPOSeUwOSidDJ5QlfBqr1ZdbaHEt.jpeg",
        width: 1200,
        height: 630,
        alt: "Muhammad Salman Abid - Backend Developer & Blockchain Expert"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Salman Abid | Backend Developer & Blockchain Expert",
    description:
      "Backend Developer with 5 years of experience in building scalable server-side solutions. Skilled in Node.js, TypeScript, and Golang, with expertise in RESTful APIs, microservices, and blockchain technology. Experienced in developing cryptocurrency and NFT solutions. Passionate about creating efficient, maintainable code and solving complex technical challenges.",
    images: ["https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-09%20at%2013.09.10-tvWPOSeUwOSidDJ5QlfBqr1ZdbaHEt.jpeg"]
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
  verification: {
    google: 'your-google-site-verification', // Anda perlu menambahkan kode verifikasi Google Search Console
  },
  alternates: {
    canonical: 'https://muhsalmanabid.com',
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
