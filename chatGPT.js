const express = require("express");
const axios = require("axios");

const app = express();
const port = 3000; // Choose any available port

// Middleware to parse JSON requests
app.use(express.json());

// POST endpoint to handle incoming questions
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body; // Assuming you're sending the question in the request body

    // Make a POST request to the OpenAI GPT-3.5 Chat API with your question
    const response = await axios.post(
      "	https://api.openai.com/v1/chat/completions", // Endpoint for GPT-3.5 Chat API
      {
        prompt: question, // Send the question as a prompt to the API
        max_tokens: 100, // Adjust based on the length of expected responses
        model: "gpt-3.5-turbo",
        // Add any other necessary parameters based on OpenAI's API documentation
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer asst_oZMcKm21qPYxeWT84Pc848A1", // Replace with your API key
        },
      }
    );

    const answer = response.data.choices[0].text.trim(); // Extract the generated response

    res.json({ answer }); // Send the response as JSON
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "An error occurred" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
