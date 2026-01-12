"use client";

import { motion } from "framer-motion";
import type { Quote } from "@/lib/quotes-data";
import { useState, useRef } from "react";
import { Share2, Loader2 } from "lucide-react";
import { addReaction } from "@/lib/actions/Quote Actions/add-reaction-action";
import Link from "next/link"; // Importante para o modal funcionar

// Bibliotecas para gerar a imagem
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

export function QuoteCard({ quote, index }: QuoteCardProps) {
  const [reactions, setReactions] = useState(quote.reactions);
  const [clickedReaction, setClickedReaction] = useState<string | null>(null);
  
  const [isSharing, setIsSharing] = useState(false);
  
  // Referência para focar a câmera do print
  const cardRef = useRef<HTMLDivElement>(null);

  const bgColor = cardBackgrounds[index % cardBackgrounds.length];

  const handleReaction = async (type: keyof typeof reactions) => {
    // Atualização otimista
    setReactions((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));

    setClickedReaction(type as string);
    setTimeout(() => setClickedReaction(null), 300);

    // Salva no servidor
    await addReaction(quote.id, type);
  };

  const handleSmartShare = async () => {
    if (cardRef.current === null || isSharing) return;
    setIsSharing(true);

    // Texto da legenda turbinado com Link
    const caption = `🥔 Dá uma olhada nessa frase!\n\n"${quote.text}" — ${quote.author}\n\nVeja mais em: https://cadernobatata.vercel.app`;

    try {
      const blob = await htmlToImage.toBlob(cardRef.current, {
        quality: 1.0,
        backgroundColor: '#fff',
        pixelRatio: 2,
      });

      if (!blob) throw new Error("Falha ao gerar imagem");
      const file = new File([blob], `batata-${quote.id}.png`, { type: 'image/png' });

      // Tenta compartilhar Imagem + Legenda
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Caderno Batata",
          text: caption,
        });
      } else {
        // Se for PC, baixa a imagem
        download(blob, `batata-${quote.author.toLowerCase().replace(/\s/g, "-")}.png`);
        
        // E copia a legenda pro clipboard pra facilitar
        await navigator.clipboard.writeText(caption);
        alert("Imagem baixada e legenda copiada! 🥔");
      }
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      // Fallback: Compartilha só o texto se a imagem falhar
      if (navigator.share) {
         navigator.share({
            title: "Caderno Batata",
            text: caption,
            url: "https://cadernobatata.vercel.app"
         });
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <motion.div
      ref={cardRef} // A câmera aponta pra cá (todo o card)
      className={`${bgColor} border-[3px] border-black neo-shadow p-6 flex flex-col break-inside-avoid mb-6 relative`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, boxShadow: "6px 6px 0px 0px #000" }}
    >
       {/* Marca d'água discreta */}
       <div className="absolute top-2 right-2 opacity-20 font-black text-[10px] pointer-events-none select-none font-mono tracking-widest">
        CADERNO BATATA
      </div>
      
      {/* LINK PARA O MODAL (Intercepting Route)
         Envolve o Texto e o Autor. Botões ficam de fora para não ativar o link ao curtir.
      */}
      <Link href={`/quote/${quote.id}`} scroll={false} className="grow flex flex-col cursor-pointer hover:opacity-80 transition-opacity">
        
        {/* Quote Text */}
        <p className="mt-3 text-xl font-bold text-black mb-6 leading-tight grow z-10">
          &quot;{quote.text}&quot;
        </p>

        {/* Footer: Author & Date */}
        <div className="border-t-[3px] border-black pt-4 mb-4 z-10">
          <div className="flex items-center justify-between">
            <span className="font-bold text-black text-lg font-sans">— {quote.author}</span>
            <span className="font-mono text-sm text-black">
              {new Date(quote.date).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>

      </Link>

      {/* Action Bar: Reactions */}
      {/* 'data-html2canvas-ignore' faz essa div ser INVISÍVEL no print */}
      <div className="flex items-center justify-between gap-2 flex-wrap" data-html2canvas-ignore="true">
        <div className="flex gap-2">
          <ReactionButton 
            emoji="🥔" 
            count={reactions.potato} 
            isActive={clickedReaction === "potato"}
            onClick={() => handleReaction("potato")}
            color="bg-primary"
          />
          {/* <ReactionButton 
            emoji="🔥" 
            count={reactions.fire} 
            isActive={clickedReaction === "fire"}
            onClick={() => handleReaction("fire")}
            color="bg-[#ffdddd]"
          />
          <ReactionButton 
            emoji="💀" 
            count={reactions.skull} 
            isActive={clickedReaction === "skull"}
            onClick={() => handleReaction("skull")}
            color="bg-[#eeeeee]"
          />
          <ReactionButton 
            emoji="✍️" 
            count={reactions.pen} 
            isActive={clickedReaction === "pen"}
            onClick={() => handleReaction("pen")}
            color="bg-[#e0f2fe]"
          /> */}
        </div>

        {/* Botão de Smart Share */}
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