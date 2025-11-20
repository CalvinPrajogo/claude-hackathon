import React from 'react';
import { Clock, MapPin, Users } from 'lucide-react';
import type { SocialEvent } from '../types';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';

interface EventCardProps {
  event: SocialEvent;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-card shadow-card p-6 hover:shadow-lg transition-shadow cursor-pointer">
      <div onClick={() => navigate(`/event/${event.id}`)}>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{event.title}</h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">{event.time}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{event.location}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center px-3 py-1 bg-badger-red/10 text-badger-red rounded-full text-sm font-medium">
            <Users className="w-4 h-4 mr-1" />
            {event.pregameCount} Pregames
          </div>
          {event.friendsGoing > 0 && (
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-1" />
              {event.friendsGoing} friends going
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => navigate(`/event/${event.id}`)}>View Event</Button>
      </div>
    </div>
  );
};
