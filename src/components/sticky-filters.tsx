'use client';

interface StickyFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
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

export default function StickyFilters({ activeFilter, onFilterChange }: StickyFiltersProps) {
  return (
    <div className="sticky top-16 z-40 bg-background border-b border-border py-4 shadow-sm">
      <div className="main-content">
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
    </div>
  );
}
