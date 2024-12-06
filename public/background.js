/*global chrome*/

const linkedinListViewUrl = "https://www.linkedin.com/jobs/collections";
const linkedinDetailViewUrl = "https://www.linkedin.com/jobs/view";

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    if (
      tab.url?.startsWith(linkedinListViewUrl) ||
      tab.url?.startsWith(linkedinDetailViewUrl)
    ) {
      chrome.scripting
        .executeScript({
          target: { tabId },
          func: grabJobDescription,
          args: [getJobDescriptionClassName(tab.url)],
        })
        .then((results) => {
          chrome.storage.local.set({ jobDescription: results[0].result });
        });
    }
  }
});

function getJobDescriptionClassName(url) {
  return url.startsWith(linkedinListViewUrl)
    ? "jobs-unified-description__content"
    : "jobs-description-content__text";
}

function grabJobDescription(className) {
  const possibleSelectors = [
    `.${className}`,
    "#job-details",
    ".jobs-description",
    ".jobs-unified-description__content",
    ".jobs-description-content__text",
  ];

  let jobDetailsContainer = null;
  for (const selector of possibleSelectors) {
    jobDetailsContainer = document.body.querySelector(selector);
    if (jobDetailsContainer) break;
  }

  if (!jobDetailsContainer) return "";

  function getAllText(element) {
    let text = "";

    // Special handling for list items
    if (element.tagName === "LI") {
      text += "• "; // Add bullet point for list items
    }

    for (const node of element.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        // Clean up text nodes
        const nodeText = node.textContent.trim();
        if (nodeText && nodeText !== "<!---->") {
          text += nodeText + " ";
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Skip hidden elements and empty formatting elements
        if (
          window.getComputedStyle(node).display !== "none" &&
          window.getComputedStyle(node).visibility !== "hidden"
        ) {
          // Add line breaks for block elements
          const style = window.getComputedStyle(node);
          const isBlock =
            style.display === "block" ||
            node.tagName === "P" ||
            node.tagName === "DIV" ||
            node.tagName === "H2";

          const childText = getAllText(node);
          if (childText.trim()) {
            if (isBlock && text.trim()) {
              text += "\n";
            }
            text += childText;
            if (isBlock) {
              text += "\n";
            }
          }
        }
      }
    }
    return text;
  }

  const allText = getAllText(jobDetailsContainer);
  const cleanedJobDetails = allText
    .replace(/\s*\n\s*\n\s*/g, "\n\n") // Replace multiple newlines with double newline
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .replace(/\n +/g, "\n") // Remove spaces after newlines
    .replace(/<!--+>+/g, "") // Remove HTML comments
    .trim();

  return cleanedJobDetails || "";
}
