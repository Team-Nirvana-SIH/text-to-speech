const record = require("node-record-lpcm16");

const fs = require("fs");
const speech = require("@google-cloud/speech");
const chatResponseApiCall = require("./chatResponseApiCall"); // Make sure the path is correct

const speechClient = new speech.SpeechClient({
  keyFilename: "../verdant-bulwark-408509-e5e9b224f85c.json", // Replace with your credentials file path
});

const RECORD_TIME_MS = 5000; // Record for 5 seconds
const AUDIO_FILE = "recorded_audio.wav";

async function recordAudio() {
  console.log("Recording started...");
  const file = fs.createWriteStream(AUDIO_FILE, { encoding: "binary" });

  record
    .start({
      sampleRateHertz: 16000,
      threshold: 0,
      verbose: false,
      recordProgram: "rec", // or 'arecord' or 'sox'
      silence: "10.0",
    })
    .pipe(file);

  setTimeout(() => {
    record.stop();
    console.log("Recording stopped.");
    transcribeAndSend();
  }, RECORD_TIME_MS);
}

async function transcribeAndSend() {
  const file = fs.readFileSync(AUDIO_FILE);
  const audioBytes = file.toString("base64");

  const request = {
    audio: { content: audioBytes },
    config: {
      encoding: "LINEAR16",
      sampleRateHertz: 16000,
      languageCode: "en-US",
    },
  };

  try {
    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");
    console.log(`Transcription: ${transcription}`);
    sendTranscriptionToChatApi(transcription);
  } catch (err) {
    console.error("Error transcribing audio:", err);
  }
}

async function sendTranscriptionToChatApi(transcription) {
  try {
    const response = await chatResponseApiCall(transcription);
    console.log("Response from chat API:", response);
  } catch (error) {
    console.error("Error sending transcription to chat API:", error);
  }
}

recordAudio();
