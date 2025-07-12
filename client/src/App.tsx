import React, { useState } from 'react';
import { Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SplashScreen from './components/SplashScreen';
import AuthPage from './components/AuthPage';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import SearchPage from './pages/SearchPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import MorePage from './pages/MorePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

interface User {
  id: number;
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  bio?: string;
  followers: number;
  following: number;
  postsCount: number;
  isVerified: boolean;
  joinDate: string;
  isOnline: boolean;
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (!currentUser) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app min-h-screen bg-gray-50 dark:bg-gray-900">
        <main className="pb-16">
          <Switch>
            <Route path="/" component={() => <HomePage currentUser={currentUser} />} />
            <Route path="/search" component={SearchPage} />
            <Route path="/chat" component={() => <ChatPage currentUser={currentUser} />} />
            <Route path="/profile" component={() => <ProfilePage currentUser={currentUser} />} />
            <Route path="/more" component={() => <MorePage currentUser={currentUser} onLogout={handleLogout} />} />
            <Route path="/admin" component={AdminPage} />
            <Route>
              <div className="flex items-center justify-center h-screen">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">404 - Halaman Tidak Ditemukan</h1>
              </div>
            </Route>
          </Switch>
        </main>
        
        {/* Bottom Navigation - hide on admin page */}
        <Route path="/admin">
          {() => null}
        </Route>
        <Route>
          {() => <Navigation currentUser={currentUser} />}
        </Route>
      </div>
    </QueryClientProvider>
  );
}

export default App;