import React from "react";

function MainContent({
  companyName,
  roleName,
  generateCoverLetter,
  loading,
  jobId,
  handleEasyApplyClick,
}) {
  return (
    <main className="flex-none p-4 bg-gray-50">
      <div className="border-2 border-blue-200 rounded-lg p-4 bg-white">
        <div className="mb-2 flex justify-between items-center">
          <h2 className="text-sm">
            <span className="font-bold">Company:</span> {companyName}
          </h2>
          <span className="text-sm text-gray-500">
            <span className="font-bold">Job ID:</span> {jobId}
          </span>
        </div>
        <div className="mb-2">
          <h2 className="text-sm">
            <span className="font-bold">Role:</span> {roleName}
          </h2>
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
          <button
            onClick={handleEasyApplyClick}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 transition-colors text-sm w-[48%]"
          >
            Easy Apply
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
  );
}

export default MainContent;
