import { Header } from "@/components/header"
import { HallOfFame } from "@/components/hall-of-fame"
import { QuoteCard } from "@/components/quote-card"
import { ClientPageWrapper } from "@/components/client-page-wrapper"
import { prisma } from "@/lib/prisma"

import { getDailyQuote } from "@/lib/actions/Quote Actions/get-daily-quote" 
import { DailyQuoteCard } from "@/components/daily-quote-card"

export const dynamic = 'force-dynamic'

export default async function Home() {
  // Busca normal (feed)
  const dbQuotes = await prisma.quote.findMany({
    orderBy: { createdAt: 'desc' },
  })

  // Busca a Batatada do Dia
  const dailyQuoteRaw = await getDailyQuote()

  // Formatação de dados
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

  // Formata a Batatada do Dia (se existir)
  const dailyQuote = dailyQuoteRaw ? {
    id: dailyQuoteRaw.id,
    text: dailyQuoteRaw.text,
    author: dailyQuoteRaw.author,
    date: dailyQuoteRaw.createdAt.toISOString(),
    reactions: {
      potato: dailyQuoteRaw.reactionPotato,
      fire: dailyQuoteRaw.reactionFire,
      skull: dailyQuoteRaw.reactionSkull,
      pen: dailyQuoteRaw.reactionPen,
    },
  } : null

  // Hall of Fame 
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

      {/* SEÇÃO HERO: Grid Assimétrico */}
      <section className="container mx-auto px-4 mt-8 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ESQUERDA: Hall of Fame */}
          <div className="lg:col-span-8">
            <HallOfFame topQuotes={topQuotes} />
          </div>

          {/* DIREITA: Batatada do Dia */}
          {dailyQuote && (
            <div className="lg:col-span-4 lg:mt-28">
              <DailyQuoteCard quote={dailyQuote} />
            </div>
          )}
          
        </div>
      </section>

      <section id="main-feed" className="container mx-auto px-4 py-12">
        <h2 className="font-sans font-black text-3xl md:text-4xl text-center mb-8 bg-black text-[#FFD700] block px-8 py-4 border-[3px] border-black neo-shadow mx-auto w-fit transform -rotate-1">
          TODAS AS BATATADAS
        </h2>

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

      <ClientPageWrapper />
    </div>
  )
}