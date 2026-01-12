"use client"

import { QuoteCard } from "@/components/quote-card"
import { Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Quote } from "@/lib/quotes-data"

export function DailyQuoteCard({ quote }: { quote: Quote }) {
  if (!quote) return null

  return (
    <div className="flex flex-col">
      
      {/* Título */}
      <motion.div 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-center lg:justify-start gap-2 mb-4"
      >
        <Sparkles className="text-[#FFD700] fill-[#FFD700] w-6 h-6" />
        <h2 className="font-display text-2xl text-black uppercase tracking-wider">
          Batatada do Dia
        </h2>
        <Sparkles className="text-[#FFD700] fill-[#FFD700] w-6 h-6 lg:hidden" />
      </motion.div>

      {/* Container do Card com Destaque */}
      <div className="relative transform hover:scale-[1.02] transition-transform duration-300 z-0">
        
        {/* Efeito de brilho  */}
        <div className="absolute -inset-1 bg-linear-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] rounded-lg blur opacity-40 animate-pulse -z-10"></div>
        
        <div className="[&>div]:mb-0">
            <QuoteCard quote={quote} index={0} />
        </div>
        
        {/* Selo de Data  */}
        <div className="absolute -top-3 -right-3 bg-black text-[#FFD700] font-mono text-xs px-2 py-1 rotate-12 border-2 border-[#FFD700] z-20 shadow-[2px_2px_0px_0px_rgba(255,215,0,1)]">
          {new Date(quote.date).toLocaleDateString('pt-BR')}
        </div>
      </div>
    </div>
  )
}