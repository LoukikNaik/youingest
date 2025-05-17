import React from 'react';
import { useSearchParams } from 'react-router-dom';

function Watch() {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('v');

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Watch Component</h1>
        <p className="text-xl">
          {videoId ? `?v=${videoId}` : 'No video ID provided'}
        </p>
      </div>
    </div>
  );
}

export default Watch; 