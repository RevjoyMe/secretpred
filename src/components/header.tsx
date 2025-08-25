import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              SP
            </div>
            <span className="font-work-sans font-bold text-xl text-foreground">SecretPredictions</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Markets
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Portfolio
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Learn
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>Live on Sepolia Testnet</span>
            </div>
            <Button variant="outline" size="sm">
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
