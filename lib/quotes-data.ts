export interface Quote {
  id: string
  text: string
  author: string
  date: string
  reactions: {
    potato: number
    fire: number
    skull: number
    pen: number
  }
}

export const quotesData: Quote[] = [
  {
    id: "1",
    text: "Se a vida te der limões, faça uma caipirinha e finja que é suco detox.",
    author: "Jorginho",
    date: "2024-01-15",
    reactions: { potato: 0, fire: 0, skull: 0, pen: 0 },
  },
  
]

export const getTopQuotes = (limit = 3): Quote[] => {
  return [...quotesData]
    .sort((a, b) => {
      const totalA = a.reactions.potato + a.reactions.fire + a.reactions.skull
      const totalB = b.reactions.potato + b.reactions.fire + b.reactions.skull
      return totalB - totalA
    })
    .slice(0, limit)
}

export const getRandomQuote = (): Quote => {
  return quotesData[Math.floor(Math.random() * quotesData.length)]
}
