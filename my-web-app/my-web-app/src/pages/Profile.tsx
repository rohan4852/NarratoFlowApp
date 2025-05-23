import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = () => {
    // Implement save logic here, e.g., call API to update user profile
    setMessage('Profile updated successfully!');
  };

  if (!isAuthenticated) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">User Profile</h1>
      {message && <p className="mb-4 text-green-500">{message}</p>}
      <div className="mb-4">
        <label htmlFor="name" className="block mb-1 text-gray-700 dark:text-gray-300">Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
          placeholder="Enter your name"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block mb-1 text-gray-700 dark:text-gray-300">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
          placeholder="Enter your email"
        />
      </div>
      <button
        onClick={handleSave}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Save
      </button>
    </div>
  );
};

export default Profile;
