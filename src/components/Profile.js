import React from "react";

function Profile({ onBackClick }) {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
        <div className="w-8">{/* Empty div for spacing */}</div>

        <h1 className="text-2xl font-semibold">User Profile</h1>

        <button
          onClick={onBackClick}
          className="text-white hover:bg-blue-700 p-2 rounded-full transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* API Key Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              OpenAI API Key
            </h2>
            <div className="space-y-2">
              <label
                htmlFor="apiKey"
                className="block text-sm font-medium text-gray-700"
              >
                Enter your API key
              </label>
              <input
                id="apiKey"
                type="password"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="sk-..."
              />
              <p className="text-sm text-gray-500">
                Your API key is stored locally and never shared with anyone.
              </p>
            </div>
          </div>

          {/* Resume Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Your Resume
            </h2>
            <div className="space-y-2">
              <label
                htmlFor="resume"
                className="block text-sm font-medium text-gray-700"
              >
                Paste your resume text
              </label>
              <textarea
                id="resume"
                rows={12}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Paste your resume content here..."
              />
              <p className="text-sm text-gray-500">
                This will be used to generate personalized cover letters.
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Save Profile
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
