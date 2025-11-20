import React, { useState } from 'react';
import { Button } from './Button';
import { MapPin, Clock, Users, Lock, Unlock, MessageSquare } from 'lucide-react';

interface HostPregameFormProps {
  eventTitle: string;
  eventTime: string;
  onSubmit: (data: HostPregameData) => void;
  onCancel: () => void;
}

export interface HostPregameData {
  title: string;
  location: string;
  time: string;
  capacity: number;
  description: string;
  phoneNumber: string;
  accessType: 'open' | 'request-only';
  requirements: string;
}

export const HostPregameForm: React.FC<HostPregameFormProps> = ({
  eventTitle,
  eventTime,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [capacity, setCapacity] = useState(15);
  const [description, setDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accessType, setAccessType] = useState<'open' | 'request-only'>('open');
  const [requirements, setRequirements] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      location,
      time,
      capacity,
      description,
      phoneNumber,
      accessType,
      requirements,
    });
  };

  // Generate suggested start time (1-2 hours before event)
  const getSuggestedTimes = () => {
    const eventHour = parseInt(eventTime.split(':')[0]);
    const eventPeriod = eventTime.includes('PM') ? 'PM' : 'AM';

    let hour1 = eventHour - 2;
    let hour2 = eventHour - 1;
    let period1 = eventPeriod;
    let period2 = eventPeriod;

    if (hour1 <= 0) {
      hour1 += 12;
      period1 = eventPeriod === 'PM' ? 'AM' : 'PM';
    }
    if (hour2 <= 0) {
      hour2 += 12;
      period2 = eventPeriod === 'PM' ? 'AM' : 'PM';
    }

    return [`${hour1}:00 ${period1}`, `${hour2}:00 ${period2}`];
  };

  const suggestedTimes = getSuggestedTimes();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-r from-badger-red/10 to-red-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-1">Pregame for: {eventTitle}</h3>
        <p className="text-sm text-gray-600">Event starts at {eventTime}</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Pregame Title *
        </label>
        <input
          type="text"
          placeholder="e.g., Lakeshore Tailgate, Apartment Pre-Game Party"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-badger-red focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Give your pregame a memorable name
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          <MapPin className="w-4 h-4 inline mr-1" />
          Location *
        </label>
        <input
          type="text"
          placeholder="e.g., 123 Langdon St, Dejope Hall Parking Lot"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-badger-red focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Where will you be hosting? Be specific so people can find you
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          <Clock className="w-4 h-4 inline mr-1" />
          Start Time *
        </label>
        <input
          type="text"
          placeholder="e.g., 5:00 PM"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-badger-red focus:border-transparent"
        />
        <div className="flex gap-2 mt-2">
          <p className="text-xs text-gray-500">Suggested:</p>
          {suggestedTimes.map((suggestedTime) => (
            <button
              key={suggestedTime}
              type="button"
              onClick={() => setTime(suggestedTime)}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-badger-red/10 hover:text-badger-red rounded transition-colors"
            >
              {suggestedTime}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          <Users className="w-4 h-4 inline mr-1" />
          Capacity *
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCapacity(Math.max(5, capacity - 5))}
            className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-badger-red hover:text-badger-red transition-colors font-semibold"
          >
            -
          </button>
          <input
            type="number"
            min="5"
            max="100"
            value={capacity}
            onChange={(e) => setCapacity(Math.max(5, parseInt(e.target.value) || 5))}
            className="w-24 text-center px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-badger-red focus:border-transparent font-semibold text-lg"
          />
          <button
            type="button"
            onClick={() => setCapacity(Math.min(100, capacity + 5))}
            className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-badger-red hover:text-badger-red transition-colors font-semibold"
          >
            +
          </button>
          <span className="text-sm text-gray-600">people max</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          How many people can you host?
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Access Type *
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setAccessType('open')}
            className={`flex items-center gap-2 p-4 rounded-lg border-2 transition-all ${
              accessType === 'open'
                ? 'border-badger-red bg-badger-red/10 text-badger-red'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            <Unlock className="w-5 h-5" />
            <div className="text-left">
              <div className="font-semibold text-sm">Open</div>
              <div className="text-xs opacity-75">Anyone can join</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setAccessType('request-only')}
            className={`flex items-center gap-2 p-4 rounded-lg border-2 transition-all ${
              accessType === 'request-only'
                ? 'border-badger-red bg-badger-red/10 text-badger-red'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            <Lock className="w-5 h-5" />
            <div className="text-left">
              <div className="font-semibold text-sm">Request Only</div>
              <div className="text-xs opacity-75">You approve requests</div>
            </div>
          </button>
        </div>
      </div>

      {accessType === 'request-only' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Join Requirements
          </label>
          <textarea
            placeholder="What should people include in their request? (e.g., mutual friends, year, why they want to join)"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-badger-red focus:border-transparent resize-none"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          <MessageSquare className="w-4 h-4 inline mr-1" />
          Description *
        </label>
        <textarea
          placeholder="What's the vibe? What are you providing? Any special details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-badger-red focus:border-transparent resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          {description.length}/500 characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Your Phone Number *
        </label>
        <input
          type="tel"
          placeholder="(608) 555-1234"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-badger-red focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Attendees will use this to contact you with questions
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-sm text-gray-900 mb-2">📋 Host Tips</h4>
        <ul className="text-xs text-gray-700 space-y-1">
          <li>• Be clear about what you're providing (drinks, food, etc.)</li>
          <li>• Set a realistic capacity for your space</li>
          <li>• Consider starting 1-2 hours before the main event</li>
          <li>• Share any house rules or expectations in the description</li>
        </ul>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={!title || !location || !time || !description || !phoneNumber}
        >
          Create Pregame
        </Button>
      </div>
    </form>
  );
};
