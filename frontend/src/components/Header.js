import React from 'react';

function Header({ theme }) {
  return (
    <header className={`bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 text-white shadow-xl ${theme === 'dark' ? 'dark:from-gray-900 dark:via-gray-800 dark:to-gray-900' : ''}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight flex items-center justify-center mb-4 sm:mb-6">
            <i className="fas fa-closed-captioning mr-2 sm:mr-4 text-sky-300"></i>
            <span className="airbnb-gradient-text">YouIngest</span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl font-medium tracking-wide text-sky-100 mb-8 sm:mb-12">
            Transform YouTube videos into LLM-friendly transcripts
          </p>
          <div className={`bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg border border-white/20 ${theme === 'dark' ? 'dark:bg-gray-800/50 dark:border-gray-700/50' : ''}`}>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 flex items-center justify-center text-sky-100">
              <i className="fas fa-magic mr-2 sm:mr-3 text-sky-300"></i>
              How It Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 text-left">
              <div className="flex items-start space-x-3 group">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <i className="fas fa-link text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-sky-300 transition-colors duration-200">1. Paste URL</h3>
                  <p className="text-sky-100 text-sm mt-1">Enter any YouTube video URL with captions</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <i className="fas fa-file-alt text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-sky-300 transition-colors duration-200">2. Get Transcript</h3>
                  <p className="text-sky-100 text-sm mt-1">We extract both timestamped and plain text versions</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <i className="fas fa-robot text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-sky-300 transition-colors duration-200">3. Use with LLM</h3>
                  <p className="text-sky-100 text-sm mt-1">Perfect for AI analysis and content processing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header; 