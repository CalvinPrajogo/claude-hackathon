import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, GraduationCap, Calendar, Bell, Lock, LogOut } from 'lucide-react';
import { Button } from '../components/Button';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  year: string;
  major: string;
  location: string;
  bio: string;
  joinedDate: string;
}

const mockUserProfile: UserProfile = {
  name: 'John Doe',
  email: 'john.doe@wisc.edu',
  phone: '(608) 555-1234',
  year: 'Junior',
  major: 'Computer Science',
  location: 'Lakeshore',
  bio: 'Love going to Badger games and meeting new people! Always down for a good pregame.',
  joinedDate: 'September 2024',
};

export const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockUserProfile);
  const [editedProfile, setEditedProfile] = useState(mockUserProfile);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    console.log('Profile updated:', editedProfile);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <User className="w-7 h-7 text-badger-red" />
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        </div>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <div className="bg-white rounded-card shadow-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Personal Information
              </h2>
              {!isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-badger-red focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700">{profile.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-badger-red focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700">{profile.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-badger-red focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700">{profile.phone}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <GraduationCap className="w-4 h-4 inline mr-2" />
                    Year
                  </label>
                  {isEditing ? (
                    <select
                      value={editedProfile.year}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, year: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-badger-red focus:border-transparent"
                    >
                      <option>Freshman</option>
                      <option>Sophomore</option>
                      <option>Junior</option>
                      <option>Senior</option>
                      <option>Graduate</option>
                    </select>
                  ) : (
                    <p className="text-gray-700">{profile.year}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.location}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, location: e.target.value })
                      }
                      placeholder="e.g., Lakeshore, Southeast"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-badger-red focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-700">{profile.location}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Major
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.major}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, major: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-badger-red focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700">{profile.major}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={editedProfile.bio}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, bio: e.target.value })
                    }
                    rows={4}
                    placeholder="Tell people a bit about yourself..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-badger-red focus:border-transparent resize-none"
                  />
                ) : (
                  <p className="text-gray-700">{profile.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-card shadow-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Settings</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Notifications</p>
                    <p className="text-sm text-gray-600">
                      Get notified about join requests and updates
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-badger-red/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-badger-red"></div>
                </label>
              </div>

              <button className="flex items-center gap-3 py-3 text-gray-700 hover:text-gray-900 transition-colors w-full">
                <Lock className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-medium">Change Password</p>
                  <p className="text-sm text-gray-600">Update your password</p>
                </div>
              </button>

              <button className="flex items-center gap-3 py-3 text-badger-red hover:text-red-700 transition-colors w-full border-t border-gray-200 pt-4">
                <LogOut className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-medium">Log Out</p>
                  <p className="text-sm opacity-75">Sign out of your account</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-card shadow-card p-6 sticky top-24">
            <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-badger-red text-white flex items-center justify-center font-bold text-3xl mx-auto mb-4">
                {profile.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">{profile.name}</h3>
              <p className="text-sm text-gray-600">
                {profile.year} • {profile.major}
              </p>
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Joined {profile.joinedDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{profile.location}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Activity Stats</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pregames Hosted</span>
                  <span className="font-semibold text-gray-900">2</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pregames Attended</span>
                  <span className="font-semibold text-gray-900">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Events Joined</span>
                  <span className="font-semibold text-gray-900">15</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
