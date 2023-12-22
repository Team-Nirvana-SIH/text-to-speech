const textToSpeech = require("@google-cloud/text-to-speech");
const exec = require('child_process').exec;

async function textToSpeechAndPlay(text) {
  if (!text) {
    console.error("No text provided");
    return;
  }

  const ttsClient = new textToSpeech.TextToSpeechClient();

  const request = {
    input: { text: text },
    voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
    audioConfig: { audioEncoding: "MP3" },
  };

  try {
    const [response] = await ttsClient.synthesizeSpeech(request);
    const audioContent = response.audioContent;

    exec(
     ` echo "${audioContent.toString("base64")}" | base64 --decode | play -t mp3 -`,
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

// Example usage
textToSpeechAndPlay("Hello, this is a test of the Text to Speech service.");