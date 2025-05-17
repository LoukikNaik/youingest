import React from 'react';

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

export default ErrorDisplay; 