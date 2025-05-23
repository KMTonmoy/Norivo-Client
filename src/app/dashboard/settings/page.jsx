'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Setting = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`w-full ${darkMode ? ' bg-gray-900 text-white' : '  text-gray-900'} min-h-screen flex items-center justify-center p-6 transition-colors duration-500`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full p-8">
        <h1 className="text-4xl font-bold mb-4">Settings</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Customize your preferences below to enhance your experience.
        </p>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="mb-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Switch to {darkMode ? 'Light' : 'Dark'} Mode
        </button>

        <button
          onClick={() => toast('Settings saved!')}
          className="mb-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Save Settings
        </button>

        <button
          onClick={() => toast('Settings reset!')}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
};

export default Setting;
