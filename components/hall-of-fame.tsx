"use client"

import { motion } from "framer-motion"
import type { Quote } from "@/lib/quotes-data"
import { Trophy, Medal, Award } from "lucide-react"

interface HallOfFameProps {
  topQuotes: Quote[]
}

const medals = [
  { icon: Trophy, color: "bg-[#FFD700]", label: "🥇" },
  { icon: Medal, color: "bg-[#C0C0C0]", label: "🥈" },
  { icon: Award, color: "bg-[#CD7F32]", label: "🥉" },
]

export function HallOfFame({ topQuotes }: HallOfFameProps) {
  return (
    <section className="container mx-auto px-4 py-12">
      <motion.h2
        className="font-display text-4xl md:text-5xl text-center mb-8 bg-white text-black block px-8 py-4 border-[3px] border-black neo-shadow-lg mx-auto w-fit"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        🏆 TOP BATATADAS 🏆
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {topQuotes.map((quote, index) => {
          const medal = medals[index]
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const Icon = medal.icon
          const totalReactions = quote.reactions.potato + quote.reactions.fire + quote.reactions.skull

          return (
            <motion.div
              key={quote.id}
              className={`${medal.color} border-[3px] border-black neo-shadow-lg p-6 relative overflow-hidden`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -4, boxShadow: "8px 8px 0px 0px #000" }}
            >
              {/* Medal Icon */}
              <div className="absolute top-4 right-4 text-4xl">{medal.label}</div>

              {/* Position Badge */}
              <div className="inline-block bg-black text-white px-4 py-2 font-display text-xl mb-4">#{index + 1}</div>

              {/* Quote Text */}
              <p className="text-lg font-bold text-black mb-4 leading-tight">&quot;{quote.text}&quot;</p>

              {/* Author & Date */}
              <div className="flex items-center justify-between border-t-[3px] border-black pt-4">
                <span className="font-bold text-black">— {quote.author}</span>
                <span className="font-mono text-sm text-black">{new Date(quote.date).toLocaleDateString("pt-BR")}</span>
              </div>

              {/* Total Reactions */}
              <div className="mt-4 bg-black text-white px-4 py-2 font-bold text-center">{totalReactions} REAÇÕES</div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
