import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold">NarratoFlow</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>
            {user ? (
              <div className="flex items-center space-x-3">
                <span>{user.name}</span>
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full"
                />
                <button 
                  onClick={logout}
                  className="px-3 py-1 rounded bg-red-500 text-white"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button className="px-3 py-1 rounded bg-blue-500 text-white">
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
