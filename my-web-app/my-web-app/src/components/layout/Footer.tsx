import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <footer className={`bg-${theme === 'light' ? 'gray-100' : 'gray-800'} text-${theme === 'light' ? 'gray-700' : 'gray-300'} py-4 mt-auto`}>
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} My Web App. All rights reserved.</p>
        <div>
          <a href="/privacy" className="hover:underline mx-2">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:underline mx-2">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
