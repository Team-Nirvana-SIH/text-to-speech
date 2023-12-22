const puppeteer = require('puppeteer');

async function runSpeechRecognition() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Function to be evaluated in the browser context
    const speechRecognitionFunction = () => {
        return new Promise((resolve, reject) => {
            const recognition = new webkitSpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.onresult = (event) => resolve(event.results[0][0].transcript);
            recognition.onerror = (event) => reject(event.error);
            recognition.start();
        });
    };

    try {
        // Run the speech recognition function in the headless browser
        const result = await page.evaluate(speechRecognitionFunction);
        console.log(`Transcribed Text: ${result}`);
    } catch (error) {
        console.error(`Speech recognition error: ${error}`);
    } finally {
        await browser.close();
    }
}

runSpeechRecognition().catch(console.error);
