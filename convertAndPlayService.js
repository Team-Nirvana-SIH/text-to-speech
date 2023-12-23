const express = require("express");
const app = express();
const port = 9003;
const textToSpeechAndPlay = require("./ttsMessage");

app.use(express.json());

app.post("/convert-and-play", async (req, res) => {
  try {
    await textToSpeechAndPlay(req.body.text);
    res.send("Played successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(9003, () => {
  console.log(`Convert and Play service running on port ${port}`);
});

module.exports = app;
