"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { HallOfFame } from "@/components/hall-of-fame"
import { QuoteCard } from "@/components/quote-card"
import { FloatingAddButton } from "@/components/floating-add-button"
import { QuoteModal } from "@/components/quote-modal"
import { quotesData, getTopQuotes } from "@/lib/quotes-data"

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const topQuotes = getTopQuotes(3)

  return (
    <div className="min-h-screen">
      <Header />

      <HallOfFame topQuotes={topQuotes} />

      {/* Main Feed */}
      <section id="main-feed" className="container mx-auto px-4 py-12">
        <h2 className="font-display text-3xl md:text-4xl text-center mb-8 bg-black text-primary block px-8 py-4 border-[3px] border-black neo-shadow mx-auto w-fit">
          TODAS AS BATATADAS
        </h2>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {quotesData.map((quote, index) => (
            <QuoteCard key={quote.id} quote={quote} index={index} />
          ))}
        </div>
      </section>

      <FloatingAddButton onClick={() => setIsModalOpen(true)} />
      <QuoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
