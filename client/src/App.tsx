import React, { useState } from 'react';
import { Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SplashScreen from './components/SplashScreen';
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

function App() {
  const [showSplash, setShowSplash] = useState(true);

  // Mock current user - in real app, get from auth context
  const currentUser = {
    id: '1',
    username: 'sarah_chen',
    displayName: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/search" component={SearchPage} />
          <Route path="/chat" component={ChatPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/more" component={MorePage} />
          <Route path="/admin" component={AdminPage} />
          <Route>
            <div className="flex items-center justify-center h-screen">
              <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
            </div>
          </Route>
        </Switch>
        
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