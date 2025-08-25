export function Header() {
  return (
    <header className="border-b" style={{ 
      borderColor: '#d1d5db',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)'
    }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div 
              className="flex h-8 w-8 items-center justify-center rounded-lg font-bold text-sm text-white"
              style={{ backgroundColor: '#164e63' }}
            >
              SP
            </div>
            <span className="font-work-sans font-bold text-xl" style={{ color: '#164e63' }}>SecretPredictions</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-sm font-medium transition-colors" style={{ color: '#6b7280' }}>
              Markets
            </a>
            <a href="#" className="text-sm font-medium transition-colors" style={{ color: '#6b7280' }}>
              Portfolio
            </a>
            <a href="#" className="text-sm font-medium transition-colors" style={{ color: '#6b7280' }}>
              Learn
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm" style={{ color: '#6b7280' }}>
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
              <span>Live on Sepolia Testnet</span>
            </div>
            <button 
              className="px-3 py-1 text-sm rounded-md border transition-colors"
              style={{ 
                borderColor: '#d1d5db',
                color: '#164e63',
                backgroundColor: 'transparent'
              }}
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
