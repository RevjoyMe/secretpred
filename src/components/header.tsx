'use client';

import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface HeaderProps {
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
}

const categories = [
  { id: 'all', name: 'All' },
  { id: 'politics', name: 'Politics' },
  { id: 'crypto', name: 'Crypto' },
  { id: 'finance', name: 'Finance' },
  { id: 'technology', name: 'Technology' },
  { id: 'sports', name: 'Sports' },
  { id: 'culture', name: 'Culture' }
];

export default function Header({ activeFilter = 'all', onFilterChange }: HeaderProps) {
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
        {/* Top row: Logo, Navigation, Wallet */}
        <div className="flex items-center justify-between mb-4">
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

        {/* Bottom row: Filters (only on Markets page) */}
        {pathname === '/' && onFilterChange && (
          <div className="filter-container">
            <div className="filter-buttons">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onFilterChange(category.id)}
                  className={`filter-btn ${activeFilter === category.id ? 'active' : ''}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
