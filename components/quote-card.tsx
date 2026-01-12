"use client";

import { motion } from "framer-motion";
import type { Quote } from "@/lib/quotes-data";
import { useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Share2 } from "lucide-react";
import { addReaction } from "@/lib/actions/Quote Actions/add-reaction-action";

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

  const bgColor = cardBackgrounds[index % cardBackgrounds.length];

  const handleReaction = async (type: keyof typeof reactions) => {
    setReactions((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));

    setClickedReaction(type as string);
    setTimeout(() => setClickedReaction(null), 300);

    await addReaction(quote.id, type);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Caderno Batata",
        text: `"${quote.text}" - ${quote.author}`,
      });
    }
  };

  return (
    <motion.div
      className={`${bgColor} border-[3px] border-black neo-shadow p-6 flex flex-col break-inside-avoid mb-6`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, boxShadow: "6px 6px 0px 0px #000" }}
    >
      {/* Quote Text */}
      <p className="text-xl font-bold text-black mb-6 leading-tight grow">
        &quot;{quote.text}&quot;
      </p>

      {/* Footer: Author & Date */}
      <div className="border-t-[3px] border-black pt-4 mb-4">
        <div className="flex items-center justify-between">
          <span className="font-bold text-black text-lg">— {quote.author}</span>
          <span className="font-mono text-sm text-black">
            {new Date(quote.date).toLocaleDateString("pt-BR")}
          </span>
        </div>
      </div>

      {/* Action Bar: Reactions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <motion.button
            onClick={() => handleReaction("potato")}
            className="bg-primary border-2 border-black px-3 py-2 font-bold hover:-translate-y-0.5 transition-all"
            whileTap={{ scale: clickedReaction === "potato" ? 1.3 : 0.95 }}
          >
            🥔 {reactions.potato}
          </motion.button>
          {/* <motion.button
            onClick={() => handleReaction("fire")}
            className="bg-secondary border-2 border-black px-3 py-2 font-bold hover:-translate-y-0.5 transition-all"
            whileTap={{ scale: clickedReaction === "fire" ? 1.3 : 0.95 }}
          >
            🔥 {reactions.fire}
          </motion.button>
          <motion.button
            onClick={() => handleReaction("skull")}
            className="bg-muted border-2 border-black px-3 py-2 font-bold hover:-translate-y-0.5 transition-all"
            whileTap={{ scale: clickedReaction === "skull" ? 1.3 : 0.95 }}
          >
            💀 {reactions.skull}
          </motion.button>
          <motion.button
            onClick={() => handleReaction("pen")}
            className="bg-muted border-2 border-black px-3 py-2 font-bold hover:-translate-y-0.5 transition-all"
            whileTap={{ scale: clickedReaction === "pen" ? 1.3 : 0.95 }}
          >
            ✍️ {reactions.pen}
          </motion.button> */}
        </div>

        {/* <motion.button
          onClick={handleShare}
          className="bg-accent border-2] border-black p-2 hover:-translate-y-0.5 transition-all"
          whileHover={{ rotate: 15 }}
          whileTap={{ scale: 0.95 }}
        >
          <Share2 className="w-5 h-5 text-black" />
        </motion.button> */}
      </div>
    </motion.div>
  );
}
