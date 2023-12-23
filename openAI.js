const express = require("express");
const { Configuration, OpenAIApi } = require("openai");

// const app = express();
// const port = 3000; // You can choose any available port

// Set up Express to handle JSON body requests
// app.use(express.json());

// OpenAI API setup
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is set in environment variables
});
const openai = new OpenAIApi(configuration);

// API endpoint
app.post("/fetch-answer", async (req, res) => {
  const question = req.body.question;

  if (!question) {
    return res.status(400).json({ error: "No question provided" });
  }

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003", // Adjust model as needed
      prompt: question,
      max_tokens: 150,
    });

    res.json({
      query: question,
      answer: response.data.choices[0].text.trim(),
    });
  } catch (error) {
    console.error("Error fetching answer from OpenAI:", error);
    res.status(500).json({ error: error.message });
  }
});

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
