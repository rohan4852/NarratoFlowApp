import { useTheme } from '../../contexts/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();
  
  return (
    <footer className={`${
      theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'
    } shadow-lg mt-auto`}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <p>© 2025 NarratoFlow. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-500">Privacy Policy</a>
            <a href="#" className="hover:text-blue-500">Terms of Service</a>
            <a href="#" className="hover:text-blue-500">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
