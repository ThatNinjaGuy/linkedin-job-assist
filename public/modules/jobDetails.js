/*global chrome*/

import { getJobDescriptionClassNames } from "./utils.js";

export function extractJobDetails(tab) {
  const jobId = extractJobIdFromUrl(tab.url);

  chrome.scripting
    .executeScript({
      target: { tabId: tab.id },
      func: function (classNames) {
        function findJobDetailsContainer(className) {
          const possibleSelectors = [
            `.${className}`,
            "#job-details",
            ".jobs-description",
            ".jobs-unified-description__content",
            ".jobs-description-content__text",
          ];

          for (const selector of possibleSelectors) {
            const container = document.body.querySelector(selector);
            if (container) return container;
          }
          return null;
        }

        function cleanJobDescriptionText(container) {
          const allText = getAllText(container);
          return allText
            .replace(/\s*\n\s*\n\s*/g, "\n\n")
            .replace(/\s+/g, " ")
            .replace(/\n +/g, "\n")
            .replace(/<!--+>+/g, "")
            .trim();
        }

        function getAllText(element) {
          let text = "";

          if (element.tagName === "LI") {
            text += "• ";
          }

          for (const node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
              const nodeText = node.textContent.trim();
              if (nodeText && nodeText !== "<!---->") {
                text += nodeText + " ";
              }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              if (
                window.getComputedStyle(node).display !== "none" &&
                window.getComputedStyle(node).visibility !== "hidden"
              ) {
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

        function extractCompanyName(companyNameClass) {
          const companyNameElement = document.querySelector(
            `.${companyNameClass}`
          );
          return companyNameElement
            ? companyNameElement.textContent.trim()
            : "";
        }

        function extractRoleName(roleNameClass) {
          const roleNameElement = document.querySelector(`.${roleNameClass}`);
          return roleNameElement ? roleNameElement.textContent.trim() : "";
        }

        const jobDetailsContainer = findJobDetailsContainer(
          classNames.descriptionClass
        );
        if (!jobDetailsContainer)
          return { description: "", companyName: "", roleName: "" };

        const cleanedJobDetails = cleanJobDescriptionText(jobDetailsContainer);
        const companyName = extractCompanyName(classNames.companyNameClass);
        const roleName = extractRoleName(classNames.roleNameClass);

        return {
          description: cleanedJobDetails || "",
          companyName,
          roleName,
        };
      },
      args: [getJobDescriptionClassNames(tab.url)],
    })
    .then((results) => {
      console.log("Results from grabJobDescription:", results);
      console.log("Job ID:", jobId);
      chrome.storage.local.set({
        jobDescription: results[0].result.description,
        companyName: results[0].result.companyName,
        roleName: results[0].result.roleName,
        jobId: jobId,
      });
    })
    .catch((error) => {
      console.error("Error executing script:", error);
    });
}

function extractJobIdFromUrl(url) {
  const urlParams = new URLSearchParams(new URL(url).search);
  return urlParams.get("currentJobId") || "";
}
