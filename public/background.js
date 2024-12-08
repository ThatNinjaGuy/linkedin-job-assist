// import { extractJobDetails } from "./modules/jobDetails.js";
// import { handleEasyApply } from "./modules/easyApply.js";

import { handleEasyApply } from "./modules/easyApply.js";
import { extractJobDetails } from "./modules/jobDetails.js";

/*global chrome*/

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    if (
      tab.url?.startsWith("https://www.linkedin.com/jobs/collections") ||
      tab.url?.startsWith("https://www.linkedin.com/jobs/view")
    ) {
      extractJobDetails(tab);
    }
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "easyApply") {
    handleEasyApply();
    return true; // Keep the message channel open for sendResponse
  }
});
console.log("Service worker registered successfully.");
