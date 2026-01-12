
import { Modal } from "@/components/modal"
import { QuoteCard } from "@/components/quote-card"
import { prisma } from "@/lib/prisma"

export default async function QuoteModalPage({ params }: { params: Promise<{ id: string }> }) {
  
  const { id } = await params

  const quoteData = await prisma.quote.findUnique({
    where: { id: id }, 
  })

  if (!quoteData) return null

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
    <Modal>
      <QuoteCard quote={quote} index={0} />
    </Modal>
  )
}