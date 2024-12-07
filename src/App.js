import React, { useState, useEffect } from "react";
import Generator from "./components/generator/Generator";
import Profile from "./components/Profile";
import { ROUTES } from "./utils/routes";
import { getFromStorage, STORAGE_KEYS } from "./utils/localStorage";

function App() {
  const [page, setPage] = useState(ROUTES.GENERATOR);
  const [openAiKey, setOpenAiKey] = useState("");
  const [resumeText, setResumeText] = useState("");

  useEffect(() => {
    // Load saved data on component mount
    const loadStoredData = async () => {
      try {
        const [storedKey, storedResume] = await Promise.all([
          getFromStorage(STORAGE_KEYS.OPENAI_KEY),
          getFromStorage(STORAGE_KEYS.RESUME_TEXT),
        ]);

        if (storedKey) setOpenAiKey(storedKey);
        if (storedResume) setResumeText(storedResume);
      } catch (error) {
        console.error("Failed to load stored data:", error);
      }
    };

    loadStoredData();
  }, []);

  return (
    <>
      {page === ROUTES.GENERATOR && (
        <Generator
          onSettingsClick={() => setPage(ROUTES.PROFILE)}
          resume={resumeText}
          openAiKey={openAiKey}
        />
      )}
      {page === ROUTES.PROFILE && (
        <Profile
          onBackClick={() => setPage(ROUTES.GENERATOR)}
          resumeText={resumeText}
          openAiKey={openAiKey}
          setOpenAiKey={setOpenAiKey}
          setResumeText={setResumeText}
        />
      )}
    </>
  );
}

export default App;
