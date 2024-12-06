import axios from "axios";

const CHATGPT_API_URL = "https://api.openai.com/v1/chat/completions";
const CHATGPT_MODEL = "gpt-3.5-turbo";

export const postChatGptMessage = async (message, openAiKey) => {
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
