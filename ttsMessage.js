const textToSpeech = require("@google-cloud/text-to-speech");
const exec = require("child_process").exec;

const textToSpeechAndPlay = async (req, res) => {
  const text = req.body.text;
  if (!text) {
    console.error("No text provided");
    return;
  }

  const ttsClient = new textToSpeech.TextToSpeechClient();

  const request = {
    input: { text: text },
    voice: { languageCode: "ta-IN", ssmlGender: "NEUTRAL" },
    audioConfig: { audioEncoding: "MP3" },
  };

  try {
    const [response] = await ttsClient.synthesizeSpeech(request);
    const audioContent = response.audioContent;

    exec(
      ` echo "${audioContent.toString(
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
  } finally {
    res.status(200).json({ message: "Text to Speech and audio played" });
    ttsClient.close();
  }
};

// Example usage
// textToSpeechAndPlay("Hello, this is a test of the Text to Speech service.");

module.exports = textToSpeechAndPlay; // export default textToSpeechAndPlay;
