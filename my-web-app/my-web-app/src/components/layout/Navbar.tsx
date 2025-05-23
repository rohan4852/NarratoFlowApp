import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';

const Navbar: React.FC = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <nav className={`p-4 shadow-md bg-${theme === 'light' ? 'white' : 'gray-900'} text-${theme === 'light' ? 'gray-900' : 'white'}`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">My Web App</div>
        <div className="space-x-4">
          <Link to="/" className={`hover:underline ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            Home
          </Link>
          <Link to="/profile" className={`hover:underline ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            Profile
          </Link>
          <Link to="/dashboard" className={`hover:underline ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
