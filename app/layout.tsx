/* eslint-disable @typescript-eslint/no-unused-vars */
import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Archivo_Black } from "next/font/google"
import "./globals.css"
import { InstallPrompt } from "@/components/install-prompt"
import { OneSignalInit } from "@/components/one-signal-init"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
})

export const viewport: Viewport = {
  themeColor: "#FFD700", 
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, 
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Caderno Batata",
  description: "Só batatada sincera",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode,
  modal: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans antialiased ${_archivoBlack.variable}`}>
        {children}
        {modal}
        <InstallPrompt />
        <OneSignalInit />
      </body>
    </html>
  )
}
