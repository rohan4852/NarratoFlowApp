import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();
  const [showContent, setShowContent] = useState(null);

  const contentMap = {
    'Privacy Policy': (
      <div>
        <h2 className="text-xl font-bold mb-2">Privacy Policy</h2>
        <p>
          This is a sample privacy policy. We respect your privacy and are committed to protecting your personal information.
        </p>
      </div>
    ),
    'Terms of Service': (
      <div>
        <h2 className="text-xl font-bold mb-2">Terms of Service</h2>
        <p>
          These are the sample terms of service. By using this service, you agree to the terms and conditions outlined here.
        </p>
      </div>
    ),
    'Contact': (
      <div>
        <h2 className="text-xl font-bold mb-2">Contact</h2>
        <p>
          For support or inquiries, please contact us at support@narratoflow.com or call +1-234-567-890.
        </p>
      </div>
    ),
    'About': (
      <div>
        <h2 className="text-xl font-bold mb-2">About</h2>
        <p>
          NarratoFlow is an AI-powered story dashboard designed to help you generate insightful stories from your data.
        </p>
      </div>
    )
  };

  return (
    <footer className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'
      } shadow-lg mt-auto`}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <p>© 2025 NarratoFlow. All rights reserved.</p>
          <div className="flex space-x-4">
            {Object.keys(contentMap).map((key) => (
              <button
                key={key}
                onClick={() => setShowContent(showContent === key ? null : key)}
                className="hover:text-blue-500"
              >
                {key}
              </button>
            ))}
          </div>
        </div>
        {showContent && (
          <div className="mt-4 p-4 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white max-w-7xl mx-auto">
            {contentMap[showContent]}
          </div>
        )}
      </div>
    </footer>
  );
}
