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
    <header className="bg-background border-b border-border px-6 py-4 flex flex-col gap-6">
      {/* Верхний ряд: Логотип и кошелек */}
      <div className="flex items-center justify-between w-full">
        {/* Logo - Left */}
        <h1 className="text-accent font-bold text-3xl tracking-tight">
          SecretPredictions
        </h1>

        {/* Wallet & User Info - Right */}
        <div className="flex items-center gap-8">
          {/* Wallet Balance */}
          <div className="flex items-center gap-4">
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

      {/* Нижний ряд: Навигация и фильтры */}
      <div className="flex items-center justify-between w-full">
        {/* Навигация - Left */}
        <nav className="flex items-center gap-8">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`text-lg font-medium transition-colors duration-200 ${
                item.active
                  ? 'text-accent'
                  : 'text-secondary hover:text-foreground'
              }`}
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Фильтры - Right (только на Markets page) */}
        {pathname === '/' && onFilterChange && (
          <div className="flex items-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onFilterChange(category.id)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-colors duration-200 ${
                  activeFilter === category.id
                    ? 'bg-accent text-background'
                    : 'bg-muted text-secondary hover:text-foreground'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
