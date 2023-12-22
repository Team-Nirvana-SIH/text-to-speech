const axios = require('axios');
const { exec } = require('child_process');
const googleTranslate = require('./translate');
const textToSpeechAndPlay = require('./ttsMessage');

async function processAudioFlow() {
    try {
        // Step 1: Call Python script to perform speech-to-text
        const transcribedText = await getTranscribedText();

        // Step 2: Send transcribed text to chat response API
        const chatResponse = await axios.post('https://7b20-2401-4900-1c61-5934-bbba-9c4c-d285-8d4b.ngrok-free.app/chat_responses', {
            text: transcribedText
        });
        
        // Step 3: Translate the response
        const translatedText = await googleTranslate({ body: { text: chatResponse.data, lang: 'en' } });

        // Step 4: Convert translated text to speech and play it
        await textToSpeechAndPlay(translatedText);
    } catch (error) {
        console.error('Error in processAudioFlow:', error);
    }
}

async function getTranscribedText() {
    return new Promise((resolve, reject) => {
        exec('speechToText.py', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return reject(error);
            }
            resolve(stdout.trim());
        });
    });
}

// Execute the function
processAudioFlow();
