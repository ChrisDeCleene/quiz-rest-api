const { Schema, model } = require("mongoose");

const Question = new Schema({
  question: {
    type: String,
    required: true,
  },
  answers: [[Schema.Types.Mixed]],
  topics: [{ type: String, required: true }],
  type: {
    type: String,
    required: true,
  },
});

module.exports = model("Question", Question);
