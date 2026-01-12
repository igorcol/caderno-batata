export interface Quote {
  id: string
  text: string
  author: string
  date: string      
  saidAt: string    
  reactions: {
    potato: number
    fire: number
    skull: number
    pen: number
  }
}

