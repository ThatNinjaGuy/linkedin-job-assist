import React from "react";

function Footer({ coverLetter, copyToClipboard }) {
  return (
    <footer className="flex-1 p-4 bg-gray-50 relative">
      <div className="relative h-full">
        <textarea
          className="w-full h-full resize-none focus:outline-none border-2 border-blue-200 rounded-lg p-2"
          placeholder="Your generated cover letter will appear here..."
          readOnly
          value={coverLetter}
        />
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 text-white p-2 transition-transform transform hover:scale-110 rounded-full"
          title="Copy to clipboard"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16h8M8 12h8m-8-4h8m-8 8v4a2 2 0 002 2h8a2 2 0 002-2v-4m-2 0H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v4"
            />
          </svg>
        </button>
      </div>
    </footer>
  );
}

export default Footer;
