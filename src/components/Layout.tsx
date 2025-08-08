import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trophy } from 'lucide-react';
import { logout } from '../utils/auth';

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      
      {/* Flying Orbs */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '3s' }}></div>
      <div className="absolute bottom-32 left-32 w-64 h-64 bg-gradient-to-r from-emerald-400/25 to-teal-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-orange-400/30 to-red-500/30 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-56 h-56 bg-gradient-to-r from-violet-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-1/3 right-1/3 w-44 h-44 bg-gradient-to-r from-yellow-400/25 to-amber-500/25 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '5s' }}></div>
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Discovery Contest Raffle</h1>
                <p className="text-white/70 text-sm">{title}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-200 hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-auto border-t border-white/10 bg-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-white/70 text-sm">
            Imagined, Designed and Developed by{' '}
            <span className="font-semibold text-white">Abhishekh Dey</span>
          </p>
        </div>
      </footer>
    </div>
  );
}