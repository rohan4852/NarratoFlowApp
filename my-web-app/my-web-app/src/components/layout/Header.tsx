import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../common/ThemeToggle';

const Header: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className={`bg-${theme === 'light' ? 'white' : 'gray-900'} text-${theme === 'light' ? 'gray-900' : 'white'} p-4 shadow-md flex justify-between items-center`}>
      <div className="text-2xl font-bold">
        <Link to="/">My Web App</Link>
      </div>
      <nav className="flex items-center space-x-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="hover:underline">
              {user?.name || 'Profile'}
            </Link>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/signup" className="hover:underline">
              Signup
            </Link>
          </>
        )}
        <ThemeToggle />
      </nav>
    </header>
  );
};

export default Header;
