import React from "react";

function MainContent({ companyName, roleName, generateCoverLetter, loading }) {
  return (
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
  );
}

export default MainContent;
