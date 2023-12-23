const asyncHandler = require("express-async-handler");
const express = require("express");
const router = express.Router();
const googleTranslate = require("../translate");
const chatResponseApiCall = require("../chatResponseApiCall");
// const textToSpeech = require("../ttsMessage");
const textToSpeechAndPlay = require("../ttsMessage");
const {
  fetchDescription,
  registerPlace,
} = require("../controllers/objectControllers");
// const textToSpeechAndPlay = require("../ttsMessage");

router.get("/:id", asyncHandler(fetchDescription));
router.post("/", asyncHandler(registerPlace)); // for testing
// router.post("/translate", asyncHandler(googleTranslate));
router.post(
  "/openAI",
  asyncHandler(async (req, res) => {
    try {
      const prompt = req.body.prompt; // Get the prompt from the request body
      const response = await chatResponseApiCall(prompt); // Call the function with the prompt
      res.json(response); // Send back the response
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error processing request", details: error.message });
    }
  })
);
router.post("/convert-and-play", async (req, res) => {
  try {
    await textToSpeechAndPlay(req.body.text);
    res.send("Played successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});
// router.post(
//   "/openai-query",
//   asyncHandler(async (req, res) => {
//     try {
//       const query = req.body.query;
//       const answer = await speech_openAI_text(query);
//       res.json({ answer });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   })
// );

module.exports = router;
