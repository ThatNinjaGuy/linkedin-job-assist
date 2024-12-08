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
      .then(() => console.log("Easy Apply script executed successfully"))
      .catch((error) => {
        console.error("Error executing Easy Apply script:", error);
      });
  });
}
