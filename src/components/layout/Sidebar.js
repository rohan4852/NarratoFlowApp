import { useTheme } from '../../contexts/ThemeContext';

export default function Sidebar() {
  const { theme } = useTheme();
    const menuItems = [
    { icon: '📊', label: 'Dashboard', active: true },
    { icon: '📈', label: 'Story Generation' },
    { icon: '📋', label: 'Analytics' },
    { icon: '⚙️', label: 'Settings' },
    { icon: '❓', label: 'Help' }
  ];

  return (
    <aside className={`w-64 ${
      theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'
    } shadow-lg`}>
      <div className="p-4">
        <div className="space-y-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center space-x-2 p-2 rounded-lg
                ${item.active ? 
                  'bg-blue-500 text-white' : 
                  'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
