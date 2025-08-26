'use client';

import { useState } from 'react';

const categories = [
  { id: 'all', name: 'All Markets', icon: '📊' },
  { id: 'politics', name: 'Politics', icon: '🏛️' },
  { id: 'crypto', name: 'Crypto', icon: '₿' },
  { id: 'economics', name: 'Economics', icon: '📈' },
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'culture', name: 'Culture', icon: '🎭' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'games', name: 'Games', icon: '🎮' }
];

export default function CategoriesSection() {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <section className="py-12 border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Browse by Category</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore prediction markets across different categories. Find markets that match your interests and expertise.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`category-pill flex items-center space-x-2 transition-all duration-200 ${
                activeCategory === category.id ? 'active' : ''
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Quick Stats for Active Category */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              <span>
                {activeCategory === 'all' ? '1,247' : '156'} Active Markets
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-secondary rounded-full"></span>
              <span>
                {activeCategory === 'all' ? '$12.4M' : '$1.8M'} Total Volume
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              <span>
                {activeCategory === 'all' ? '45.2K' : '8.9K'} Participants
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
