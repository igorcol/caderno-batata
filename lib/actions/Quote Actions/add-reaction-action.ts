"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function addReaction(quoteId: string, type: 'potato' | 'fire' | 'skull' | 'pen') {
  // Mapeiatipo de reação para o nome da coluna no db
  const columnMap = {
    potato: 'reactionPotato',
    fire: 'reactionFire',
    skull: 'reactionSkull',
    pen: 'reactionPen',
  }

  const columnName = columnMap[type]

  try {
    // Incrementa +1 direto no banco (atômico, evita erro se 2 pessoas clicarem juntas)
    await prisma.quote.update({
      where: { id: quoteId },
      data: {
        [columnName]: {
          increment: 1,
        },
      },
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Erro ao dar like:", error)
    return { success: false }
  }
}