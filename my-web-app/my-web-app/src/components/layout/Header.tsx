import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <h1 className="text-2xl font-bold">My Web App</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:underline">Home</Link>
          </li>
          <li>
            <Link to="/profile" className="hover:underline">Profile</Link>
          </li>
          <li>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;