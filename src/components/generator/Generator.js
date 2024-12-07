import React, { useState, useEffect } from "react";
import { getFromStorage } from "../../utils/localStorage";
import { postChatGptMessage } from "../../utils/chatGPTUtil";
import Header from "./Header";
import MainContent from "./MainContent";
import Footer from "./Footer";
import Notification from "../Notification";

function Generator({ onSettingsClick, resume, openAiKey }) {
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [roleName, setRoleName] = useState("");
  const [notificationVisible, setNotificationVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedJob = await getFromStorage("jobDescription");
      const fetchedCompanyName = await getFromStorage("companyName");
      const fetchedRoleName = await getFromStorage("roleName");
      setJobDescription(fetchedJob);
      setCompanyName(fetchedCompanyName);
      setRoleName(fetchedRoleName);
    };
    fetchData();
  }, []);

  const generateCoverLetter = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const message = `Generate a cover letter based on the following resume and job description. Ensure you are relevant. Avoid leaving placeholders to be replaced later. Act with the information you have.\n\nRESUME:\n${resume}\n\nJOB DESCRIPTION:\n${jobDescription}`;
      const chatGPTResponse = await postChatGptMessage(message, openAiKey);
      setCoverLetter(chatGPTResponse);
    } catch (error) {
      console.error("Failed to generate cover letter:", error);
      setCoverLetter("Failed to generate cover letter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter).then(
      () => {
        setNotificationVisible(true);
        setTimeout(() => setNotificationVisible(false), 2000);
      },
      (err) => {
        console.error("Failed to copy text: ", err);
      }
    );
  };

  return (
    <div className="flex flex-col h-[600px] w-[600px]">
      <Notification
        message="Cover letter copied to clipboard!"
        visible={notificationVisible}
      />
      <Header onSettingsClick={onSettingsClick} />
      <MainContent
        companyName={companyName}
        roleName={roleName}
        generateCoverLetter={generateCoverLetter}
        loading={loading}
      />
      <Footer coverLetter={coverLetter} copyToClipboard={copyToClipboard} />
    </div>
  );
}

export default Generator;
