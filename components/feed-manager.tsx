"use client"

import { useState } from "react"
import { QuoteCard } from "@/components/quote-card"
import { Search, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FeedManager({ initialQuotes }: { initialQuotes: any[] }) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filtra as quotes baseado no texto ou autor
  const filteredQuotes = initialQuotes.filter((quote) => {
    const search = searchTerm.toLowerCase()
    return (
      quote.text.toLowerCase().includes(search) ||
      quote.author.toLowerCase().includes(search)
    )
  })

  return (
    <div className="space-y-8">
      {/* --- A BARRA DE BUSCA --- */}
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-6 h-6 text-[#FFD700]" />
        </div>
        
        <input
          type="text"
          placeholder="Procure por palavras ou autores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-black text-[#FFD700] font-mono text-lg md:text-xl py-4 pl-14 pr-12 border-[3px] border-black neo-shadow placeholder:text-gray-600 focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all"
        />

        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 right-4 flex items-center text-[#FFD700] hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* --- CONTADOR DE RESULTADOS --- */}
      {searchTerm && (
        <div className="text-center font-bold font-mono text-sm uppercase tracking-widest opacity-60">
          {filteredQuotes.length} {filteredQuotes.length === 1 ? "batatada encontrada" : "batatadas encontradas"}
        </div>
      )}

      {/* --- LISTA FILTRADA --- */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredQuotes.map((quote, index) => (
            <motion.div
              key={quote.id}
              layout 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="break-inside-avoid" 
            >
              <QuoteCard quote={quote} index={index} />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredQuotes.length === 0 && (
          <div className="col-span-full text-center py-20 opacity-50 font-mono">
            <p className="text-xl">🤷‍♂️</p>
            <p>Nada encontrado no arquivo.</p>
          </div>
        )}
      </div>
    </div>
  )
}