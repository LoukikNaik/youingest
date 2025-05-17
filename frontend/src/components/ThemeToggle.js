import React from 'react';

function ThemeToggle({ theme, toggleTheme }) {
  return (
    <div className="fixed top-4 right-4 flex items-center gap-3 z-50">
      <a
        href="https://github.com/LoukikNaik/youingest"
        target="_blank"
        rel="noopener noreferrer"
        className={`p-3 rounded-full transition-all duration-200
          ${theme === 'dark' 
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-100' 
            : 'bg-white hover:bg-gray-100 text-gray-700 shadow-lg'}`}
        aria-label="View on GitHub"
      >
        <i className="fab fa-github text-xl"></i>
      </a>
      <button
        onClick={toggleTheme}
        className={`p-3 rounded-full transition-all duration-200
          ${theme === 'dark' 
            ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
            : 'bg-white hover:bg-gray-100 text-gray-700 shadow-lg'}`}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <i className="fas fa-sun text-xl"></i>
        ) : (
          <i className="fas fa-moon text-xl"></i>
        )}
      </button>
    </div>
  );
}

export default ThemeToggle; 