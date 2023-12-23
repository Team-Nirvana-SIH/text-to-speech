const axios = require("axios");

async function chatResponseApiCall(prompt) {
  try {
    const response = await axios.post(
      "https://c267-2409-40d2-1019-d479-6230-8f2a-23b0-9e08.ngrok-free.app/chat_responses",
      { prompt } // Send the prompt in the request body
    );
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error calling chat response API:", error);
    throw error;
  }
}

module.exports = chatResponseApiCall;
