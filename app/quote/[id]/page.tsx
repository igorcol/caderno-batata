import { QuoteCard } from "@/components/quote-card"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"


export default async function QuotePage({ params }: { params: Promise<{ id: string }> }) {
  

  const { id } = await params

  const quoteData = await prisma.quote.findUnique({
    where: { id: id },
  })

  if (!quoteData) {
    return <div className="p-10 text-center font-bold">Batatada não encontrada 😕</div>
  }

  const quote = {
    id: quoteData.id,
    text: quoteData.text,
    author: quoteData.author,
    date: quoteData.createdAt.toISOString(),
    reactions: {
      potato: quoteData.reactionPotato,
      fire: quoteData.reactionFire,
      skull: quoteData.reactionSkull,
      pen: quoteData.reactionPen,
    },
  }

  return (
    <div className="min-h-screen bg-[#FFFEF5] flex flex-col items-center justify-center p-4">
      <Link href="/" className="mb-8 flex items-center gap-2 font-bold hover:underline">
        <ArrowLeft /> Voltar para o Caderno
      </Link>
      
      <div className="w-full max-w-lg">
        <QuoteCard quote={quote} index={0} />
      </div>
    </div>
  )
}