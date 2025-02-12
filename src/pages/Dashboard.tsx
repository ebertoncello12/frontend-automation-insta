import React, { useState, useCallback, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { ProgressUpdate } from '../types/progress';
import { Users, Play, AlertCircle, CheckCircle, RefreshCw, TrendingUp, UserCheck, Image, BadgeCheck, Lock, ChevronUp } from 'lucide-react';
import clsx from 'clsx';

export const Dashboard: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [progress, setProgress] = useState<ProgressUpdate | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  
  console.log(analytics)

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/instagram/followers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'fiestinha_69',
          password: 'Mm77243264',
          targetProfile: 'fiestinha_69',
        }),
      });
      
      if (!response.ok) throw new Error('Failed to fetch analytics');
      
      
      const data = await response.json();
      setAnalytics(data); // Se o POST for bem-sucedido, armazene os dados na variável analytics
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoadingAnalytics(false); // Atualize o estado de carregamento
    }
  };
  

  const setupSocket = useCallback(() => {
    const newSocket = io('http://localhost:3000');

    newSocket.on('connect', () => {
      console.log('Connected to socket');
    });

    newSocket.on('progress:update', (update: ProgressUpdate) => {
      console.log(update)
      setProgress(update);
      if (update.status === 'completed' || update.status === 'error') {
        setIsProcessing(false);
        newSocket.disconnect();
        setSocket(null);
      }
    });

    setSocket(newSocket);
    return newSocket;
  }, []);

  const startProcess = async () => {
    try {
      setIsProcessing(true);
      const newSocket = setupSocket();
      
      const response = await fetch('http://localhost:3000/api/instagram/close-friends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'fiestinha_69',
          password: 'Mm77243264',
          target_profile: 'fiestinha_69',
          followers: analytics.followers
        }),
      });
      
      if (!response.ok) {
        newSocket.disconnect();
        setSocket(null);
        throw new Error('Failed to start process');
      }
    } catch (error) {
      console.error('Error starting process:', error);
      setIsProcessing(false);
      setProgress(null);
    }
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(num);
  };

  return (
    <div className="space-y-6">
      {/* Analytics Section */}
      {isLoadingAnalytics ? (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-50">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-indigo-100 h-12 w-12"></div>
            <div className="flex-1 space-y-4">
              <div className="h-4 bg-indigo-100 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-indigo-100 rounded w-5/6"></div>
                <div className="h-4 bg-indigo-100 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      ) : analytics && (
        <div className="bg-white rounded-xl shadow-lg border border-indigo-50">
          <div className="p-6">
            <div className="flex items-start space-x-6">
              <img
                src={analytics.profile?.profilePicUrl}
                alt={analytics.profile?.username}
                className="w-20 h-20 rounded-xl object-cover ring-2 ring-indigo-100"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-bold text-gray-900">
                    {analytics.profile?.fullName}
                  </h2>
                  <span className="text-gray-500">@{analytics?.profile?.username}</span>
                  {analytics.profile?.isVerified && (
                    <BadgeCheck className="h-5 w-5 text-blue-500" />
                  )}
                  {analytics.profile?.isPrivate && (
                    <Lock className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <p className="mt-1 text-gray-600">{analytics?.profile?.biography}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-b-xl border-t border-indigo-100">
            {/* Statistics */}
            <div className="bg-white p-4 rounded-lg border border-indigo-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-sm font-medium text-gray-700">Account Stats</h3>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.statistics?.followers)}</p>
                  <p className="text-sm text-gray-500">Followers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.statistics?.following)}</p>
                  <p className="text-sm text-gray-500">Following</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.statistics?.posts)}</p>
                  <p className="text-sm text-gray-500">Posts</p>
                </div>
              </div>
            </div>

            {/* Growth */}
            <div className="bg-white p-4 rounded-lg border border-indigo-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <h3 className="text-sm font-medium text-gray-700">Follower Growth</h3>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Daily</span>
                  <div className="flex items-center text-green-600">
                    <ChevronUp className="h-4 w-4" />
                    <span className="text-sm font-medium">+{analytics.followerGrowth?.daily}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Weekly</span>
                  <div className="flex items-center text-green-600">
                    <ChevronUp className="h-4 w-4" />
                    <span className="text-sm font-medium">+{analytics.followerGrowth?.weekly}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Monthly</span>
                  <div className="flex items-center text-green-600">
                    <ChevronUp className="h-4 w-4" />
                    <span className="text-sm font-medium">+{analytics.followerGrowth?.monthly}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Process Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-50">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Close Friends Manager</h1>
            <p className="mt-1 text-gray-500">Automatically manage your close friends list</p>
          </div>
          <button
            onClick={startProcess}
            disabled={isProcessing}
            className={clsx(
              "inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white transition-all duration-200",
              isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            )}
          >
            {isProcessing ? (
              <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <Play className="h-5 w-5 mr-2" />
            )}
            {isProcessing ? 'Processing...' : 'Start Process'}
          </button>
        </div>

        {progress && (
          <div className="mt-6">
            <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl p-6 border border-indigo-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-indigo-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Progress Status</h3>
                </div>
                {progress.status === 'completed' && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-6 w-6 mr-2" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                )}
                {progress.status === 'error' && (
                  <div className="flex items-center text-red-600">
                    <AlertCircle className="h-6 w-6 mr-2" />
                    <span className="text-sm font-medium">Error</span>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Processing users...
                  </span>
                  <span className="text-sm font-medium text-indigo-600">
                    {progress.processedItems} / {progress.totalItems}
                  </span>
                </div>
                <div className="relative">
                  <div className="overflow-hidden h-3 text-xs flex rounded-full bg-indigo-100">
                    <div
                      style={{
                        width: `${(progress.processedItems / progress.totalItems) * 100}%`,
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-600 to-blue-600 transition-all duration-500 ease-in-out"
                    />
                  </div>
                </div>
              </div>

              {progress.currentItem && (
                <div className="mt-4 p-3 bg-white rounded-lg border border-indigo-100">
                  <span className="text-sm text-gray-500">Currently processing:</span>
                  <span className="ml-2 text-sm font-medium text-indigo-600">{progress.currentItem}</span>
                </div>
              )}

              {progress.error && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-sm text-red-700">
                      Error: {progress.error}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};