"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAccount } from 'wagmi'
import type { Market } from "./market-card"
import { TrendingUp, AlertTriangle, Lock, Zap, ExternalLink } from "lucide-react"
import { usePlaceBet } from '@/hooks/usePredictionMarket'
import { BalanceRefresh } from '@/components/ui/balance-refresh'
import { NetworkStatus } from '@/components/ui/network-status'

interface BettingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  market: Market | null
  side: "yes" | "no" | null
}

export function BettingModal({ open, onOpenChange, market, side }: BettingModalProps) {
  const { isConnected, address } = useAccount()
  
  const [betAmount, setBetAmount] = useState("")
  const [error, setError] = useState("")
  
  // Используем хук для реальных транзакций
  const { placeBet, isLoading: isPlacingBet, isSuccess, error: transactionError, hash } = usePlaceBet(
    market?.id ? Number(market.id) : 0,
    betAmount,
    side || "yes"
  )

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setBetAmount("")
      setError("")
    }
  }, [open])

  // Handle transaction success
  useEffect(() => {
    if (isSuccess) {
      console.log('[SUCCESS] Bet placed successfully! Hash:', hash)
      // Не закрываем модал сразу, показываем успех
    }
  }, [isSuccess, hash])

  // Handle transaction errors
  useEffect(() => {
    if (transactionError) {
      console.error('[ERROR] Transaction failed:', transactionError)
      setError(`Transaction failed: ${transactionError.message}`)
    }
  }, [transactionError])

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

    // Для валидации баланса используем приблизительную проверку
    // Точная проверка будет в компоненте WalletBalance
    if (totalCost > 1000) { // Максимальная ставка 1000 ETH
      setError(`Bet amount too high. Maximum bet is 1000 ETH`)
      return false
    }

    if (market.status !== "active") {
      setError("This market is not active")
      return false
    }

    return true
  }

  const handlePlaceBet = async () => {
    if (!validateBet()) return

    setError("")
    console.log(`[TRANSACTION] Placing ${side} bet of ${betAmount} ETH on market ${market.id}`)

    try {
      // Вызываем реальную транзакцию
      placeBet()
    } catch (err) {
      setError("Failed to place bet. Please try again.")
      console.error("[TRANSACTION] Bet placement failed:", err)
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

          {/* Network Status */}
          {isConnected && (
            <div className="mb-4">
              <NetworkStatus className="text-sm" />
            </div>
          )}

          {/* Wallet Balance */}
          {isConnected && (
            <div className="flex items-center justify-between text-sm">
              <BalanceRefresh className="font-medium !text-gray-900" />
            </div>
          )}

          {/* Transaction Status */}
          {isPlacingBet && (
            <Alert>
              <Zap className="h-4 w-4 animate-pulse" />
              <AlertDescription>
                Transaction is being processed... Please confirm in your wallet.
              </AlertDescription>
            </Alert>
          )}

          {isSuccess && hash && (
            <Alert>
              <TrendingUp className="h-4 w-4 text-green-500" />
              <AlertDescription className="flex items-center gap-2">
                <span>Bet placed successfully!</span>
                <a
                  href={`https://sepolia.etherscan.io/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                >
                  View on Etherscan
                  <ExternalLink className="w-3 h-3" />
                </a>
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

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 bg-red-500 text-white border-red-500 hover:bg-red-600"
              disabled={isPlacingBet}
            >
              {isSuccess ? 'Close' : 'Cancel'}
            </Button>
            {!isSuccess && (
              <Button
                onClick={handlePlaceBet}
                disabled={!isConnected || betAmountNum <= 0 || isPlacingBet}
                className="flex-1 crypto-glow"
              >
                {isPlacingBet ? (
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 animate-pulse" />
                    <span>Confirming Transaction...</span>
                  </div>
                ) : (
                  `Place ${side.toUpperCase()} Bet`
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
