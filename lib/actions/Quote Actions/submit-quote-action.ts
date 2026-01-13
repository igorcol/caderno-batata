"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { sendPushNotification } from "../Notifications/send-push-notification" 

const MOCKED_PASS = "caderno@batata"

export async function submitQuote(data: { quote: string; author: string; password: string; date: string }) {
  
  if (data.password !== MOCKED_PASS) {
    return { success: false, message: "Senha incorreta! Acesso negado. 🔒" }
  }

  try {
    // data que a pessoa falou 
    const dateSaid = new Date(data.date + "T12:00:00")

    // CRIA NO BANCO
    const newQuote = await prisma.quote.create({
      data: {
        text: data.quote,
        author: data.author,
        saidAt: dateSaid,       // Data antiga (histórica)
        createdAt: new Date(),  // Data de agora (para aparecer como NOVO)
      },
    })

    // DISPARA A NOTIFICAÇÃO 
    try {
        await sendPushNotification(newQuote.text, newQuote.author);
    } catch (pushError) {
        console.error("Falha ao enviar push, mas a frase foi salva:", pushError);
    }

    revalidatePath("/")
    return { success: true, message: "Batatada publicada! 🚀" }

  } catch (error) {
    console.error("Erro ao salvar:", error)
    return { success: false, message: "Erro no servidor. Tente de novo. ⚠️" }
  }
}