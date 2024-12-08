/*global chrome*/

export function handleEasyApply(tab) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      console.error("No active tab found.");
      return;
    }

    const activeTab = tabs[0];
    if (!activeTab) {
      console.error("Active tab is undefined.");
      return;
    }

    executeEasyApplyScript(activeTab.id)
      .then(() => console.log("Easy Apply script executed successfully"))
      .catch((error) => {
        console.error("Error executing Easy Apply script:", error);
      });
  });
}

function executeEasyApplyScript(tabId) {
  return chrome.scripting.executeScript({
    target: { tabId },
    func: function () {
      const easyApplyButton = document.querySelector(
        ".jobs-apply-button--top-card button"
      );
      if (easyApplyButton) {
        easyApplyButton.click();
        setTimeout(() => {
          const formDetails = [];
          let allRequiredFieldsFilled = true;

          extractDropdowns(formDetails, allRequiredFieldsFilled);
          extractTextFields(formDetails, allRequiredFieldsFilled);

          console.log("Form Details:", formDetails);
          chrome.storage.local.set({ formDetails });

          if (allRequiredFieldsFilled) {
            clickNextButton();
          }
        }, 2000); // Adjust timeout as needed
        return true;
      }
      return false;

      function extractDropdowns(formDetails, allRequiredFieldsFilled) {
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
      }

      function extractTextFields(formDetails, allRequiredFieldsFilled) {
        const textFields = document.querySelectorAll('input[type="text"]');
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
      }

      function clickNextButton() {
        const nextButton = document.querySelector(
          'button[aria-label="Continue to next step"]'
        );
        if (nextButton) {
          nextButton.click();
        }
      }
    },
  });
}
