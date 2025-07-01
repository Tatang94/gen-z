import React, { useState } from 'react';
import { Route, Switch } from 'wouter';
import SplashScreen from './components/SplashScreen';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <Switch>
      <Route path="/admin" component={AdminPage} />
      <Route path="/" component={HomePage} />
    </Switch>
  );
}

export default App;