const TopicModel = require("../models/topic");

module.exports = class QuestionService {
  constructor(question, answers) {
    this.question = question;
    this.answers = answers || [];
  }
  async create(topicId) {
    const topic = await TopicModel.findByIdAndUpdate(topicId);
    topic.questions.push({
      question: this.question,
      answers: this.answers,
    });
    topic.save();
    return topic;
  }
  // find question by questionId
  // update question by questionId
  // delete question by questionId
  // static async deleteById(topicId, questionId) {

  // }
};
