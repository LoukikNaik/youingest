import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Add theme context
const ThemeContext = React.createContext();

function ThemeToggle() {
  const { theme, toggleTheme } = React.useContext(ThemeContext);
  
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

function Header() {
  const { theme } = React.useContext(ThemeContext);
  
  return (
    <header className={`bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 text-white shadow-xl ${theme === 'dark' ? 'dark:from-gray-900 dark:via-gray-800 dark:to-gray-900' : ''}`}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-16">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-7xl font-bold tracking-tight flex items-center justify-center mb-6">
            <i className="fas fa-closed-captioning mr-4 text-sky-300"></i>
            <span className="airbnb-gradient-text">YouIngest</span>
          </h1>
          <p className="text-2xl font-medium tracking-wide text-sky-100 mb-12">
            Transform YouTube videos into LLM-friendly transcripts
          </p>
          <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-10 shadow-lg border border-white/20 ${theme === 'dark' ? 'dark:bg-gray-800/50 dark:border-gray-700/50' : ''}`}>
            <h2 className="text-3xl font-semibold mb-8 flex items-center justify-center text-sky-100">
              <i className="fas fa-magic mr-3 text-sky-300"></i>
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
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

function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-400">© 2024 YouIngest. All rights reserved.</p>
      </div>
    </footer>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
    >
      {copied ? (
        <>
          <i className="fas fa-check mr-2 text-green-500"></i>
          Copied!
        </>
      ) : (
        <>
          <i className="fas fa-copy mr-2 text-primary-600"></i>
          Copy
        </>
      )}
    </button>
  );
}

function DownloadButton({ transcriptData, type }) {
  const handleDownload = () => {
    const content = type === 'timestamped' ? transcriptData.transcript : transcriptData.plain_transcript;
    const filename = `${transcriptData.video_title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${type}.txt`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
    >
      <i className="fas fa-download mr-2 text-primary-600"></i>
      Download {type === 'timestamped' ? 'Timestamped' : 'Plain Text'}
    </button>
  );
}

function TranscriptDisplay({ transcriptData }) {
  const { theme } = React.useContext(ThemeContext);
  const [showTimestamped, setShowTimestamped] = useState(true);
  const transcriptRef = React.useRef(null);

  // Scroll to transcript smoothly when it changes
  React.useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [transcriptData]);

  if (!transcriptData) return null;

  const currentTranscript = showTimestamped ? transcriptData.transcript : transcriptData.plain_transcript;

  return (
    <div 
      ref={transcriptRef}
      className={`mt-12 rounded-2xl shadow-xl p-10 border transition-all duration-300 ease-in-out
        ${theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-100'}`}
    >
      <div className="mb-10">
        <h2 className="text-3xl font-bold mb-2 flex items-center group">
          <i className={`fas fa-video mr-4 flex-shrink-0 ${theme === 'dark' ? 'text-primary-400' : 'text-primary-600'}`}></i>
          <span className={`truncate ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
            {transcriptData.video_title}
          </span>
        </h2>
        <div className="h-1 w-20 bg-primary-500 rounded-full mt-2"></div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
          <div className={`flex items-center rounded-full p-1 shadow-inner w-full sm:w-auto
            ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <button
              onClick={() => setShowTimestamped(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium flex items-center flex-1 sm:flex-none justify-center
                ${showTimestamped
                  ? theme === 'dark'
                    ? 'bg-gray-600 text-primary-300 shadow-sm'
                    : 'bg-white text-primary-600 shadow-sm'
                  : theme === 'dark'
                    ? 'text-gray-300'
                    : 'text-gray-600'}`}
            >
              <i className="fas fa-clock mr-2"></i>
              Timestamped
            </button>
            <button
              onClick={() => setShowTimestamped(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium flex items-center flex-1 sm:flex-none justify-center
                ${!showTimestamped
                  ? theme === 'dark'
                    ? 'bg-gray-600 text-primary-300 shadow-sm'
                    : 'bg-white text-primary-600 shadow-sm'
                  : theme === 'dark'
                    ? 'text-gray-300'
                    : 'text-gray-600'}`}
            >
              <i className="fas fa-align-left mr-2"></i>
              Plain Text
            </button>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <CopyButton text={currentTranscript} />
            <DownloadButton transcriptData={transcriptData} type={showTimestamped ? 'timestamped' : 'plain'} />
          </div>
        </div>
      </div>

      <div className="relative group">
        <div className={`absolute top-0 left-0 right-0 h-16 bg-gradient-to-b z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200
          ${theme === 'dark' ? 'from-gray-800 to-transparent' : 'from-white to-transparent'}`}></div>
        <div className={`prose prose-lg max-w-none rounded-xl p-8 border h-[600px] overflow-y-auto relative scrollbar-thin transition-colors duration-200
          ${theme === 'dark'
            ? 'bg-gray-900 border-gray-700 prose-invert'
            : 'bg-gray-50 border-gray-100'}`}>
          {showTimestamped ? (
            transcriptData.transcript.split('\n').map((line, index) => {
              const isTimestamp = line.match(/^\[\d{2}:\d{2}:\d{2} - \d{2}:\d{2}:\d{2}\]$/);
              return (
                <p
                  key={index}
                  className={`mb-3 font-mono transition-colors duration-200
                    ${isTimestamp
                      ? theme === 'dark'
                        ? 'text-primary-300 font-medium bg-gray-800 px-3 py-2 rounded-lg inline-block'
                        : 'text-primary-600 font-medium bg-primary-50 px-3 py-2 rounded-lg inline-block'
                      : theme === 'dark'
                        ? 'text-gray-300'
                        : 'text-gray-600'}`}
                >
                  {isTimestamp ? (
                    <i className="fas fa-clock mr-2 text-primary-500"></i>
                  ) : null}
                  {line}
                </p>
              );
            })
          ) : (
            <div className={`whitespace-pre-wrap leading-relaxed font-mono transition-colors duration-200
              ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {transcriptData.plain_transcript}
            </div>
          )}
        </div>
        <div className={`absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200
          ${theme === 'dark' ? 'from-gray-800 to-transparent' : 'from-white to-transparent'}`}></div>
      </div>
    </div>
  );
}

function ErrorDisplay({ error }) {
  if (!error) return null;

  const getErrorDetails = (errorType) => {
    switch (errorType) {
      case 'video_unavailable':
        return {
          icon: (
            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          title: 'Video Unavailable',
          message: error.message,
          suggestion: 'Please try a different video that is publicly available.',
          style: 'bg-red-50 border-red-200 text-red-700'
        };
      case 'private_video':
        return {
          icon: (
            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ),
          title: 'Private Video',
          message: error.message,
          suggestion: 'This video is private and cannot be accessed. Please try a public video instead.',
          style: 'bg-red-50 border-red-200 text-red-700'
        };
      case 'age_restricted':
        return {
          icon: (
            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ),
          title: 'Age-Restricted Video',
          message: error.message,
          suggestion: 'This video requires age verification. Please try a different video.',
          style: 'bg-red-50 border-red-200 text-red-700'
        };
      case 'no_subtitles':
        return {
          icon: (
            <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          title: 'No Subtitles Available',
          message: error.message,
          suggestion: (
            <>
              <p>This video doesn't have English captions. Here's what you can do:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Try another video that has English captions enabled</li>
                <li>Check if the video has captions in other languages</li>
                <li>Look for a version of the video with captions</li>
              </ul>
            </>
          ),
          style: 'bg-yellow-50 border-yellow-200 text-yellow-700'
        };
      case 'server_error':
        return {
          icon: (
            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          title: 'Server Error',
          message: error.message,
          suggestion: (
            <>
              <p>We're having trouble processing your request. Please try:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Refreshing the page and trying again</li>
                <li>Checking your internet connection</li>
                <li>Waiting a few minutes before trying again</li>
              </ul>
            </>
          ),
          style: 'bg-red-50 border-red-200 text-red-700'
        };
      case 'parse_error':
        return {
          icon: (
            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          title: 'Error Processing Captions',
          message: error.message,
          suggestion: 'The captions format is not supported. Please try a different video with standard YouTube captions.',
          style: 'bg-red-50 border-red-200 text-red-700'
        };
      case 'invalid_url':
        return {
          icon: (
            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          title: 'Invalid YouTube URL',
          message: error.message,
          suggestion: 'Please enter a valid YouTube URL in the format: https://www.youtube.com/watch?v=VIDEO_ID',
          style: 'bg-red-50 border-red-200 text-red-700'
        };
      default:
        return {
          icon: (
            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          title: 'Error',
          message: error.message || 'An unexpected error occurred',
          suggestion: 'Please try again or contact support if the problem persists.',
          style: 'bg-red-50 border-red-200 text-red-700'
        };
    }
  };

  const errorType = error.error_type || 'unknown_error';
  const { icon, title, message, suggestion, style } = getErrorDetails(errorType);

  return (
    <div className={`mt-4 rounded-lg border p-4 ${style}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="mt-1 text-sm">{message}</p>
          <div className="mt-2 text-sm">
            {typeof suggestion === 'string' ? (
              <p>{suggestion}</p>
            ) : (
              suggestion
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState(() => {
    // Default to dark mode
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark';
  });

  useEffect(() => {
    // Update localStorage and document class when theme changes
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transcriptData, setTranscriptData] = useState(null);

  const [demoVideos, setDemoVideos] = useState([]);
  const [loadingDemo, setLoadingDemo] = useState(false);

  // Add useEffect to fetch demo videos
  useEffect(() => {
    const fetchDemoVideos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/demo-videos');
        setDemoVideos(response.data.videos);
      } catch (err) {
        console.error('Error fetching demo videos:', err);
      }
    };
    fetchDemoVideos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTranscriptData(null);

    try {
      // Get the video ID from the URL
      const videoId = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/)?.[1];
      if (!videoId) {
        throw {
          message: 'Please enter a valid YouTube URL',
          error_type: 'invalid_url'
        };
      }

      // Get the timestamped transcript
      const response = await axios.post('http://localhost:8000/ingest', {
        youtube_url: url
      });

      // Get the plain text transcript
      const plainTranscriptResponse = await axios.get(`http://localhost:8000/transcripts/${videoId}_notimestamp.txt`);
      
      setTranscriptData({
        ...response.data,
        plain_transcript: plainTranscriptResponse.data
      });
    } catch (err) {
      if (err.response?.data) {
        setError(err.response.data);
      } else if (err.message) {
        setError({
          message: err.message,
          error_type: 'client_error'
        });
      } else {
        setError({
          message: 'An unexpected error occurred. Please try again.',
          error_type: 'unknown_error'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (videoId) => {
    setLoadingDemo(true);
    setError(null);
    setTranscriptData(null);
    setUrl('');  // Clear the URL input

    try {
      const response = await axios.get(`http://localhost:8000/demo/${videoId}`);
      setTranscriptData({
        ...response.data,
        plain_transcript: response.data.plain_transcript  // Use plain transcript from response
      });
    } catch (err) {
      if (err.response?.data) {
        setError(err.response.data);
      } else {
        setError({
          message: 'Error loading demo video. Please try again.',
          error_type: 'demo_error'
        });
      }
    } finally {
      setLoadingDemo(false);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`min-h-screen flex flex-col ${theme === 'dark' 
        ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100' 
        : 'bg-gradient-to-b from-gray-50 via-gray-50 to-gray-100 text-gray-900'}`}>
        <ThemeToggle />
        <Header />
        
        <main className="flex-grow w-full mx-auto px-6 lg:px-8 py-12">
          <div className="max-w-[1200px] mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className={`rounded-2xl shadow-lg p-10 border backdrop-blur-sm
                ${theme === 'dark'
                  ? 'bg-gray-800/80 border-gray-700'
                  : 'bg-white/80 border-gray-100'}`}>
                <label htmlFor="youtube-url" className={`block text-2xl font-semibold mb-4 flex items-center
                  ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                  <i className="fab fa-youtube mr-3 text-red-500"></i>
                  Enter YouTube Video URL
                </label>
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <i className={`fas fa-link text-2xl
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}></i>
                      </div>
                      <input
                        type="url"
                        name="youtube-url"
                        id="youtube-url"
                        className={`block w-full pl-14 pr-6 py-5 rounded-xl border text-lg
                          ${theme === 'dark'
                            ? 'bg-gray-700/50 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500'
                            : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500'}`}
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`inline-flex items-center justify-center px-10 py-5 border border-transparent text-lg font-semibold rounded-xl shadow-sm hover-transition hover:scale-105
                      ${theme === 'dark'
                        ? 'bg-sky-500 hover:bg-sky-600 text-white focus:ring-sky-400'
                        : 'bg-sky-600 hover:bg-sky-700 text-white focus:ring-sky-500'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-3"></i>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-file-alt mr-3"></i>
                        Ingest
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            <ErrorDisplay error={error} />
            {/* Demo Videos Section */}
            <div className="mt-16">
              <h2 className={`text-2xl font-semibold mb-6 flex items-center
                ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                <i className="fas fa-play-circle mr-3 text-sky-500"></i>
                Try with Demo Videos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {demoVideos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => handleDemoClick(video.id)}
                    disabled={loadingDemo}
                    className={`group p-6 rounded-xl border backdrop-blur-sm text-left transition-all duration-200 hover:scale-105
                      ${theme === 'dark'
                        ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50'
                        : 'bg-white/50 border-gray-200 hover:bg-gray-50/50'}
                      ${loadingDemo ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
                        ${theme === 'dark' ? 'bg-sky-500/20' : 'bg-sky-100'}`}>
                        <i className={`fas fa-video text-xl ${theme === 'dark' ? 'text-sky-400' : 'text-sky-600'}`}></i>
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold mb-1 group-hover:text-sky-500 transition-colors duration-200
                          ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                          {video.title}
                        </h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {video.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-sky-500">
                      {loadingDemo ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Loading...
                        </>
                      ) : (
                        <>
                          <span>Click to try</span>
                          <i className="fas fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform duration-200"></i>
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Transcript Display with fixed height container */}
            <div className=" transition-all duration-300 ease-in-out">
              {transcriptData && (
                <TranscriptDisplay transcriptData={transcriptData} />
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ThemeContext.Provider>
  );
}

// Update the styles
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');

:root {
  --font-primary: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  --font-mono: 'Inter', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

body {
  font-family: var(--font-primary);
}

.font-mono {
  font-family: var(--font-mono);
}

/* ... rest of the existing styles ... */
`;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default App; 