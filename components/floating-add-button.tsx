"use client"

import { motion } from "framer-motion"
import { Plus } from "lucide-react"

interface FloatingAddButtonProps {
  onClick: () => void
}

export function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-primary text-black p-4 md:p-6 border-[3px] border-black neo-shadow-lg z-40 rounded-full md:rounded-none"
      whileHover={{
        scale: 1.1,
        rotate: 90,
        boxShadow: "8px 8px 0px 0px #000",
      }}
      whileTap={{ scale: 0.95 }}
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        y: {
          repeat: Number.POSITIVE_INFINITY,
          duration: 2,
          ease: "easeInOut",
        },
      }}
    >
      <Plus className="w-8 h-8 md:w-10 md:h-10" />
    </motion.button>
  )
}
