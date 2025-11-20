import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Home, Users, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Today', icon: Home },
    { path: '/upcoming', label: 'Upcoming', icon: Calendar },
    { path: '/my-pregames', label: 'My Pregames', icon: Users },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <img src="/bucky-logo.png" alt="Bucky Badger" className="w-10 h-10" />
            <h1 className="text-2xl font-bold text-badger-red">MadSocial</h1>
          </Link>

          <div className="flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    isActive
                      ? 'text-badger-red bg-badger-red/10'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-badger-red text-white flex items-center justify-center font-semibold cursor-pointer hover:bg-red-700 transition-colors">
              JD
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
