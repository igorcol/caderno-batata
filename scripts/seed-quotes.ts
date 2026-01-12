import { PrismaClient } from "@prisma/client"
import fs from "fs"
import path from "path"

const prisma = new PrismaClient()

async function main() {
  const filePath = path.join(process.cwd(), "import.txt")
  
  if (!fs.existsSync(filePath)) {
    console.error("❌ Arquivo 'import.txt' não encontrado!")
    return
  }

  const rawContent = fs.readFileSync(filePath, "utf-8")
  console.log("📂 Arquivo lido. Iniciando a Cirurgia de Separação...")

  // CORTE (SPLIT)
  // Divide o texto sempre que encontrar o padrão de data: [DD/MM...
  // O (?=...) é um "lookahead", ele corta mas mantém a data no pedaço seguinte.
  const messages = rawContent.split(/(?=\[\d{2}\/\d{2}(?:\/\d{4})?, \d{2}:\d{2}\])/g)

  // Remove pedaços vazios
  const cleanMessages = messages.filter(m => m.trim().length > 0)

  console.log(`🔍 Encontrados ${cleanMessages.length} blocos de mensagem possíveis.`)

  let count = 0

  for (const block of cleanMessages) {
    try {
      // EXTRAIR DATA E HORA DO CABEÇALHO
      // Pega a primeira linha ou o começo do bloco
      const headerRegex = /\[(\d{2}\/\d{2}(?:\/\d{4})?), (\d{2}:\d{2})\]/
      const headerMatch = block.match(headerRegex)

      if (!headerMatch) continue // Se não achou data, pula

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, dateStr, timeStr] = headerMatch

      // EXTRAIR A FRASE (ENTRE ASPAS)
      // Procura o conteúdo entre a primeira e a última aspa do bloco
      // Aceita aspas retas (") e curvas (“ ”)
      const quoteRegex = /["“]([\s\S]*?)["”]/
      const quoteMatch = block.match(quoteRegex)

      if (!quoteMatch) {
        // Se não tem aspas, provavelmente é conversa fiada, pula
        continue
      }

      const text = quoteMatch[1].trim()

      // EXTRAIR O AUTOR (O QUE SOBROU DEPOIS DAS ASPAS)
      // Pega tudo que vem DEPOIS do fechamento da aspa até o fim do bloco
      // index[0] é o texto todo da match ("frase"), index da match + tamanho da match = onde acabou a aspa
      const endOfQuoteIndex = (quoteMatch.index || 0) + quoteMatch[0].length
      let potentialAuthor = block.substring(endOfQuoteIndex).trim()

      // Limpeza do Autor
      // Remove caracteres comuns de separação no começo (~, -, _, traços longos, quebras de linha)
      potentialAuthor = potentialAuthor.replace(/^[\s\n\r]*[~_\-–—]+[\s]*/, "")
      
      // Se sobrou pouca coisa ou nada, define como Desconhecido
      let finalAuthor = "Desconhecido"
      
      // Validação: Se o resto for maior que 1 letra, consideramos autor
      if (potentialAuthor.length > 1) {
        finalAuthor = potentialAuthor
      }

      // TRATAMENTO DA DATA 
      let fullDateStr = dateStr
      if (dateStr.length === 5) { // ex: 04/01
        fullDateStr = `${dateStr}/2026` 
      }
      const [day, month, year] = fullDateStr.split('/').map(Number)
      const [hours, minutes] = timeStr.split(':').map(Number)
      const finalDate = new Date(year, month - 1, day, hours, minutes)

      // 5. SALVAR NO BANCO
      await prisma.quote.create({
        data: {
          text: text,
          author: finalAuthor,
          createdAt: finalDate,
          reactionPotato: 0,
          reactionFire: 0,
          reactionSkull: 0,
          reactionPen: 0,
          approved: true,
        },
      })
      
      console.log(`✅ [${finalAuthor}] disse: "${text.substring(0, 20)}..."`)
      count++

    } catch (error) {
      console.error(`❌ Erro no bloco iniciado em: ${block.substring(0, 20)}`, error)
    }
  }

  console.log(`\n🎉 Sucesso! ${count} batatadas importadas.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })