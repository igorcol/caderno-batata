"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { X } from "lucide-react"

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  function onDismiss() {
    router.back() // Volta para a URL anterior (fecha o modal)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop Escuro */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onDismiss}
      />

      {/* Conteúdo do Modal */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-full max-w-lg p-4"
      >
        <button 
          onClick={onDismiss}
          className="absolute -top-2 -right-2 z-20 bg-red-500 border-2 border-black p-2 rounded-full hover:scale-110 transition-transform text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <X size={20} />
        </button>
        
        {children}
      </motion.div>
    </div>
  )
}