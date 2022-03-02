const { Schema, model } = require("mongoose");

const Score = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  questionId: { type: Schema.Types.ObjectId, ref: "Question" },
  isCorrect: { type: Boolean },
});

module.exports = model("Score", Score);
