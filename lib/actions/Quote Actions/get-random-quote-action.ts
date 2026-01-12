"use server"

import { prisma } from "@/lib/prisma"

export async function getRandomQuoteId() {
  // Conta quantas frases existem
  const count = await prisma.quote.count()

  if (count === 0) return null

  // Gera um número aleatório
  const skip = Math.floor(Math.random() * count)

  // Pula até esse número e pega 1 registro (ID)
  const randomQuote = await prisma.quote.findFirst({
    take: 1,
    skip: skip,
    select: { id: true }, 
  })

  return randomQuote?.id
}