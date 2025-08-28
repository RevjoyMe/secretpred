'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Markets', href: '/', active: true },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'History', href: '/history' },
    { name: 'Analytics', href: '/analytics' },
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
          <nav className="hidden md:flex header-nav">
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
          <div className="hidden md:flex items-center gap-4">
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

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="btn-minimal"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <div className="pt-4 space-y-3">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`block py-3 text-secondary hover:text-accent transition-colors ${
                    item.active ? 'text-accent' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 border-t border-border">
                <ConnectButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
