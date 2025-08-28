'use client';

interface MarketFiltersProps {
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

export default function MarketFilters({ activeFilter, onFilterChange }: MarketFiltersProps) {
  return (
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
  );
}
