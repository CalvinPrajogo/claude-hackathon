import React, { useState } from 'react';
import { Button } from './Button';
import { Beer, Pizza, Music, Gift, Plus, X } from 'lucide-react';

interface JoinPregameFormProps {
  pregameTitle: string;
  pregameTime: string;
  hostName: string;
  isRequestOnly: boolean;
  onSubmit: (data: JoinRequestData) => void;
  onCancel: () => void;
}

export interface JoinRequestData {
  bringing: string[];
  customItems: string[];
  groupSize: number;
  message: string;
  phoneNumber: string;
}

const commonItems = [
  { id: 'beer', label: 'Beer', icon: Beer },
  { id: 'food', label: 'Food/Snacks', icon: Pizza },
  { id: 'drinks', label: 'Drinks/Mixers', icon: Gift },
  { id: 'music', label: 'Music/Speaker', icon: Music },
];

export const JoinPregameForm: React.FC<JoinPregameFormProps> = ({
  pregameTitle,
  pregameTime,
  hostName,
  isRequestOnly,
  onSubmit,
  onCancel,
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [customItems, setCustomItems] = useState<string[]>([]);
  const [newCustomItem, setNewCustomItem] = useState('');
  const [groupSize, setGroupSize] = useState(1);
  const [message, setMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const toggleItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const addCustomItem = () => {
    if (newCustomItem.trim()) {
      setCustomItems((prev) => [...prev, newCustomItem.trim()]);
      setNewCustomItem('');
    }
  };

  const removeCustomItem = (index: number) => {
    setCustomItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      bringing: selectedItems,
      customItems,
      groupSize,
      message,
      phoneNumber,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-1">{pregameTitle}</h3>
        <p className="text-sm text-gray-600">
          Hosted by {hostName} • {pregameTime}
        </p>
        {isRequestOnly && (
          <p className="text-sm text-badger-red mt-2 font-medium">
            This is a request-only pregame. The host will review your request.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          What are you bringing? *
        </label>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {commonItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => toggleItem(id)}
              className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                selectedItems.includes(id)
                  ? 'border-badger-red bg-badger-red/10 text-badger-red'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add custom item (e.g., games, decorations)"
              value={newCustomItem}
              onChange={(e) => setNewCustomItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomItem())}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-badger-red focus:border-transparent"
            />
            <button
              type="button"
              onClick={addCustomItem}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {customItems.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {customItems.map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-badger-red/10 text-badger-red rounded-full text-sm font-medium"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeCustomItem(index)}
                    className="hover:bg-badger-red/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          How many people in your group? *
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
            className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-badger-red hover:text-badger-red transition-colors font-semibold"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            max="20"
            value={groupSize}
            onChange={(e) => setGroupSize(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 text-center px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-badger-red focus:border-transparent font-semibold text-lg"
          />
          <button
            type="button"
            onClick={() => setGroupSize(Math.min(20, groupSize + 1))}
            className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-badger-red hover:text-badger-red transition-colors font-semibold"
          >
            +
          </button>
          <span className="text-sm text-gray-600">
            {groupSize === 1 ? 'Just me' : `${groupSize} people`}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Phone Number *
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
          The host will use this to contact you
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Message to host {!isRequestOnly && '(optional)'}
        </label>
        <textarea
          placeholder={
            isRequestOnly
              ? 'Tell the host why you want to join...'
              : 'Any questions or additional info...'
          }
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required={isRequestOnly}
          rows={4}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-badger-red focus:border-transparent resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          {isRequestOnly
            ? 'Required for request-only pregames'
            : `${message.length}/500 characters`}
        </p>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={
            selectedItems.length === 0 && customItems.length === 0 ||
            !phoneNumber ||
            (isRequestOnly && !message)
          }
        >
          {isRequestOnly ? 'Send Request' : 'Join Pregame'}
        </Button>
      </div>
    </form>
  );
};
