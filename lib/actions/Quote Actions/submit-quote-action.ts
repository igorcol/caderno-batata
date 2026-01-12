"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma" 

const MOCKED_PASS = "fodassefodasse"

export async function submitQuote(data: { quote: string; author: string; password: string }) {
  // Validação
  if (data.password !== MOCKED_PASS) {
    return { success: false, message: "Senha incorreta! Acesso negado. 🔒" }
  }

  try {
    // Salva no Supabase
    await prisma.quote.create({
      data: {
        text: data.quote,
        author: data.author,
        // reações começam zeradas 
      },
    })

    revalidatePath("/")
    return { success: true, message: "Batatada publicada! 🚀" }

  } catch (error) {
    console.error("Erro ao salvar:", error)
    return { success: false, message: "Erro. Tente de novo. ⚠️" }
  }
}