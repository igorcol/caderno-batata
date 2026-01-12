"use server"

import { revalidatePath } from "next/cache"

const MOCKED_PASSWORD = "fodassefodasse"

// Simulação de delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function submitQuote(data: { quote: string; author: string; password: string }) {

  // Valida a senha 
  if (data.password !== MOCKED_PASSWORD) {
    await delay(500) // todo: REMOVER ISSO AQUI
    return { success: false, message: "SENHA ERRADA!!!" }
  }

  // TODO: Salvar no DB
  
  console.log("Nova batatada recebida:", data.quote, "Por:", data.author)
  
  await delay(1000) // TODO: REMOVER ISSO AQUI

  // Recarrega a pagina
  revalidatePath("/")

  return { success: true, message: "Batatada eternizada com sucesso! 🚀" }
}