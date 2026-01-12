"use client";

import { motion } from "framer-motion";
import type { Quote } from "@/lib/quotes-data";
import { useState, useRef } from "react";
import { Share2, Loader2 } from "lucide-react";
import { addReaction } from "@/lib/actions/Quote Actions/add-reaction-action";
import Link from "next/link";

import * as htmlToImage from "html-to-image";
import download from "downloadjs";

interface QuoteCardProps {
  quote: Quote;
  index: number;
}

const cardBackgrounds = [
  "bg-white",
  "bg-[#FFF8DC]", 
  "bg-[#F0FFF0]", 
  "bg-[#FFF0F5]", 
  "bg-[#F0F8FF]", 
];

// --- FUNÇÃO AUXILIAR DE TEMPO RELATIVO ---
function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  
  // Diferença em milissegundos
  const diffInMs = now.getTime() - date.getTime();
  
  // Converte para dias totais (arredondando para baixo)
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays < 0) return "Do futuro 🔮"; // Só pra garantir
  if (diffInDays === 0) return "Hoje";
  if (diffInDays === 1) return "Ontem";

  // Menos de 1 mês (30 dias)
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    if (weeks > 0) return `Há ${weeks} semana${weeks > 1 ? 's' : ''}`;
    return `Há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
  }

  // Menos de 1 ano (365 dias)
  if (diffInDays < 365) {
    // Usamos 30.44 (média exata de dias/mês) para corrigir a distorção
    const months = Math.floor(diffInDays / 30.44);
    return `Há ${months} m${months > 1 ? 'eses' : 'ês'}`;
  }

  // Anos
  const years = Math.floor(diffInDays / 365.25); // Conta bissexto
  return `Há ${years} ano${years > 1 ? 's' : ''}`;
}
// ------------------------------------------

export function QuoteCard({ quote, index }: QuoteCardProps) {
  const [reactions, setReactions] = useState(quote.reactions);
  const [clickedReaction, setClickedReaction] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const bgColor = cardBackgrounds[index % cardBackgrounds.length];

  // --- LÓGICA DO BADGE "NOVO" ---
  // Verifica se o card foi criado há menos de 7 dias (604800000 ms)
  const isNew = (new Date().getTime() - new Date(quote.date).getTime()) < (7 * 24 * 60 * 60 * 1000);

  const handleReaction = async (type: keyof typeof reactions) => {
    setReactions((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    setClickedReaction(type as string);
    setTimeout(() => setClickedReaction(null), 300);
    await addReaction(quote.id, type);
  };

  const handleSmartShare = async () => {
    if (cardRef.current === null || isSharing) return;
    setIsSharing(true);

    const shareUrl = `https://cadernobatata.vercel.app/quote/${quote.id}`;
    const caption = `🥔 Dá uma olhada nessa frase!\n\n"${quote.text}" — ${quote.author}\n\nVeja mais em: ${shareUrl}`;

    try {
      const blob = await htmlToImage.toBlob(cardRef.current, {
        quality: 1.0,
        backgroundColor: '#fff',
        pixelRatio: 2,
      });

      if (!blob) throw new Error("Falha ao gerar imagem");
      const file = new File([blob], `batata-${quote.id}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try { await navigator.clipboard.writeText(caption); } catch (err) { console.log(err); }
        await navigator.share({
          files: [file],
          title: "Caderno Batata",
          text: caption, 
          url: shareUrl, 
        });
      } else {
        download(blob, `batata-${quote.author.toLowerCase().replace(/\s/g, "-")}.png`);
        await navigator.clipboard.writeText(caption);
        alert("Imagem baixada e legenda copiada! 🥔");
      }
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      if (navigator.share) {
         navigator.share({ title: "Caderno Batata", text: caption, url: shareUrl });
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`${bgColor} border-[3px] border-black neo-shadow p-6 flex flex-col break-inside-avoid mb-6 relative`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, boxShadow: "6px 6px 0px 0px #000" }}
    >
       <div className="absolute top-2 right-2 opacity-20 font-black text-[10px] pointer-events-none select-none font-mono tracking-widest">
        CADERNO BATATA
      </div>

      {/* --- BADGE "NOVO" --- */}
      {isNew && (
        <div className="absolute -top-3 -left-3 bg-[#00FF00] text-black font-black text-xs px-2 py-1 -rotate-12 border-2 border-black z-20 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-bounce">
          NOVO
        </div>
      )}
      {/* ------------------- */}
      
      <Link href={`/quote/${quote.id}`} scroll={false} className="grow flex flex-col cursor-pointer hover:opacity-80 transition-opacity">
        
        <p className="mt-3 text-xl font-bold text-black mb-6 leading-tight grow z-10">
          &quot;{quote.text}&quot;
        </p>

        {/* Footer Atualizado */}
        <div className="border-t-[3px] border-black pt-4 mb-4 z-10">
          <div className="flex justify-between items-end">
            {/* Autor na esquerda */}
            <span className="font-bold text-black text-lg font-sans">— {quote.author}</span>
            
            {/* Data na direita (Coluna com Tempo Relativo em cima) */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mb-0.5">
                {getRelativeTime(quote.saidAt)}
              </span>
              <span className="font-mono text-sm text-black">
                {new Date(quote.saidAt).toLocaleDateString("pt-BR")}
              </span>
            </div>
          </div>
        </div>

      </Link>

      <div className="flex items-center justify-between gap-2 flex-wrap" data-html2canvas-ignore="true">
        <div className="flex gap-2">
          <ReactionButton 
            emoji="🥔" 
            count={reactions.potato} 
            isActive={clickedReaction === "potato"}
            onClick={() => handleReaction("potato")}
            color="bg-primary"
          />
          {/* <ReactionButton emoji="🔥" count={reactions.fire} isActive={clickedReaction === "fire"} onClick={() => handleReaction("fire")} color="bg-[#ffdddd]" /> */}
          {/* <ReactionButton emoji="💀" count={reactions.skull} isActive={clickedReaction === "skull"} onClick={() => handleReaction("skull")} color="bg-[#eeeeee]" /> */}
          {/* <ReactionButton emoji="✍️" count={reactions.pen} isActive={clickedReaction === "pen"} onClick={() => handleReaction("pen")} color="bg-[#e0f2fe]" /> */}
        </div>

        <motion.button
          onClick={handleSmartShare}
          disabled={isSharing}
          className="bg-[#FFD700] border-2 border-black p-2 hover:-translate-y-0.5 transition-all min-w-10 flex items-center justify-center"
          whileHover={{ rotate: 15 }}
          whileTap={{ scale: 0.95 }}
          title="Gerar imagem e compartilhar"
        >
          {isSharing ? (
            <Loader2 className="w-5 h-5 text-black animate-spin" />
          ) : (
            <Share2 className="w-5 h-5 text-black" />
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ReactionButton({ emoji, count, onClick, isActive, color }: any) {
  return (
    <motion.button
      onClick={onClick}
      className={`${color} border-2 border-black px-2 py-1 md:px-3 md:py-2 font-bold hover:-translate-y-0.5 transition-all text-sm md:text-base flex items-center gap-1`}
      whileTap={{ scale: 1.2 }}
      animate={isActive ? { scale: [1, 1.2, 1] } : {}}
    >
      <span>{emoji}</span>
      <span className="font-mono">{count}</span>
    </motion.button>
  );
}