import React, { useState } from 'react';
import { Clock, MapPin, Users } from 'lucide-react';
import type { Pregame } from '../types';
import { Button } from './Button';
import { Modal } from './Modal';
import { JoinPregameForm, type JoinRequestData } from './JoinPregameForm';

interface PregameCardProps {
  pregame: Pregame;
}

export const PregameCard: React.FC<PregameCardProps> = ({ pregame }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const getStatusBadge = () => {
    if (pregame.status === 'full') {
      return <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">Full</span>;
    }
    if (pregame.status === 'request-only') {
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Request Only</span>;
    }
    return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Open</span>;
  };

  const handleJoinClick = () => {
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data: JoinRequestData) => {
    console.log('Join request submitted:', data);
    // Here you would typically send this to your backend
    setRequestSubmitted(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setRequestSubmitted(false);
    }, 2000);
  };

  const getActionButton = () => {
    if (pregame.status === 'full') {
      return <Button variant="secondary" disabled>Full</Button>;
    }
    if (pregame.status === 'request-only') {
      return <Button variant="outline" onClick={handleJoinClick}>Request to Join</Button>;
    }
    return <Button onClick={handleJoinClick}>Join Pregame</Button>;
  };

  return (
    <div className="bg-white rounded-card shadow-card p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-lg font-semibold text-gray-900">{pregame.title}</h4>
        {getStatusBadge()}
      </div>

      <div className="flex items-center mb-4">
        <div className="text-3xl mr-3">{pregame.host.avatar}</div>
        <div>
          <p className="font-medium text-gray-900">{pregame.host.name}</p>
          <p className="text-sm text-gray-600">{pregame.host.year} • {pregame.host.major}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span className="text-sm">{pregame.time}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">{pregame.location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Users className="w-4 h-4 mr-2" />
          <span className="text-sm">{pregame.currentAttendees} / {pregame.capacity} attending</span>
        </div>
      </div>

      {pregame.description && (
        <p className="text-sm text-gray-600 mb-4">{pregame.description}</p>
      )}

      {pregame.mutualFriends.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Mutual friends going:</p>
          <div className="flex -space-x-2">
            {pregame.mutualFriends.slice(0, 5).map((friend) => (
              <div
                key={friend.id}
                className="text-2xl w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white"
                title={friend.name}
              >
                {friend.avatar}
              </div>
            ))}
            {pregame.mutualFriends.length > 5 && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white text-xs font-medium text-gray-600">
                +{pregame.mutualFriends.length - 5}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        {getActionButton()}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={pregame.status === 'request-only' ? 'Request to Join Pregame' : 'Join Pregame'}
      >
        {requestSubmitted ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {pregame.status === 'request-only' ? 'Request Sent!' : 'You\'re In!'}
            </h3>
            <p className="text-gray-600">
              {pregame.status === 'request-only'
                ? `${pregame.host.name} will review your request and get back to you.`
                : `See you at ${pregame.time}! Check your phone for details.`}
            </p>
          </div>
        ) : (
          <JoinPregameForm
            pregameTitle={pregame.title}
            pregameTime={pregame.time}
            hostName={pregame.host.name}
            isRequestOnly={pregame.status === 'request-only'}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};
