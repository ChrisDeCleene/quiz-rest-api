const { Schema, model } = require("mongoose");

const TopicSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      answers: [
        {
          answer: {
            type: String,
          },
          isCorrect: {
            type: Boolean,
          },
        },
      ],
    },
  ],
});

module.exports = model("Topic", TopicSchema);
