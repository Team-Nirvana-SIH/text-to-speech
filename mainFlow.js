async function completeWorkflow() {
  try {
    // Step 1: Speech to Text
    const transcription = await runPythonScript();
    console.log("Transcription: ", transcription);

    // Step 2: Chat Response API Call
    const chatResponse = await chatResponseApiCall(transcription);
    console.log("Chat Response: ", chatResponse.message);

    // Step 3: Text Translation
    const translatedTextResponse = await axios.post(
      "http://localhost:9002/api/object/translate", // Assuming this is the correct port for the translation service
      {
        text: chatResponse.message,
        lang: "ta",
      }
    );
    const translatedText = translatedTextResponse.data;
    console.log("Translated Text: ", translatedText);

    // Step 4: Text to Speech
    // Now sending the request to the convert-and-play service on port 9003
    await axios.post("http://localhost:9003/convert-and-play", {
      text: translatedText,
    });
    console.log("Text to Speech conversion and playback initiated");
  } catch (error) {
    console.error("Error in complete workflow:", error);
  }
}

completeWorkflow();
