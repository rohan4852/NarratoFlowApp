import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-200 p-4">
      <h2 className="text-xl font-bold mb-4">Navigation</h2>
      <ul className="space-y-2">
        <li>
          <a href="/dashboard" className="text-blue-600 hover:underline">Dashboard</a>
        </li>
        <li>
          <a href="/profile" className="text-blue-600 hover:underline">Profile</a>
        </li>
        <li>
          <a href="/settings" className="text-blue-600 hover:underline">Settings</a>
        </li>
        <li>
          <a href="/help" className="text-blue-600 hover:underline">Help</a>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;