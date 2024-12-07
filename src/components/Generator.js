import React, { useState, useEffect } from "react";
import { getFromStorage } from "../utils/localStorage";
import { postChatGptMessage } from "../utils/chatGPTUtil";

function Generator({ onSettingsClick, resume, openAiKey }) {
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [roleName, setRoleName] = useState("");
  const [notificationVisible, setNotificationVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedJob = await getFromStorage("jobDescription");
      const fetchedCompanyName = await getFromStorage("companyName");
      const fetchedRoleName = await getFromStorage("roleName");
      setJobDescription(fetchedJob);
      setCompanyName(fetchedCompanyName);
      setRoleName(fetchedRoleName);
    };
    fetchData();
  }, []);

  const generateCoverLetter = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const message = `Generate a cover letter based on the following resume and job description. Show interest by relating the requirements to skills from resume. Do not provide placeholders for anything. User generic terms or ignore referring to it, if an information is unknown.\n\nRESUME:\n${resume}\n\nJOB DESCRIPTION:\n${jobDescription}`;
      const chatGPTResponse = await postChatGptMessage(message, openAiKey);
      setCoverLetter(chatGPTResponse);
    } catch (error) {
      console.error("Failed to generate cover letter:", error);
      setCoverLetter("Failed to generate cover letter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter).then(
      () => {
        setNotificationVisible(true);
        setTimeout(() => setNotificationVisible(false), 2000);
      },
      (err) => {
        console.error("Failed to copy text: ", err);
      }
    );
  };

  return (
    <div className="flex flex-col h-[600px] w-[600px]">
      {/* Notification */}
      {notificationVisible && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-md z-50">
          Cover letter copied to clipboard!
        </div>
      )}

      {/* Header */}
      <header className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between shrink-0">
        <h1 className="text-xl font-semibold mx-auto">
          LinkedIn Cover Letter Generator
        </h1>

        <button
          onClick={onSettingsClick}
          className="text-white hover:bg-blue-700 p-2 rounded-full transition-colors"
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
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-none p-4 bg-gray-50">
        <div className="border-2 border-blue-200 rounded-lg p-4 bg-white">
          <div className="mb-4">
            <h2 className="text-lg font-bold">Company: {companyName}</h2>
            <h3 className="text-md font-semibold">Role: {roleName}</h3>
          </div>
          <div className="flex flex-wrap gap-2 justify-between">
            <button
              onClick={generateCoverLetter}
              className={`bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 transition-colors text-sm w-[48%] ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Cover Letter"}
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 transition-colors text-sm w-[48%]">
              Button 2
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 transition-colors text-sm w-[48%]">
              Button 3
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 transition-colors text-sm w-[48%]">
              Button 4
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
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
    </div>
  );
}

export default Generator;
