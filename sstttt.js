const speech = require("@google-cloud/speech");
const record = require("node-record-lpcm16");

const client = new speech.SpeechClient();
const googleCloudConfig = {
  projectId: "verdant-bulwark-408509", // Replace with your project ID
  keyFilename: "./verdant-bulwark-408509-e5e9b224f85c.json", // Replace with the path to your key file
};

async function main() {
  const request = {
    config: {
      encoding: "LINEAR16",
      sampleRateHertz: 16000,
      languageCode: "en-US",
    },
    interimResults: false, // If you want interim results, set this to true
  };

  const recognizeStream = client
    .streamingRecognize(request)
    .on("error", console.error)
    .on("data", (data) =>
      console.log(
        `Transcription: ${
          data.results[0] && data.results[0].alternatives[0]
            ? data.results[0].alternatives[0].transcript
            : "Unable to transcribe"
        }`
      )
    );

  // Start recording and send the microphone input to the Speech API
  record
    .record({
      sampleRateHertz: 16000,
      threshold: 0,
      // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
      verbose: false,
      recordProgram: "rec", // Try also "arecord" or "sox"
      silence: "10.0",
    })
    .stream()
    .on("error", console.error)
    .pipe(recognizeStream);

  console.log("Listening, press Ctrl+C to stop.");
}

main().catch(console.error);
