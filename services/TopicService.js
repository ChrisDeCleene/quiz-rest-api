const TopicModel = require("../models/topic");

// const TopicModelInstance = new TopicModel();

module.exports = class TopicService {
  constructor(title, questions, createdAt) {
    this.title = title;
    this.questions = questions || [];
    this.createdAt = createdAt || new Date();
  }
  async create() {
    const newTopic = new TopicModel({
      title: this.title,
      questions: this.questions,
      createdAt: this.createdAt,
    });
    await newTopic.save().then((response) => {
      console.log("Callback", response);
    });
    return newTopic;
  }
  static async findAll() {
    return TopicModel.find();
  }
  static async findTopicById(topicId) {
    const topic = await TopicModel.findById(topicId);
    return topic;
  }
  static async deleteById(topicId) {
    const deletedTopic = await TopicModel.deleteOne({ _id: topicId });
    return deletedTopic;
  }
};
