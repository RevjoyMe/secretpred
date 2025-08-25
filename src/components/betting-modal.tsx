"use client"
// Updated betting modal with proper balance handling and emojis

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAccount, useBalance } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import type { Market } from "@/types/market"
import { TrendingUp, AlertTriangle, Lock, Zap, ExternalLink, CheckCircle } from "lucide-react"
import { usePlaceBet } from '@/hooks/usePredictionMarket'

interface BettingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  market: Market | null
  side: "yes" | "no" | null
}

export function BettingModal({ open, onOpenChange, market, side }: BettingModalProps) {
  const { isConnected, address } = useAccount()
  const { data: balance, isLoading: balanceLoading, error: balanceError } = useBalance({
    address,
    chainId: sepolia.id,
    watch: true,
    enabled: !!address && isConnected,
    query: {
      retry: 5,
      retryDelay: 2000,
      staleTime: 10 * 1000, // 10 seconds
    },
  })
  
  const [betAmount, setBetAmount] = useState("")
  const [error, setError] = useState("")

  // Use hook for on-chain transactions
  const { placeBet, resetErrors, isLoading, isSuccess, error: txError, hash, fheReady } = usePlaceBet(
    parseInt(String(market?.id || "0")), 
    betAmount, 
    side || "yes"
  )

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setBetAmount("")
      setError("")
      resetErrors() // Reset hook errors
    }
  }, [open, resetErrors])

  // Handle successful transaction
  useEffect(() => {
    if (isSuccess && hash) {
      console.log('[SUCCESS] Transaction confirmed! Hash:', hash)
      setError("") // Clear errors
      // Close modal after successful completion
      setTimeout(() => {
        onOpenChange(false)
              }, 2000) // Give user time to see success
    }
  }, [isSuccess, hash, onOpenChange])

  // Handle transaction errors
  useEffect(() => {
    if (txError) {
      console.error('[ERROR] Transaction failed:', txError)
      setError(`Transaction failed: ${txError.message || txError}`)
    }
  }, [txError])

  if (!market || !side) return null

  const currentPrice = side === "yes" ? market.yesPrice : market.noPrice
  const betAmountNum = Number.parseFloat(betAmount) || 0
  const potentialPayout = betAmountNum > 0 ? betAmountNum / (currentPrice / 100) : 0
  const potentialProfit = potentialPayout - betAmountNum
  const platformFee = betAmountNum * 0.02 // 2% platform fee
  const totalCost = betAmountNum + platformFee

  const validateBet = () => {
    if (!isConnected) {
      setError("Please connect your wallet first")
      return false
    }

    if (betAmountNum <= 0) {
      setError("Please enter a valid bet amount")
      return false
    }

    if (betAmountNum < 0.01) {
      setError("Minimum bet amount is 0.01 ETH")
      return false
    }

    const userBalance = Number.parseFloat(balance?.formatted || "0")
    if (totalCost > userBalance) {
      setError(`Insufficient balance. You have ${userBalance} ${balance?.symbol}, need ${totalCost} ETH`)
      return false
    }

    if (market.status !== "active") {
      setError("This market is not active")
      return false
    }

    return true
  }

  const handlePlaceBet = async () => {
    console.log('[MODAL] handlePlaceBet called')
    console.log('[MODAL] Current state:', { 
      isConnected, 
      betAmount, 
      marketId: market?.id, 
      side,
      balance: balance?.formatted 
    })
    
    if (!validateBet()) {
      console.log('[MODAL] Validation failed')
      return
    }

    setError("")
    console.log(`[MODAL] Placing ${side} bet of ${betAmount} ETH on market ${market.id}`)

    try {
      console.log('[MODAL] About to call placeBet()')
      // Call placeBet and wait for result
      await placeBet()
      
      // Не закрываем модал сразу, показываем статус транзакции
      console.log('[MODAL] placeBet() completed successfully')
      
      // Показываем сообщение об успешной инициации транзакции
      setError("") // Очищаем ошибки
      
      // Модал закроется только после успешного завершения транзакции
      // или при ошибке
    } catch (err) {
      console.error('[MODAL] placeBet() threw an error:', err)
      setError("Failed to place bet. Please try again.")
      console.error("[MODAL] Bet placement failed:", err)
    }
  }

  const getSideColor = (betSide: "yes" | "no") => {
    return betSide === "yes"
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : "bg-red-500/20 text-red-400 border-red-500/30"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md !bg-white !border-gray-300 shadow-2xl !text-gray-900">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 !text-gray-900">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>Place Bet</span>
          </DialogTitle>
          <DialogDescription className="!text-gray-600">{market.title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Market Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Betting on:</span>
              <Badge className={getSideColor(side)} variant="outline">
                {side.toUpperCase()} - {currentPrice}%
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{market.description}</p>
          </div>

          <Separator />

          {/* Bet Amount Input */}
          <div className="space-y-3">
            <Label htmlFor="bet-amount" className="!text-gray-900">
              Bet Amount (ETH)
            </Label>
            <div className="relative">
              <Input
                id="bet-amount"
                type="number"
                placeholder="0.00"
                value={betAmount}
                onChange={(e) => {
                  setBetAmount(e.target.value)
                  setError("")
                }}
                step="0.01"
                min="0.01"
                className="pr-16 !bg-gray-50 !text-gray-900 !border-gray-300"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600">ETH</div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex gap-2">
              {["0.1", "0.5", "1.0"].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount(amount)}
                  className="text-xs bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
                >
                  {amount} ETH
                </Button>
              ))}
            </div>
          </div>

          {/* Bet Summary */}
          {betAmountNum > 0 && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-sm !text-gray-900">Bet Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bet Amount:</span>
                  <span className="!text-gray-900">{betAmount} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee (2%):</span>
                  <span className="!text-gray-900">{platformFee.toFixed(4)} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="font-medium !text-gray-900">{totalCost.toFixed(4)} ETH</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Potential Payout:</span>
                  <span className="text-primary font-medium">{potentialPayout.toFixed(4)} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Potential Profit:</span>
                  <span className="text-secondary font-medium">+{potentialProfit.toFixed(4)} ETH</span>
                </div>
              </div>
            </div>
          )}

          {/* FHE Status */}
          {!fheReady && isConnected && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
                <span className="text-sm text-yellow-800">Initializing FHE encryption...</span>
              </div>
            </div>
          )}

          {/* Wallet Balance */}
          {isConnected && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Wallet Balance:</span>
              <span className="font-medium !text-gray-900">
                {balanceLoading ? '🔄 Loading balance...' : 
                 balanceError ? '❌ Error loading balance' :
                 balance ? `💰 ${balance.formatted} ${balance.symbol}` : '📊 No balance data'}
              </span>
            </div>
          )}

          {/* Success Alert */}
          {isSuccess && hash && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <div className="space-y-1">
                  <div>✅ Bet placed successfully!</div>
                  <div className="text-xs font-mono">
                    TX Hash: {hash.slice(0, 10)}...{hash.slice(-8)}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Encryption Notice */}
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Your bet will be encrypted on-chain until market resolution for maximum privacy and fairness.
            </AlertDescription>
          </Alert>

          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
              <div>Debug: Connected={isConnected ? 'Yes' : 'No'}</div>
              <div>Debug: Bet Amount={betAmount}</div>
              <div>Debug: Market ID={market?.id}</div>
              <div>Debug: Side={side}</div>
              <div>Debug: Loading={isLoading ? 'Yes' : 'No'}</div>
              <div>Debug: Success={isSuccess ? 'Yes' : 'No'}</div>
              {txError && <div>Debug: Error={txError.toString()}</div>}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 !text-gray-900 !border-gray-300 hover:!bg-gray-100"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePlaceBet}
              disabled={isLoading || !isConnected || betAmountNum <= 0 || !fheReady}
              className="flex-1 crypto-glow"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 animate-pulse" />
                  <span>Processing Transaction...</span>
                </div>
              ) : isSuccess ? (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Bet Placed Successfully!</span>
                </div>
              ) : (
                `Place ${side.toUpperCase()} Bet`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BettingModal
