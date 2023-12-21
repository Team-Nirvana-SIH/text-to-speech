const asyncHandler = require("express-async-handler");
const { constants } = require("../helper/constants");
const textToSpeech = require("@google-cloud/text-to-speech");
require("dotenv").config();
const fs = require("fs");
const { exec } = require("child_process");
const Objects = require("./models/objectModels");

const textToSpeech = asyncHandler(async (req, res) => {
  try {
    const object = await Objects.findById(req.params.id);
    if (!object) {
      res.status(constants.NOT_FOUND);
      throw new Error("invalid QR");
    }
    res.status(constants.SUCCESS);

    //text to speech

    const client = new textToSpeech.TextToSpeechClient();

    async function convertTextToMp3() {
      const text = object.description; // Add missing closing quote

      const request = {
        input: { text: text },
        voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
        audioConfig: { audioEncoding: "MP3" },
      };

      try {
        const [response] = await client.synthesizeSpeech(request);
        const audioContent = response.audioContent;

        // Use 'play-sound' to play audio content directly
        exec(
          `echo "${audioContent.toString(
            "base64"
          )}" | base64 --decode | play -t mp3 -`,
          (error) => {
            if (error) {
              console.error("Error playing audio:", error);
            } else {
              console.log("Text to Speech has completed. Audio played.");
            }
          }
        );
      } catch (err) {
        console.error("Error occurred:", err);
      }
    }
    // convertTextToMp3();
    //   const speech = require("@google-cloud/text-to-speech");
  } catch (err) {
    res.status(constants.SERVER_ERROR);
    throw new Error(err.message);
  }
});
