import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { EventCard } from '../components/EventCard';
import { FilterBar } from '../components/FilterBar';
import { mockEvents } from '../data/mockData';

export const UpcomingPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(0); // 0 = today, 1 = tomorrow, etc.

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const formatDate = (date: Date, format: 'long' | 'short') => {
    if (format === 'long') {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDateLabel = (index: number) => {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    return formatDate(dates[index], 'short');
  };

  // Get the selected date in YYYY-MM-DD format for filtering
  const selectedDateString = dates[selectedDate].toISOString().split('T')[0];

  const filteredEvents = mockEvents.filter((event) => {
    const matchesDate = event.date === selectedDateString;
    const matchesCategory =
      selectedCategory === 'All' ||
      event.category === selectedCategory.replace('/', '/') ||
      (selectedCategory === 'Bars/Clubs' && event.category === 'Bar/Club');
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDate && matchesCategory && matchesSearch;
  });

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-7 h-7 text-badger-red" />
          <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
        </div>
        <p className="text-gray-600">Browse events for the next 7 days</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setSelectedDate(Math.max(0, selectedDate - 1))}
            disabled={selectedDate === 0}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-2">
              {dates.map((date, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDate(index)}
                  className={`flex-shrink-0 px-4 py-3 rounded-lg border-2 transition-all ${
                    selectedDate === index
                      ? 'border-badger-red bg-badger-red text-white'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="text-sm font-semibold">{getDateLabel(index)}</div>
                  <div className="text-xs opacity-75">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setSelectedDate(Math.min(6, selectedDate + 1))}
            disabled={selectedDate === 6}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Events on {formatDate(dates[selectedDate], 'long')}
        </h2>
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
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">
            {searchQuery
              ? 'Try adjusting your search or filters'
              : `No social events listed for ${getDateLabel(selectedDate).toLowerCase()} yet. Check back later!`}
          </p>
        </div>
      )}
    </div>
  );
};
