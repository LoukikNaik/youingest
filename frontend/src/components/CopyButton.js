import React, { useState } from 'react';

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

export default CopyButton; 