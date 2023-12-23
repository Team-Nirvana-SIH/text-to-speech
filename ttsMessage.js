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
    voice: { languageCode: "ta-IN", ssmlGender: "NEUTRAL" },
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
textToSpeechAndPlay(
  "ொ.ஊ. 1631 ஆம் ஆண்டில், முகலாயப் பேரரசின் உயர்நிலையில் அப்பேரரசை ஆண்ட ஷா ஜகானின் மூன்றாம் மனைவி மும்தாஜ், அவர்களது 14 ஆவது பிள்ளையான குகாரா பேகம் பிறந்தபோது இறந்துவிட்டாள். பெருந் துயரம் அடைந்த மன்னன் அவளது நினைவாக இந்தக் கட்டிடத்தைக் கட்டத் தொடங்கியதாகவே அவனது வரலாற்றுக் கதைகள் கூறுகின்றன. மும்தாஜ் இறந்த அதே ஆண்டிலேயே தாஜ்மகாலின் கட்டிட வேலைகள் தொடங்கின. முதன்மைக் கட்டிடம் 1648 இல் கட்டி முடிக்கப்பட்டது. சூழவுள்ள கட்டிடங்கள், பூங்கா ஆகியவற்றின் கட்டிட வேலைகள் ஐந்து ஆண்டுகள் கழித்தே நிறைவேறின. பேரரசன் ஷாஜகானே இக் கட்டிடத்தைப் பற்றிப் பின்வருமாறு கூறியதாகச் சொல்லப்படுகின்றது:[சான்று தேவை"
);

module.exports = textToSpeechAndPlay;
