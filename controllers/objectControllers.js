const asyncHandler = require("express-async-handler");
const { constants } = require("../helper/constants");
const { exec } = require("child_process");
const Object = require("../models/objectModels");

// Import Text-to-Speech only if it's being used
const textToSpeech = require("@google-cloud/text-to-speech");

async function convertTextToMp3(newObject, res) {
  if (!newObject) {
    res.status(constants.NOT_FOUND).json({ message: "Object not found" });
    return;
  }

  const text = newObject.description;
  const ttsClient = new textToSpeech.TextToSpeechClient();

  const request = {
    input: { text: text },
    voice: { languageCode: "en-IN", ssmlGender: "NEUTRAL" },
    audioConfig: { audioEncoding: "MP3" },
  };

  try {
    const [response] = await ttsClient.synthesizeSpeech(request);
    const audioContent = response.audioContent;

    exec(
      `echo "${audioContent.toString(
        "base64"
      )}" | base64 --decode | play -t mp3 -`,
      (error) => {
        if (error) {
          console.error("Error playing audio:", error);
          res
            .status(constants.SERVER_ERROR)
            .json({ message: "Error playing audio" });
        } else {
          console.log("Text to Speech has completed. Audio played.");
          res.status(constants.SUCCESS).json({ message: "Audio played" });
        }
      }
    );
  } catch (err) {
    console.error("Error occurred:", err);
    res
      .status(constants.SERVER_ERROR)
      .json({ message: "Error in text to speech conversion" });
  }
}

const fetchDescription = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      res
        .status(constants.VALIDATION_ERROR)
        .json({ message: "Invalid QR code" });
      return;
    }

    const newObject = await Object.findOne({ _id: id });
    if (!newObject) {
      res.status(constants.NOT_FOUND).json({ message: "Object not found" });
      return;
    }

    await convertTextToMp3(newObject, res);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(constants.SERVER_ERROR).json({ message: "Server error" });
  }
});

const registerPlace = asyncHandler(async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      res
        .status(constants.VALIDATION_ERROR)
        .json({ message: "Please add all fields" });
      return;
    }

    const newObject = await Object.create(req.body);
    res.status(constants.CREATED).json(newObject);
  } catch (err) {
    console.error("Error occurred:", err);
    res
      .status(constants.SERVER_ERROR)
      .json({ message: "Error creating new object" });
  }
});

function speech_openAI_text() {}
module.exports = { fetchDescription, registerPlace };
