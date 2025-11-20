import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, MapPin, ArrowLeft } from 'lucide-react';
import { PregameCard } from '../components/PregameCard';
import { Button } from '../components/Button';
import { mockEvents, mockPregames, mockMutualFriends } from '../data/mockData';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const event = mockEvents.find((e) => e.id === id);
  const pregames = mockPregames[id || ''] || [];

  if (!event) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Event not found</h2>
        <Button onClick={() => navigate('/')}>Back to Today</Button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Today
      </button>

      <div className="bg-gradient-to-r from-badger-red/10 to-red-50 rounded-card p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
        <div className="flex flex-wrap gap-6 mb-4">
          <div className="flex items-center text-gray-700">
            <Clock className="w-5 h-5 mr-2" />
            <span className="font-medium">{event.time}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <MapPin className="w-5 h-5 mr-2" />
            <span className="font-medium">{event.location}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="px-4 py-1.5 bg-white text-gray-700 text-sm font-medium rounded-full shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Pregames for This Event</h2>
            <Button>Host a Pregame</Button>
          </div>

          {pregames.length > 0 ? (
            <div className="space-y-6">
              {pregames.map((pregame) => (
                <PregameCard key={pregame.id} pregame={pregame} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-card shadow-card">
              <div className="text-5xl mb-4">🎊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No pregames yet
              </h3>
              <p className="text-gray-600 mb-4">
                Be the first to host a pregame for this event!
              </p>
              <Button>Host a Pregame</Button>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-card shadow-card p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Mutual Friends Going
            </h3>
            {mockMutualFriends.length > 0 ? (
              <div className="space-y-3">
                {mockMutualFriends.slice(0, 6).map((friend) => (
                  <div key={friend.id} className="flex items-center">
                    <div className="text-2xl w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      {friend.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{friend.name}</p>
                      <p className="text-xs text-gray-500">
                        {friend.mutualCount} mutual friends
                      </p>
                    </div>
                  </div>
                ))}
                {mockMutualFriends.length > 6 && (
                  <button className="text-sm text-badger-red font-medium hover:underline">
                    View all {mockMutualFriends.length} friends
                  </button>
                )}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">
                No mutual friends going yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
