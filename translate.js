const { Translate } = require("@google-cloud/translate").v2;

require("dotenv").config();

const googleTranslate = async (req, res) => {
  let credentials;
  try {
    credentials = JSON.parse(process.env.CREDENTIALS);
  } catch (error) {
    console.error("Error parsing credentials:", error);
    res.status(500).send("Error parsing credentials"); // Send error response
    return;
  }

  // Configuration for the client
  const translate = new Translate({
    credentials: credentials,
    projectId: credentials.project_id,
  });

  const translateText = async (text, targetLanguage) => {
    try {
      let [response] = await translate.translate(text, targetLanguage);
      return response;
    } catch (error) {
      console.error(`Error at translateText --> ${error}`);
      throw error; // Throw the error to be caught in the outer try-catch
    }
  };

  try {
    // Assuming req.body.text and req.body.lang are provided by OpenAI's API response
    const translatedText = await translateText(req.body.text, req.body.lang);
    res.send({ translatedText }); // Send back the translated text
  } catch (error) {
    console.error(error);
    res.status(500).send("Error during translation");
  }
};

module.exports = googleTranslate; // Export the function for use in an Express app
