"use client"

import { motion } from "framer-motion"
import { Shuffle, Loader2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation" // Importante para navegação
import { getRandomQuoteId } from "@/lib/actions/Quote Actions/get-random-quote-action" 

export function Header() {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleRandomQuote = async () => {
    if (isLoading) return 

    setIsLoading(true)

    try {
      // Busca o ID no servidor
      const randomId = await getRandomQuoteId()

      if (randomId) {
        // Navega para a rota. 
        router.push(`/quote/${randomId}`)
      }
    } catch (error) {
      console.error("Erro ao buscar batata aleatória:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.header
      className="sticky top-0 z-50 bg-primary border-b-[3px] border-black neo-shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="bg-primary border-[3px] border-black px-6 py-3 neo-shadow"
          style={{ transform: "rotate(-2deg)" }}
          whileHover={{ scale: 1.05, rotate: -3 }}
        >
          <h1 className="font-display text-2xl md:text-3xl text-black">CADERNO BATATA</h1>
        </motion.div>

        {/* Random Quote Button */}
        <motion.button
          onClick={handleRandomQuote}
          disabled={isLoading}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="bg-secondary text-black font-bold px-6 py-3 border-[3px] border-black neo-shadow hover:-translate-y-0.5 hover:neo-shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-80 disabled:cursor-wait"
          whileHover={!isLoading ? { rotate: [0, -5, 5, -5, 0] } : {}}
          whileTap={{ scale: 0.95 }}
          animate={isHovered && !isLoading ? { y: [0, -2, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Shuffle className="w-5 h-5" />
          )}
          
          <span className="hidden md:inline">
            {isLoading ? "SORTEANDO..." : "BATATA DA SORTE"}
          </span>
          <span className="md:hidden">
            {isLoading ? "" : ""}
          </span>
        </motion.button>
      </div>
    </motion.header>
  )
}