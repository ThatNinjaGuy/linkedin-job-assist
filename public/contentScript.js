/*global chrome*/

console.log("LinkedIn Cover Letter Generator content script loaded");

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case "EXTRACT_JOB_DETAILS":
      const jobDetails = extractJobDetails();
      sendResponse({ success: true, data: jobDetails });
      break;

    default:
      console.log("Unknown message type:", request.type);
      sendResponse({ success: false, error: "Unknown message type" });
  }
  return true;
});

// Function to extract job details from the LinkedIn page
function extractJobDetails() {
  // This is a placeholder - you'll need to implement the actual selectors
  return {
    title: document.querySelector(".job-title")?.textContent?.trim(),
    company: document.querySelector(".company-name")?.textContent?.trim(),
    description: document
      .querySelector(".job-description")
      ?.textContent?.trim(),
    location: document.querySelector(".job-location")?.textContent?.trim(),
  };
}
