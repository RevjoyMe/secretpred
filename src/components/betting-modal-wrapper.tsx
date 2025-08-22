"use client"

import dynamic from 'next/dynamic'

// Динамический импорт BettingModal для избежания SSR проблем
const BettingModal = dynamic(() => import('./betting-modal').then(mod => ({ default: mod.BettingModal })), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

export { BettingModal }
