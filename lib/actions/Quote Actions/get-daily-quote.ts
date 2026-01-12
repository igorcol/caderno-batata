import { prisma } from "@/lib/prisma"

export async function getDailyQuote() {
  // Conta quantas frases temos
  const count = await prisma.quote.count()

  if (count === 0) return null

  // Gera um hash baseado na data de hoje (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0] // "2024-02-10"
  
  let hash = 0
  for (let i = 0; i < today.length; i++) {
    hash = today.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  // Transforma o hash em um índice de 0 até o total de frases
  const randomIndex = Math.abs(hash) % count

  // Busca a frase
  const dailyQuoteData = await prisma.quote.findFirst({
    skip: randomIndex,
    take: 1,
  })

  return dailyQuoteData
}