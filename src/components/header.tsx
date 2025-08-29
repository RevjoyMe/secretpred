'use client';

import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Markets', href: '/', active: pathname === '/' },
    { name: 'Portfolio', href: '/portfolio', active: pathname === '/portfolio' },
    { name: 'History', href: '/history', active: pathname === '/history' },
    { name: 'Analytics', href: '/analytics', active: pathname === '/analytics' },
  ];

  return (
    <header className="header-minimal">
      <div className="main-content">
        <div className="flex items-center justify-between">
          {/* Logo - Left */}
          <div className="flex items-center">
            <h1 className="text-accent font-bold text-2xl tracking-tight">
              SecretPredictions
            </h1>
          </div>

          {/* Desktop Navigation - Center */}
          <nav className="flex header-nav">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={item.active ? 'active' : ''}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* User Profile & Wallet - Right */}
          <div className="flex items-center gap-4">
            {/* User Profile */}
            <div className="user-profile">
              <div className="user-avatar">
                U
              </div>
              <div className="user-balance">
                <div className="balance-amount">5.7407 ETH</div>
                <div className="balance-label">0x89...53ef</div>
              </div>
            </div>

            {/* Connect Button */}
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}
