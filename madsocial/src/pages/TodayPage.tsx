import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { EventCard } from '../components/EventCard';
import { FilterBar } from '../components/FilterBar';
import { mockEvents } from '../data/mockData';

export const TodayPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const filteredEvents = mockEvents.filter((event) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      event.category === selectedCategory.replace('/', '/') ||
      (selectedCategory === 'Bars/Clubs' && event.category === 'Bar/Club');
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-7 h-7 text-badger-red" />
          <h1 className="text-3xl font-bold text-gray-900">Today</h1>
        </div>
        <p className="text-gray-600">{formattedDate}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Today's Events</h2>
        <FilterBar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">
            {searchQuery
              ? 'Try adjusting your search or filters'
              : 'No social events listed for today yet. Check back later or explore upcoming days.'}
          </p>
        </div>
      )}
    </div>
  );
};
