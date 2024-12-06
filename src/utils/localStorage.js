/*global chrome*/

/**
 * Checks if the application is running as a Chrome extension
 * @returns {boolean}
 */
const isChromeExtension = () => {
  return !!chrome?.storage?.local;
};

/**
 * Saves data to Chrome extension's local storage
 * @param {string} key - The key to store the data under
 * @param {any} value - The value to store
 * @returns {Promise} - Resolves when data is saved
 */
export const saveToStorage = async (key, value) => {
  if (!isChromeExtension()) {
    return Promise.resolve(localStorage.setItem(key, JSON.stringify(value)));
  }

  try {
    return chrome.storage.local.set({ [key]: value });
  } catch (error) {
    console.error("Error saving data:", error);
    throw error;
  }
};

/**
 * Retrieves data from Chrome extension's local storage
 * @param {string} key - The key to retrieve data for
 * @returns {Promise<any>} - Resolves with the retrieved value
 */
export const getFromStorage = async (key) => {
  if (!isChromeExtension()) {
    console.warn("Storage operations are only available in Chrome extensions");
    return Promise.resolve(JSON.parse(localStorage.getItem(key)));
  }

  try {
    const result = await chrome.storage.local.get(key);
    return result[key];
  } catch (error) {
    console.error("Error retrieving data:", error);
    throw error;
  }
};

/**
 * Storage keys used in the application
 */
export const STORAGE_KEYS = {
  OPENAI_KEY: "openai_key",
  RESUME_TEXT: "resume_text",
};
