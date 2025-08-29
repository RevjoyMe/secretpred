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
      {/* Верхний ряд: Логотип и кошелек */}
      <div className="header-content">
        <div className="flex items-center justify-between w-full">
          {/* Logo - Left */}
          <h1 className="text-accent font-bold text-2xl tracking-tight">
            SecretPredictions
          </h1>

          {/* Wallet & User Info - Right */}
          <div className="flex items-center gap-6">
            {/* Wallet Balance */}
            <div className="flex items-center gap-3">
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

      {/* Нижний ряд: Навигация и фильтры */}
      <div className="main-content w-full">
        <div className="flex items-start gap-12">
          {/* Левая колонка: Навигация */}
          <div className="flex flex-col gap-4">
            <nav className="flex flex-col gap-3">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`text-lg font-medium transition-colors ${
                    item.active ? 'text-accent' : 'text-secondary hover:text-foreground'
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Правая колонка: Фильтры (только на Markets page) */}
          {pathname === '/' && onFilterChange && (
            <div className="flex-1">
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
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
