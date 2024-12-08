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

/**
 * Executes the Easy Apply automation script in the specified tab.
 * This function injects and runs a content script that handles the LinkedIn Easy Apply process,
 * including clicking the apply button and filling out application forms.
 *
 * @param {number} tabId - The ID of the browser tab where the script will be executed
 * @returns {Promise} A promise that resolves when the script execution is complete
 */
function executeEasyApplyScript(tabId) {
  return chrome.scripting.executeScript({
    target: { tabId },
    func: function () {
      if (clickEasyApplyButton()) {
        setTimeout(() => {
          handleForm();
        }, 2000); // Adjust timeout as needed
      }

      /**
       * Attempts to click the Easy Apply button on a LinkedIn job posting.
       * Looks for the button using a specific CSS selector and triggers a click event if found.
       *
       * @returns {boolean} Returns true if the button was found and clicked successfully,
       *                    false if the button wasn't found or if an error occurred
       */
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

      /**
       * Handles the form filling process for LinkedIn Easy Apply applications.
       * Manages a loop that processes form fields, collects details, and handles button clicks.
       * The loop continues until either all required fields are filled, an error occurs,
       * or the maximum number of iterations is reached.
       */
      function handleForm() {
        let continueLoop = true;
        let iterations = 0;
        const maxIterations = 10;
        const delayAfterClick = 1000; // Delay in milliseconds

        /**
         * Initiates the form processing loop.
         * Continues until all required fields are filled and no errors are detected,
         * or until the maximum number of iterations is reached.
         */
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

        /**
         * Collects details from dropdown and text fields in the form.
         * @returns {Array} An array of form field details.
         */
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

          /**
           * Extracts text input fields from the form and adds their details to the formDetails array.
           * Collects information about each text field including its label, value, and required status.
           * @param {Array} formDetails - The array to store the collected form field details
           */
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

        /**
         * Checks if all required fields in the form are filled.
         * @param {Array} formDetails - The details of the form fields.
         * @returns {boolean} True if all required fields are filled, otherwise false.
         */
        function areAllRequiredFieldsFilled(formDetails) {
          return formDetails.every(
            (field) => !field.required || field.value || field.selectedValue
          );
        }

        /**
         * Handles the logic for clicking the "Next" or "Submit" buttons.
         * Manages loop control based on button interactions and error detection.
         */
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

        /**
         * Attempts to click the "Next" or "Review" button in the LinkedIn Easy Apply modal.
         * Also checks for the button to become enabled after clicking.
         * @returns {boolean} True if the next button was found and clicked, false otherwise.
         */
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

        /**
         * Attempts to click the "Submit" button in the LinkedIn Easy Apply modal.
         * @returns {boolean} True if the submit button was found and clicked, false otherwise.
         */
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

        /**
         * Checks for error messages displayed in the LinkedIn Easy Apply modal.
         * @returns {Promise<boolean>} A promise that resolves to true if no errors are found, false if errors are detected.
         */
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
