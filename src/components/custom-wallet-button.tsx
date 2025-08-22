"use client"

import { useState } from 'react'
import { useConnect, useAccount, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Wallet, X } from 'lucide-react'

export function CustomWalletButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { address, isConnected } = useAccount()
  const { connect, connectors, isLoading, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => disconnect()}
          className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
        >
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Connect Wallet</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            {connectors.map((connector) => (
              <Button
                key={connector.id}
                onClick={() => {
                  connect({ connector })
                  setIsOpen(false)
                }}
                disabled={!connector.ready || isLoading}
                className="w-full justify-start h-12 text-left"
                variant="outline"
              >
                <div className="flex items-center space-x-3">
                  {connector.id === 'metaMask' && (
                    <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">M</span>
                    </div>
                  )}
                  {connector.id === 'injected' && (
                    <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">I</span>
                    </div>
                  )}
                  {connector.id === 'walletConnect' && (
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">WC</span>
                    </div>
                  )}
                  <div>
                    <div className="font-medium">
                      {connector.id === 'metaMask' && 'MetaMask'}
                      {connector.id === 'injected' && 'Browser Wallet'}
                      {connector.id === 'walletConnect' && 'WalletConnect'}
                    </div>
                    {!connector.ready && <div className="text-xs text-muted-foreground">(unsupported)</div>}
                  </div>
                  {isLoading && connector.id === pendingConnector?.id && (
                    <div className="ml-auto">
                      <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
