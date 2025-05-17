import React, { useState, useRef, useEffect } from 'react';
import CopyButton from './CopyButton';
import DownloadButton from './DownloadButton';

function TranscriptDisplay({ transcriptData, theme }) {
  const [showTimestamped, setShowTimestamped] = useState(true);
  const transcriptRef = useRef(null);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [transcriptData]);

  if (!transcriptData) return null;

  const currentTranscript = showTimestamped ? transcriptData.transcript : transcriptData.plain_transcript;

  return (
    <div 
      ref={transcriptRef}
      className={`mt-8 sm:mt-12 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-10 border transition-all duration-300 ease-in-out
        ${theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-100'}`}
    >
      <div className="mb-6 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center group">
          <i className={`fas fa-video mr-3 flex-shrink-0 ${theme === 'dark' ? 'text-primary-400' : 'text-primary-600'}`}></i>
          <span className={`truncate ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
            {transcriptData.video_title}
          </span>
        </h2>
        <div className="h-1 w-20 bg-primary-500 rounded-full mt-2"></div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
          <div className={`flex items-center rounded-full p-1 shadow-inner w-full sm:w-auto
            ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <button
              onClick={() => setShowTimestamped(true)}
              className={`px-4 sm:px-6 py-2 rounded-full text-sm font-medium flex items-center flex-1 sm:flex-none justify-center
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
              className={`px-4 sm:px-6 py-2 rounded-full text-sm font-medium flex items-center flex-1 sm:flex-none justify-center
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
        <div className={`prose prose-sm sm:prose-base lg:prose-lg max-w-none rounded-xl p-4 sm:p-6 lg:p-8 border h-[400px] sm:h-[500px] lg:h-[600px] overflow-y-auto relative scrollbar-thin transition-colors duration-200
          ${theme === 'dark'
            ? 'bg-gray-900 border-gray-700 prose-invert'
            : 'bg-gray-50 border-gray-100'}`}>
          {showTimestamped ? (
            transcriptData.transcript.split('\n').map((line, index) => {
              const isTimestamp = line.match(/^\[\d{2}:\d{2}:\d{2} - \d{2}:\d{2}:\d{2}\]$/);
              return (
                <p
                  key={index}
                  className={`mb-2 sm:mb-3 font-mono text-sm sm:text-base transition-colors duration-200
                    ${isTimestamp
                      ? theme === 'dark'
                        ? 'text-primary-300 font-medium bg-gray-800 px-2 sm:px-3 py-1 sm:py-2 rounded-lg inline-block'
                        : 'text-primary-600 font-medium bg-primary-50 px-2 sm:px-3 py-1 sm:py-2 rounded-lg inline-block'
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
            <div className={`whitespace-pre-wrap leading-relaxed font-mono text-sm sm:text-base transition-colors duration-200
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

export default TranscriptDisplay; 