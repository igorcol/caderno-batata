"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

const MOCKED_PASS = "caderno@batata"

// Adicionei o campo date aqui na tipagem
export async function submitQuote(data: { quote: string; author: string; password: string; date: string }) {
  
  if (data.password !== MOCKED_PASS) {
    return { success: false, message: "Senha incorreta! Acesso negado. 🔒" }
  }

  try {
    const customDate = new Date(data.date + "T12:00:00")

    await prisma.quote.create({
      data: {
        text: data.quote,
        author: data.author,
        createdAt: customDate, 
      },
    })

    revalidatePath("/")
    return { success: true, message: "Batatada eternizada com sucesso! 🚀" }

  } catch (error) {
    console.error("Erro ao salvar:", error)
    return { success: false, message: "Erro no servidor. Tente de novo. ⚠️" }
  }
}