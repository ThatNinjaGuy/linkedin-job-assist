/*global chrome*/

const linkedinListViewUrl = "https://www.linkedin.com/jobs/collections";
const linkedinDetailViewUrl = "https://www.linkedin.com/jobs/view";

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    if (
      tab.url?.startsWith(linkedinListViewUrl) ||
      tab.url?.startsWith(linkedinDetailViewUrl)
    ) {
      const jobId = extractJobIdFromUrl(tab.url);

      chrome.scripting
        .executeScript({
          target: { tabId },
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
              const roleNameElement = document.querySelector(
                `.${roleNameClass}`
              );
              return roleNameElement ? roleNameElement.textContent.trim() : "";
            }

            console.log(
              "Inside grabJobDescription with classNames:",
              classNames
            );
            const jobDetailsContainer = findJobDetailsContainer(
              classNames.descriptionClass
            );
            if (!jobDetailsContainer)
              return { description: "", companyName: "", roleName: "" };

            const cleanedJobDetails =
              cleanJobDescriptionText(jobDetailsContainer);
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
  }
});

function getJobDescriptionClassNames(url) {
  console.log(url);
  if (url.startsWith(linkedinListViewUrl)) {
    return {
      descriptionClass: "jobs-unified-description__content",
      companyNameClass: "job-details-jobs-unified-top-card__company-name",
      roleNameClass: "job-details-jobs-unified-top-card__job-title", // Replace with actual class
    };
  } else {
    return {
      descriptionClass: "jobs-description-content__text",
      companyNameClass: "job-details-jobs-unified-top-card__company-name",
      roleNameClass: "job-details-jobs-unified-top-card__job-title", // Replace with actual class
    };
  }
}

function extractJobIdFromUrl(url) {
  const urlParams = new URLSearchParams(new URL(url).search);
  return urlParams.get("currentJobId") || "";
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "easyApply") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        console.error("No active tab found.");
        sendResponse({ success: false });
        return;
      }

      const activeTab = tabs[0];
      if (!activeTab) {
        console.error("Active tab is undefined.");
        sendResponse({ success: false });
        return;
      }

      chrome.scripting
        .executeScript({
          target: { tabId: activeTab.id },
          func: function () {
            const easyApplyButton = document.querySelector(
              ".jobs-apply-button--top-card button"
            );
            if (easyApplyButton) {
              easyApplyButton.click();

              // Wait for the form to load
              setTimeout(() => {
                const formDetails = [];
                let allRequiredFieldsFilled = true;

                // Extract dropdowns
                const dropdowns = document.querySelectorAll("select");
                dropdowns.forEach((dropdown) => {
                  const labelElement = document.querySelector(
                    `label[for="${dropdown.id}"]`
                  );
                  const label = labelElement
                    ? labelElement.textContent.trim()
                    : "No label";
                  const options = Array.from(dropdown.options).map((option) =>
                    option.textContent.trim()
                  );
                  const selectedValue = dropdown.value;
                  const isRequired = dropdown.hasAttribute("required");
                  if (isRequired && !selectedValue) {
                    allRequiredFieldsFilled = false;
                  }
                  formDetails.push({
                    type: "dropdown",
                    label,
                    options,
                    selectedValue,
                    required: isRequired,
                  });
                });

                // Extract text fields
                const textFields =
                  document.querySelectorAll('input[type="text"]');
                textFields.forEach((input) => {
                  const labelElement = document.querySelector(
                    `label[for="${input.id}"]`
                  );
                  const label = labelElement
                    ? labelElement.textContent.trim()
                    : "No label";
                  const value = input.value.trim();
                  const isRequired = input.hasAttribute("required");
                  if (isRequired && !value) {
                    allRequiredFieldsFilled = false;
                  }
                  formDetails.push({
                    type: "text",
                    label,
                    value,
                    required: isRequired,
                  });
                });

                console.log("Form Details:", formDetails);
                chrome.storage.local.set({ formDetails });

                // Click the "Next" button if all required fields are filled
                if (allRequiredFieldsFilled) {
                  const nextButton = document.querySelector(
                    'button[aria-label="Continue to next step"]'
                  );
                  if (nextButton) {
                    nextButton.click();
                  }
                }
              }, 2000); // Adjust timeout as needed

              return true;
            }
            return false;
          },
        })
        .then(() => sendResponse({ success: true }))
        .catch((error) => {
          console.error("Error executing Easy Apply script:", error);
          sendResponse({ success: false });
        });
    });
    return true; // Keep the message channel open for sendResponse
  }
});
