
import { Header } from "@/components/header"
import { HallOfFame } from "@/components/hall-of-fame"
import { QuoteCard } from "@/components/quote-card"
import { prisma } from "@/lib/prisma"
import { ClientPageWrapper } from "@/components/client-page-wrapper"

// Força a página a ser dinâmica (sem cache estático), para sempre mostrar frases novas
export const dynamic = 'force-dynamic'

export default async function Home() {
  // 1. BUSCA DO BANCO DE DADOS (Server Side)
  const dbQuotes = await prisma.quote.findMany({
    orderBy: {
      createdAt: 'desc', // As mais novas aparecem no topo
    },
  })

  // 2. ADAPTAÇÃO DE DADOS (Banco -> Visual)
  // O banco traz "reactionPotato", o front espera "reactions: { potato: ... }"
  const quotes = dbQuotes.map((q) => ({
    id: q.id,
    text: q.text,
    author: q.author,
    date: q.createdAt.toISOString(),
    reactions: {
      potato: q.reactionPotato,
      fire: q.reactionFire,
      skull: q.reactionSkull,
      pen: q.reactionPen,
    },
  }))

  // 3. LÓGICA DO HALL DA FAMA
  // Pega as 3 com mais reações somadas
  const topQuotes = [...quotes]
    .sort((a, b) => {
      const totalA = a.reactions.potato + a.reactions.fire + a.reactions.skull + a.reactions.pen
      const totalB = b.reactions.potato + b.reactions.fire + b.reactions.skull + b.reactions.pen
      return totalB - totalA
    })
    .slice(0, 3)

  return (
    <div className="min-h-screen">
      <Header />

      <HallOfFame topQuotes={topQuotes} />

      {/* Main Feed */}
      <section id="main-feed" className="container mx-auto px-4 py-12">
        <h2 className="font-sans font-black text-3xl md:text-4xl text-center mb-8 bg-black text-[#FFD700] block px-8 py-4 border-[3px] border-black neo-shadow mx-auto w-fit transform -rotate-1">
          TODAS AS BATATADAS
        </h2>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {quotes.map((quote, index) => (
            <QuoteCard key={quote.id} quote={quote} index={index} />
          ))}
          
          {quotes.length === 0 && (
            <div className="col-span-full text-center py-20 opacity-50 font-mono">
              <p>Nenhuma pérola encontrada... Seja o primeiro!</p>
            </div>
          )}
        </div>
      </section>

      {/* Componente Cliente para controlar o Modal (já que esta página agora é Server) */}
      <ClientPageWrapper />
    </div>
  )
}