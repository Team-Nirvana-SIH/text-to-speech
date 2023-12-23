const speech = require("@google-cloud/speech");
const record = require("node-record-lpcm16");
const chatResponseApiCall = require("./path/to/chatResponseApiCall"); // Make sure to use the correct path

const googleCloudConfig = {
  projectId: "verdant-bulwark-408509", // Replace with your project ID
  keyFilename: "./verdant-bulwark-408509-e5e9b224f85c.json", // Replace with the path to your key file
};

const client = new speech.SpeechClient(googleCloudConfig);

async function transcribeFromMicrophone() {
  const request = {
    config: {
      encoding: "LINEAR16",
      sampleRateHertz: 16000,
      languageCode: "en-IN",
    },
    interimResults: false,
  };

  return new Promise((resolve, reject) => {
    let finalTranscript = "";
    const recognizeStream = client
      .streamingRecognize(request)
      .on("error", (error) => {
        console.error("Error in recognizeStream:", error);
        reject(error);
      })
      .on("data", (data) => {
        if (data.results[0] && data.results[0].alternatives[0]) {
          finalTranscript += data.results[0].alternatives[0].transcript + "\n";
        }
      });

    const recording = record
      .record({
        sampleRateHertz: 16000,
        threshold: 0,
        recordProgram: "rec", // Try 'arecord' or 'sox' if 'rec' doesn't work
        silence: "10.0",
      })
      .stream()
      .on("error", (error) => {
        console.error("Error in recording stream:", error);
        reject(error);
      })
      .pipe(recognizeStream);

    console.log("Listening, press Ctrl+C to stop.");

    setTimeout(async () => {
      recording.unpipe();
      record.stop();

      try {
        const response = await chatResponseApiCall(finalTranscript);
        console.log("Chat response received:", response);
        resolve(response);
      } catch (error) {
        console.error("Error in chat response:", error);
        reject(error);
      }
    }, 5000); // Duration of recording in milliseconds
  });
}

module.exports = transcribeFromMicrophone;
