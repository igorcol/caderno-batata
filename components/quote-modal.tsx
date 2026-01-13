"use client";

import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, AlertTriangle } from "lucide-react"; // Importei icones novos
import { useState } from "react";
import { submitQuote } from "@/lib/actions/Quote Actions/submit-quote-action";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  // Função auxiliar para pegar a data de hoje no formato YYYY-MM-DD
  const getToday = () => new Date().toISOString().split("T")[0];

  const [password, setPassword] = useState("");
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState(getToday());
  
  // ESTADO DO TOAST (Feedback visual)
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus(null); // Limpa status anteriores

    // Enviamos a data escolhida junto com o resto
    const result = await submitQuote({ quote, author, password, date });

    if (result.success) {
      // SUCESSO: Mostra verde, espera 1.5s e fecha
      setStatus({ type: 'success', message: result.message });
      setTimeout(() => {
        onClose();
        clearInputs();
        setStatus(null);
        setIsSubmitting(false);
      }, 2000);
    } else {
      // ERRO: Mostra rosa, espera 3s e limpa o aviso
      setStatus({ type: 'error', message: result.message || "Senha incorreta!" });
      setIsSubmitting(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const clearInputs = () => {
    setPassword("");
    setQuote("");
    setAuthor("");
    setDate(getToday());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl z-50"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="bg-white border-4 border-black neo-shadow-xl max-h-[90vh] overflow-y-auto relative">
              
              {/* Header */}
              <div className="bg-primary border-b-4 border-black p-6 flex items-center justify-between sticky top-0 z-10">
                <h2 className="font-display text-2xl md:text-3xl text-black">
                  PUBLIQUE UMA BATATADA 🥔
                </h2>
                <button
                  onClick={onClose}
                  className="bg-destructive border-[3px] border-black p-2 hover:-translate-y-0.5 transition-all"
                >
                  <X className="w-6 h-6 text-black" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                
                {/* Quote Text */}
                <div>
                  <label className="block font-bold text-lg mb-2">A BATATA</label>
                  <textarea
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    className="w-full border-[3px] border-black p-3 font-sans min-h-30 bg-[#FFFEF5]"
                    placeholder="Digite a frase..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Author */}
                  <div>
                    <label className="block font-bold text-lg mb-2">QUEM DISSE?</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full border-[3px] border-black p-3 font-mono bg-white"
                      placeholder="Digite o vulgo..."
                      required
                    />
                  </div>

                  {/* Date Input */}
                  <div>
                    <label className="block font-bold text-lg mb-2">📅 DATA</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full border-[3px] border-black p-3 font-mono bg-white uppercase"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block font-bold text-lg mb-2">🔒 SENHA</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-[3px] border-black p-3 font-mono bg-white"
                    placeholder="senha-secreta"
                    required
                  />
                  <p className="text-sm font-mono mt-2 text-muted-foreground">
                    (Para evitar spam e manter a qualidade das batatadas)
                  </p>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-secondary text-black font-display text-xl py-4 border-[3px] border-black neo-shadow hover:-translate-y-0.5 hover:neo-shadow-lg transition-all disabled:opacity-50 disabled:cursor-wait"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? "ENVIANDO..." : "PUBLICAR! 🚀"}
                </motion.button>
              </form>

              {/* --- TOAST NEO-BRUTALISTA --- */}
              <AnimatePresence>
                {status && (
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className={`absolute bottom-6 left-6 right-6 p-4 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3 z-50 ${
                      status.type === 'success' ? 'bg-[#4ade80]' : 'bg-[#ff90e8]'
                    }`}
                  >
                    <div className="bg-black text-white p-1">
                        {status.type === 'success' ? <Check size={20} /> : <AlertTriangle size={20} />}
                    </div>
                    <span className="font-bold font-mono uppercase text-black text-sm md:text-base">
                        {status.message}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}