import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import ThemeToggle from './ThemeToggle';
import Header from './Header';
import Footer from './Footer';
import ErrorDisplay from './ErrorDisplay';
import TranscriptDisplay from './TranscriptDisplay';

// Configure axios defaults
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';

function Home() {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('v');
  const formRef = useRef(null);

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark';
  });

  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transcriptData, setTranscriptData] = useState(null);
  const [demoVideos, setDemoVideos] = useState([]);
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [loadingDemoVideos, setLoadingDemoVideos] = useState(true);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Fetch demo videos
  useEffect(() => {
    const fetchDemoVideos = async () => {
      setLoadingDemoVideos(true);
      try {
        console.log('Fetching demo videos from:', `${config.backendUrl}/demo-videos`);
        const response = await axios.get(`${config.backendUrl}/demo-videos`);
        console.log('Demo videos response:', response.data);
        if (response.data && response.data.videos) {
          setDemoVideos(response.data.videos);
        } else {
          console.error('Invalid demo videos response format:', response.data);
          setDemoVideos([]);
        }
      } catch (err) {
        console.error('Error fetching demo videos:', err);
        if (err.response) {
          console.error('Error response:', err.response.data);
        }
        setDemoVideos([]);
      } finally {
        setLoadingDemoVideos(false);
      }
    };
    fetchDemoVideos();
  }, []);

  // Auto-populate URL and submit form if videoId is present in route
  useEffect(() => {
    if (videoId) {
      const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
      setUrl(youtubeUrl);
      // Use setTimeout to ensure the URL is set before submitting
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      }, 100);
    }
  }, [videoId]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTranscriptData(null);

    try {
      // Extract video ID from URL, handling additional parameters
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get('v');
      if (!videoId) {
        throw {
          message: 'Please enter a valid YouTube URL',
          error_type: 'invalid_url'
        };
      }

      // Get all cookies from the current domain
      const cookies = document.cookie.split(';').map(cookie => {
        const [name, value] = cookie.trim().split('=');
        return { name, value };
      });

      const response = await axios.post(`${config.backendUrl}/ingest`, {
        youtube_url: `https://www.youtube.com/watch?v=${videoId}`,
        cookies: cookies
      }, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      
      setTranscriptData(response.data);
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
    setUrl('');

    try {
      const response = await axios.get(`${config.backendUrl}/demo/${videoId}`);
      setTranscriptData({
        ...response.data,
        plain_transcript: response.data.plain_transcript
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
    <div className={`min-h-screen flex flex-col ${theme === 'dark' 
      ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100' 
      : 'bg-gradient-to-b from-gray-50 via-gray-50 to-gray-100 text-gray-900'}`}>
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      <Header theme={theme} />
      
      <main className="flex-grow w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-[1200px] mx-auto">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className={`rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-10 border backdrop-blur-sm
              ${theme === 'dark'
                ? 'bg-gray-800/80 border-gray-700'
                : 'bg-white/80 border-gray-100'}`}>
              <label htmlFor="youtube-url" className={`block text-xl sm:text-2xl font-semibold mb-4 flex items-center
                ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                <i className="fab fa-youtube mr-2 sm:mr-3 text-red-500"></i>
                Enter YouTube Video URL
              </label>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="flex-1">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none">
                      <i className={`fas fa-link text-xl sm:text-2xl
                        ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}></i>
                    </div>
                    <input
                      type="url"
                      name="youtube-url"
                      id="youtube-url"
                      className={`block w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-4 sm:py-5 rounded-xl border text-base sm:text-lg
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
                  className={`inline-flex items-center justify-center px-6 sm:px-10 py-4 sm:py-5 border border-transparent text-base sm:text-lg font-semibold rounded-xl shadow-sm hover-transition hover:scale-105
                    ${theme === 'dark'
                      ? 'bg-sky-500 hover:bg-sky-600 text-white focus:ring-sky-400'
                      : 'bg-sky-600 hover:bg-sky-700 text-white focus:ring-sky-500'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2 sm:mr-3"></i>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-file-alt mr-2 sm:mr-3"></i>
                      Ingest
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          <ErrorDisplay error={error} />
          
          {/* Demo Videos Section */}
          <div className="mt-12 sm:mt-16">
            <h2 className={`text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 flex items-center
              ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
              <i className="fas fa-play-circle mr-2 sm:mr-3 text-sky-500"></i>
              Try with Demo Videos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {loadingDemoVideos ? (
                <div className={`col-span-full text-center py-6 sm:py-8 rounded-xl border
                  ${theme === 'dark' 
                    ? 'bg-gray-800/50 border-gray-700 text-gray-400' 
                    : 'bg-white/50 border-gray-200 text-gray-600'}`}>
                  <i className="fas fa-spinner fa-spin text-xl sm:text-2xl mb-2 sm:mb-3"></i>
                  <p>Loading demo videos...</p>
                </div>
              ) : demoVideos && demoVideos.length > 0 ? (
                demoVideos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => handleDemoClick(video.id)}
                    disabled={loadingDemo}
                    className={`group p-4 sm:p-6 rounded-xl border backdrop-blur-sm text-left transition-all duration-200 hover:scale-105
                      ${theme === 'dark'
                        ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50'
                        : 'bg-white/50 border-gray-200 hover:bg-gray-50/50'}
                      ${loadingDemo ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center
                        ${theme === 'dark' ? 'bg-sky-500/20' : 'bg-sky-100'}`}>
                        <i className={`fas fa-video text-lg sm:text-xl ${theme === 'dark' ? 'text-sky-400' : 'text-sky-600'}`}></i>
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold mb-1 group-hover:text-sky-500 transition-colors duration-200 text-sm sm:text-base
                          ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                          {video.title}
                        </h3>
                        <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {video.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-sky-500">
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
                ))
              ) : (
                <div className={`col-span-full text-center py-6 sm:py-8 rounded-xl border
                  ${theme === 'dark' 
                    ? 'bg-gray-800/50 border-gray-700 text-gray-400' 
                    : 'bg-white/50 border-gray-200 text-gray-600'}`}>
                  <i className="fas fa-exclamation-circle text-xl sm:text-2xl mb-2 sm:mb-3"></i>
                  <p>No demo videos available</p>
                </div>
              )}
            </div>
          </div>

          {/* Transcript Display */}
          <div className="transition-all duration-300 ease-in-out">
            {transcriptData && (
              <TranscriptDisplay transcriptData={transcriptData} theme={theme} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home; 