const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");
const util = require("util");
const { exec } = require("child_process");

const client = new textToSpeech.TextToSpeechClient({
  keyFilename: "./verdant-bulwark-408509-e5e9b224f85c.json", // Replace with the path to your key file
});

async function textToSpeechAndPlay(text) {
  const request = {
    input: { text: text },
    voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
    audioConfig: { audioEncoding: "MP3" },
  };

  try {
    // Performs the Text-to-Speech request
    const [response] = await client.synthesizeSpeech(request);
    const writeFile = util.promisify(fs.writeFile);
    const fileName = "output.mp3";

    // Write the binary audio content to a local file
    await writeFile(fileName, response.audioContent, "binary");
    console.log(`Audio content written to file: ${fileName}`);

    // Play the audio using SoX
    exec(`play ${fileName}`, (error, stdout, stderr) => {
      if (error) {
        console.error("Error playing file:", error);
      } else {
        console.log("Playback finished.");
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

module.exports = textToSpeechAndPlay;
// Usage example
// textToSpeechAndPlay("Hello, this is a test using Google Cloud Text-to-Speech.");
