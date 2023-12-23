const textToSpeech = require("@google-cloud/text-to-speech");
const { spawn } = require("child_process");

const client = new textToSpeech.TextToSpeechClient({
  keyFilename: "./verdant-bulwark-408509-e5e9b224f85c.json", // Replace with the path to your key file
});

// Creates a client
// const client = new textToSpeech.TextToSpeechClient();

async function textToSpeechAndPlay(text) {
  // const reqBody = req.body.text;
  // Add reqBody as a parameter
  const request = {
    input: { text },
    voice: { languageCode: "en-IN", ssmlGender: "NEUTRAL" },
    audioConfig: { audioEncoding: "LINEAR16" }, // Use linear16 for raw audio format
  };

  try {
    // Performs the Text-to-Speech request
    const [response] = await client.synthesizeSpeech(request);

    // Spawn a sox process to play the audio
    const soxProcess = spawn("play", ["-t", "wav", "-"]);

    // Pipe the audio data to sox play
    soxProcess.stdin.write(response.audioContent);
    soxProcess.stdin.end();

    soxProcess.on("close", (code) => {
      console.log(`sox process exited with code ${code}`);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}
textToSpeechAndPlay("Hello, this is a test using Google Cloud Text-to-Speech.");

module.exports = textToSpeechAndPlay;
