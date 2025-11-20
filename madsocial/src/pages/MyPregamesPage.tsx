import React, { useState } from 'react';
import { Users, Calendar, MapPin, Clock, Check, X, MessageSquare } from 'lucide-react';
import { Button } from '../components/Button';
import type { Pregame } from '../types';
import { mockPregames } from '../data/mockData';

interface JoinRequest {
  id: string;
  userName: string;
  userAvatar: string;
  groupSize: number;
  bringing: string[];
  message: string;
  phoneNumber: string;
  timestamp: string;
}

const mockHostedPregames: Pregame[] = [mockPregames['1'][0], mockPregames['2'][0]];
const mockJoinedPregames: Pregame[] = [mockPregames['1'][1], mockPregames['1'][2]];

const mockJoinRequests: Record<string, JoinRequest[]> = {
  p1: [
    {
      id: 'r1',
      userName: 'Jessica Martinez',
      userAvatar: '👩',
      groupSize: 3,
      bringing: ['beer', 'food'],
      message: 'Hey! Would love to join with a few friends. We have mutual friends with Emma!',
      phoneNumber: '(608) 555-9876',
      timestamp: '2 hours ago',
    },
    {
      id: 'r2',
      userName: 'David Kim',
      userAvatar: '👨',
      groupSize: 2,
      bringing: ['drinks'],
      message: "I'm a junior CS major. Looking forward to the game!",
      phoneNumber: '(608) 555-5432',
      timestamp: '4 hours ago',
    },
  ],
};

export const MyPregamesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hosting' | 'attending'>('hosting');
  const [requests, setRequests] = useState(mockJoinRequests);

  const handleApproveRequest = (pregameId: string, requestId: string) => {
    setRequests((prev) => ({
      ...prev,
      [pregameId]: prev[pregameId].filter((r) => r.id !== requestId),
    }));
    // Here you would send approval to backend
    console.log('Approved request:', requestId);
  };

  const handleDenyRequest = (pregameId: string, requestId: string) => {
    setRequests((prev) => ({
      ...prev,
      [pregameId]: prev[pregameId].filter((r) => r.id !== requestId),
    }));
    // Here you would send denial to backend
    console.log('Denied request:', requestId);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-7 h-7 text-badger-red" />
          <h1 className="text-3xl font-bold text-gray-900">My Pregames</h1>
        </div>
        <p className="text-gray-600">Manage pregames you're hosting or attending</p>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('hosting')}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === 'hosting'
                ? 'text-badger-red'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Hosting
            {activeTab === 'hosting' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-badger-red" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('attending')}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === 'attending'
                ? 'text-badger-red'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Attending
            {activeTab === 'attending' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-badger-red" />
            )}
          </button>
        </div>
      </div>

      {activeTab === 'hosting' ? (
        <div className="space-y-6">
          {mockHostedPregames.length > 0 ? (
            mockHostedPregames.map((pregame) => (
              <div
                key={pregame.id}
                className="bg-white rounded-card shadow-card p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {pregame.title}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {pregame.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {pregame.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {pregame.currentAttendees} / {pregame.capacity} attending
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      pregame.status === 'request-only'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {pregame.status === 'request-only' ? 'Request Only' : 'Open'}
                  </span>
                </div>

                {requests[pregame.id] && requests[pregame.id].length > 0 && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Join Requests ({requests[pregame.id].length})
                    </h4>
                    <div className="space-y-3">
                      {requests[pregame.id].map((request) => (
                        <div
                          key={request.id}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="text-3xl">{request.userAvatar}</div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {request.userName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {request.timestamp}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm mb-3">
                            <p>
                              <span className="font-medium">Group size:</span>{' '}
                              {request.groupSize} {request.groupSize === 1 ? 'person' : 'people'}
                            </p>
                            <p>
                              <span className="font-medium">Bringing:</span>{' '}
                              {request.bringing.join(', ')}
                            </p>
                            <p>
                              <span className="font-medium">Phone:</span> {request.phoneNumber}
                            </p>
                            {request.message && (
                              <div className="bg-white rounded p-3 mt-2">
                                <p className="text-sm text-gray-700">"{request.message}"</p>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleApproveRequest(pregame.id, request.id)}
                              className="flex-1"
                            >
                              <Check className="w-4 h-4 mr-1 inline" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleDenyRequest(pregame.id, request.id)}
                              className="flex-1"
                            >
                              <X className="w-4 h-4 mr-1 inline" />
                              Deny
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!requests[pregame.id] || requests[pregame.id].length === 0) && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600 text-center">
                      No pending join requests
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-card shadow-card">
              <div className="text-6xl mb-4">🎊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                You're not hosting any pregames
              </h3>
              <p className="text-gray-600 mb-4">
                Browse events and create your first pregame!
              </p>
              <Button onClick={() => (window.location.href = '/')}>
                Browse Events
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {mockJoinedPregames.length > 0 ? (
            mockJoinedPregames.map((pregame) => (
              <div
                key={pregame.id}
                className="bg-white rounded-card shadow-card p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {pregame.title}
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{pregame.host.avatar}</div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Hosted by {pregame.host.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {pregame.host.year} • {pregame.host.major}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {pregame.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {pregame.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {pregame.currentAttendees} / {pregame.capacity} attending
                  </div>
                </div>
                {pregame.description && (
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    {pregame.description}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-card shadow-card">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                You haven't joined any pregames yet
              </h3>
              <p className="text-gray-600 mb-4">
                Browse events and join a pregame!
              </p>
              <Button onClick={() => (window.location.href = '/')}>
                Browse Events
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
