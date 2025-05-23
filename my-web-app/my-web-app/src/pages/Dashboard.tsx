import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();

  return (
    <div className={`dashboard ${theme}`}>
      <h1>Welcome to your Dashboard, {user?.name}!</h1>
      <p>Here you can find an overview of your data and access AI features.</p>
      {/* Additional AI features and user data overview can be added here */}
    </div>
  );
};

export default Dashboard;