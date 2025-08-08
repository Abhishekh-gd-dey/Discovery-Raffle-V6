import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Trophy, BarChart3 } from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/raffle', label: 'Raffle', icon: Users },
  { path: '/winners', label: 'Winners', icon: Trophy },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="mb-8">
      <div className="flex flex-wrap gap-2">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg backdrop-blur-md border transition-all duration-200 hover:scale-105
              ${location.pathname === path
                ? 'bg-white/20 border-white/30 text-white shadow-lg'
                : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/15 hover:text-white'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            <span className="font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}