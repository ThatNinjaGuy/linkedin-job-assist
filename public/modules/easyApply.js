/*global chrome*/

export function handleEasyApply() {
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
      if (clickEasyApplyButton()) {
        setTimeout(() => {
          handleForm();
        }, 2000); // Adjust timeout as needed
      }

      function clickEasyApplyButton() {
        try {
          const easyApplyButton = document.querySelector(
            ".jobs-apply-button--top-card button"
          );
          if (easyApplyButton) {
            easyApplyButton.click();
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error clicking Easy Apply button:", error);
          return false;
        }
      }

      function handleForm() {
        let continueLoop = true;
        let iterations = 0;
        const maxIterations = 10;
        const delayAfterClick = 1000; // Delay in milliseconds

        function processForm() {
          if (!continueLoop || iterations >= maxIterations) return;

          try {
            const formDetails = collectFormDetails();
            chrome.storage.local.set({ formDetails });

            if (areAllRequiredFieldsFilled(formDetails)) {
              handleButtonClicks();
            } else {
              console.log("Not all required fields filled. Stopping loop.");
              continueLoop = false;
            }
          } catch (error) {
            console.error("Form handling error:", error);
            continueLoop = false;
          }
        }

        function collectFormDetails() {
          function extractDropdowns(formDetails) {
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
              formDetails.push({
                type: "dropdown",
                label,
                options,
                selectedValue,
                required: isRequired,
              });
            });
          }

          function extractTextFields(formDetails) {
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
              formDetails.push({
                type: "text",
                label,
                value,
                required: isRequired,
              });
            });
          }

          const formDetails = [];
          extractDropdowns(formDetails);
          extractTextFields(formDetails);
          console.log("Form Details:", formDetails);
          return formDetails;
        }

        function areAllRequiredFieldsFilled(formDetails) {
          return formDetails.every(
            (field) => !field.required || field.value || field.selectedValue
          );
        }

        function handleButtonClicks() {
          console.log(
            "All required fields filled. Attempting to click next button."
          );
          const nextClicked = clickNextButton();
          if (nextClicked) {
            checkForErrors().then((noErrors) => {
              if (noErrors) {
                iterations++;
                setTimeout(processForm, delayAfterClick); // Delay before next iteration
              } else {
                console.log("Error detected. Stopping loop.");
                continueLoop = false;
              }
            });
          } else {
            console.log(
              "Next button not found. Attempting to click submit button."
            );
            const submitClicked = clickSubmitButton();
            if (submitClicked) {
              console.log("Form submitted successfully.");
              continueLoop = false; // Stop the loop after submission
            } else {
              console.log("Submit button not found. Stopping loop.");
              continueLoop = false;
            }
          }
        }

        function clickNextButton() {
          const nextButtonSelector =
            ".jobs-easy-apply-modal footer button[aria-label*='next'], footer button[aria-label*='Review']";
          const enabledButtonSelector =
            ".jobs-easy-apply-modal footer button[aria-label*='Submit']:enabled, .jobs-easy-apply-modal footer button[aria-label*='next']:enabled, .jobs-easy-apply-modal footer button[aria-label*='Review']:enabled";

          const nextButton = document.querySelector(nextButtonSelector);
          if (nextButton) {
            nextButton.click();

            // Wait for the enabled button to appear
            const checkEnabledButton = () => {
              const enabledButton = document.querySelector(
                enabledButtonSelector
              );
              if (enabledButton) {
                console.log("Enabled button found.");
                return true;
              } else {
                console.log("Waiting for enabled button...");
                setTimeout(checkEnabledButton, 1000); // Check every second
              }
            };

            checkEnabledButton();
            return true;
          }
          console.log("Next button not found");
          return false;
        }

        function clickSubmitButton() {
          const submitButtonSelector =
            ".jobs-easy-apply-modal footer button[aria-label*='Submit']";
          const submitButton = document.querySelector(submitButtonSelector);
          if (submitButton) {
            submitButton.click();
            return true;
          }
          console.log("Submit button not found");
          return false;
        }

        function checkForErrors() {
          return new Promise((resolve) => {
            setTimeout(() => {
              const errorElement = document.querySelector(
                "div[id*='error'] div[class*='error']"
              );
              if (errorElement) {
                console.log("Error detected on the page.");
                resolve(false);
              } else {
                console.log("No errors detected.");
                resolve(true);
              }
            }, 1000); // Check for errors after a short delay
          });
        }

        processForm();
      }
    },
  });
}
