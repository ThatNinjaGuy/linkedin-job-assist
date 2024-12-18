import React, { useRef, useState } from "react";
import { saveToStorage, STORAGE_KEYS } from "../utils/localStorage";

function Profile({
  onBackClick,
  resumeText,
  openAiKey,
  setOpenAiKey,
  setResumeText,
}) {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const formData = new FormData(formRef.current);
    const newApiKey = formData.get("apiKey");
    const newResumeText = formData.get("resume");

    try {
      // Save to state
      setOpenAiKey(newApiKey);
      setResumeText(newResumeText);

      // Save to Chrome storage
      await Promise.all([
        saveToStorage(STORAGE_KEYS.OPENAI_KEY, newApiKey),
        saveToStorage(STORAGE_KEYS.RESUME_TEXT, newResumeText),
      ]);

      // Show notification
      setNotificationVisible(true);
      setTimeout(() => setNotificationVisible(false), 2000);

      // Navigate back on successful save
      //   onBackClick();
    } catch (error) {
      console.error("Failed to save profile:", error);
      // Here you might want to show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-[600px] relative">
      {/* Notification */}
      {notificationVisible && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-md z-50">
          Profile saved successfully!
        </div>
      )}

      {/* Header */}
      <header className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
        <button
          onClick={handleSubmit}
          className={`bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md transition-colors text-sm ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>

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
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto space-y-6"
        >
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
                name="apiKey"
                type="password"
                defaultValue={openAiKey}
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
                name="resume"
                rows={12}
                defaultValue={resumeText}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Paste your resume content here..."
              />
              <p className="text-sm text-gray-500">
                This will be used to generate personalized cover letters.
              </p>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Profile;
