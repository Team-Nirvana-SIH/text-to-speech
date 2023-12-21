const mongoose = require("mongoose");

const objectSchema = new mongoose.Schema(
  {
    //UNIQUE ID, CAN BE USED FOR DATA MANIPULATIONS
    object_id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    name: {
      type: String,
      require: [true, "Please add the object name"],
    },
    description: {
      type: String,
      require: [true, "Please add the object description"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Object", objectSchema, "smartGlass");
