export interface Market {
  id: string | number
  title: string
  description: string
  category: string
  status: "active" | "closed" | "pending" | "resolved"
  yesPrice: number
  noPrice: number
  volume: string
  participants: number
  timeRemaining?: string
  endDate?: string
  createdBy?: string
  liquidity?: string
}
