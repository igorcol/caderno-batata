/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { motion } from "framer-motion"
import { Shuffle } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [isHovered, setIsHovered] = useState(false)

  const handleRandomQuote = () => {
    const mainFeed = document.getElementById("main-feed")
    if (mainFeed) {
      mainFeed.scrollIntoView({ behavior: "smooth" })
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
        {/* <motion.button
          onClick={handleRandomQuote}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="bg-secondary text-black font-bold px-6 py-3 border-[3px] border-black neo-shadow hover:-translate-y-0.5 hover:neo-shadow-lg transition-all flex items-center gap-2"
          whileHover={{ rotate: [0, -5, 5, -5, 0] }}
          whileTap={{ scale: 0.95 }}
          animate={isHovered ? { y: [0, -2, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Shuffle className="w-5 h-5" />
          <span className="hidden md:inline">BATATA DA SORTE</span>
          <span className="md:hidden">SORTE</span>
        </motion.button> */}
      </div>
    </motion.header>
  )
}
