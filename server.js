//Testing file
const bodyParser = require("body-parser");
const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();

connectDb();
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());

// app.use(bodyParser.json);

// -------------------------------------------------

app.use("/api/object", require("./routes/objectRoutes"));
app.use(errorHandler);
app.listen(port, () => {
  console.log(`server is running on port ${port}...`);
});
