const asyncHandler = require("express-async-handler");
const express = require("express");
const router = express.Router();
const {
  fetchDescription,
  registerPlace,
  // translateText,
  // startSpeechRecognition,
} = require("../controllers/objectControllers");
const translate = require("google-translate-api");

// sampleTextToBeConvertedIntoTamil =
//   "As you explore the vibrant city of Chennai, nestled in Tamil Nadu, India, the San Thome Church, also known as St. Thomas Cathedral Basilica, stands as a profound testament to history and faith. Erected in the Santhome neighborhood, this church holds deep-rooted significance within the Catholic Church in India.";
// Function to translate text
// Function to handle the translation request

// async function translateAndSpeak(req, res) {
//   try {
//     // Use a query parameter or route parameter to get the text
//     const text = req.query.text || sampleTextToBeConvertedIntoTamil;

//     const translatedText = await translateText(text);
//     res.json({ translatedText });
//   } catch (err) {
//     console.error("Translation error:", err);
//     res.status(500).json({ error: "Translation failed" });
//   }
// }

// // Place specific routes before the generic /:id route
// router.get("/translate", asyncHandler(translateAndSpeak));

// Other specific routes...
// router.get("/speech-recognition", asyncHandler(startSpeechRecognition));

// Generic /:id route should come after all specific routes
router.get("/:id", asyncHandler(fetchDescription));
router.post("/", asyncHandler(registerPlace));
router.post("/translate", asyncHandler(translate));
module.exports = router;
