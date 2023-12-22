const { Translate } = require("@google-cloud/translate").v2;

require("dotenv").config();

const googleTranslate = async (req, res) => {
  let credentials;
  try {
    credentials = JSON.parse(process.env.CREDENTIALS);
  } catch (error) {
    console.error("Error parsing credentials:", error);
    process.exit(1); // Exit if credentials cannot be parsed
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
      console.log(`Error at translateText --> ${error}`);
      return 0;
    }
  };

  translateText(req.body.text, req.body.lang)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

export default googleTranslate;
