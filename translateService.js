const express = require("express");
const app = express();
const port = 9002;
const googleTranslate = require("./translate");

app.use(express.json());

app.post("/translate", googleTranslate);

app.listen(9002, () => {
  console.log(`Translate service running on port ${port}`);
});

module.exports = app;
