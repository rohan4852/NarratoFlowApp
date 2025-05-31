import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import NarratoFlow from './components/NarratoFlow';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

function AppContent() {
  const { user, logout } = useAuth();
  const [selectedSidebar, setSelectedSidebar] = useState('Dashboard');
  const [showSignup, setShowSignup] = useState(false);

  if (!user) {
    return showSignup ? (
      <Signup onSwitchToLogin={() => setShowSignup(false)} />
    ) : (
      <Login onSwitchToSignup={() => setShowSignup(true)} />
    );
  }

  const renderContent = () => {
    switch (selectedSidebar) {
      case 'Dashboard':
        return <NarratoFlow />;
      case 'Story Generation':
        return <div>Story Generation Content</div>;
      case 'Analytics':
        return <div>Analytics Content</div>;
      case 'Settings':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <div>
              <label className="block mb-2 font-semibold">Notification Preferences</label>
              <select className="border p-2 rounded w-full max-w-xs">
                <option>Email</option>
                <option>SMS</option>
                <option>Push Notifications</option>
              </select>
            </div>
            <div className="mt-4">
              <label className="block mb-2 font-semibold">Theme</label>
              <select className="border p-2 rounded w-full max-w-xs">
                <option>Light</option>
                <option>Dark</option>
              </select>
            </div>
          </div>
        );
      case 'Help':
        return <div>Help Content</div>;
      case 'Privacy Policy':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
            <p>
              This is a sample privacy policy. We respect your privacy and are committed to protecting your personal information.
            </p>
          </div>
        );
      case 'About':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <p>
              NarratoFlow is an AI-powered story dashboard designed to help you generate insightful stories from your data.
            </p>
          </div>
        );
      case 'Contact':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Contact</h2>
            <p>
              For support or inquiries, please contact us at support@narratoflow.com or call +1-234-567-890.
            </p>
          </div>
        );
      default:
        return <div>Select an option from the sidebar.</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} onLogout={logout} />
      <div className="flex flex-1">
        <Sidebar selected={selectedSidebar} onSelect={setSelectedSidebar} />
        <main className="flex-1 p-4 overflow-auto">
          {renderContent()}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
