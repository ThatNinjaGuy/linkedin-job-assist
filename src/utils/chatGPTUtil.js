import axios from "axios";
import { dummyCoverLetter } from "./dummyResponse";

const CHATGPT_API_URL = "https://api.openai.com/v1/chat/completions";
const CHATGPT_MODEL = "gpt-3.5-turbo";

// Flag to control whether to use ChatGPT API or return dummy data
const useChatGPT = false; // Set to true to make actual API calls

export const postChatGptMessage = async (message, openAiKey) => {
  if (!useChatGPT) {
    // Return dummy data when useChatGPT is false
    return dummyCoverLetter;
  }

  const headers = {
    Authorization: `Bearer ${openAiKey}`,
  };
  const userMessage = { role: "user", content: message };
  const chatGptMessage = {
    model: CHATGPT_MODEL,
    messages: [userMessage],
  };

  try {
    const response = await axios.post(CHATGPT_API_URL, chatGptMessage, {
      headers,
    });
    return response?.data?.choices[0]?.message?.content;
  } catch (error) {
    console.error("Error calling ChatGPT API:", error);
    return null;
  }
};
