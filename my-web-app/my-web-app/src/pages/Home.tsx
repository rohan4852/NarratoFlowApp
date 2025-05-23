import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <Navbar />
      <main className="main-content">
        <h1>Welcome to the NarratoFlow App</h1>
        {user ? (
          <p>Hello, {user.name}! Explore your dashboard.</p>
        ) : (
          <p>Please log in or sign up to continue.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Home;