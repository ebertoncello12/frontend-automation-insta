import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { Users, LogOut, Settings } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <nav className="bg-white shadow-lg border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center space-x-3">
                <Users className="h-8 w-8 text-indigo-600" />
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 text-transparent bg-clip-text">Close Friends</span>
                  <span className="text-xl font-light text-gray-600"> Manager</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-indigo-600 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-4 border-l border-gray-200 pl-4">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                  <span className="text-xs text-gray-500">{user?.email}</span>
                </div>
                <img
                  className="h-9 w-9 rounded-full ring-2 ring-indigo-100"
                  src={user?.avatar}
                  alt={user?.name}
                />
                <button
                  onClick={logout}
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};