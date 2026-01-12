"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, X } from "lucide-react"

export function InstallPrompt() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Escuta o evento que o navegador dispara quando o app pode ser instalado
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (e: any) => {
      // 1. Impede o navegador de mostrar a barrinha padrão feia
      e.preventDefault()
      // 2. Guarda o evento na memória para usar depois
      setDeferredPrompt(e)
      // 3. Mostra o nosso botão bonitão
      setIsVisible(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Dispara o prompt nativo do sistema
    deferredPrompt.prompt()

    // Espera o usuário decidir (Aceitar ou Recusar)
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === "accepted") {
      console.log("Usuário aceitou instalar")
    } else {
      console.log("Usuário recusou")
    }

    // Limpa tudo e fecha o popup
    setDeferredPrompt(null)
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
        >
          <div className="bg-[#FFD700] border-[3px] border-black neo-shadow p-4 flex flex-col gap-3 relative">
            
            {/* Botão de Fechar (caso o cara não queira agora) */}
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute -top-3 -right-3 bg-white border-2 border-black p-1 hover:bg-gray-100 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="bg-black text-white p-2 border-2 border-white">
                 <span className="text-2xl">🥔</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-lg leading-none">INSTALAR O APP</h3>
                <p className="text-xs font-mono font-bold mt-1">Tenha batatas no seu bolso.</p>
              </div>
            </div>

            <button
              onClick={handleInstallClick}
              className="bg-black text-[#FFD700] font-bold py-2 px-4 border-2 border-white hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
            >
              <Download className="w-4 h-4" />
              BAIXAR AGORA
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}