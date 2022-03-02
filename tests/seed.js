const QuestionModel = require("../models/question");
const UserModel = require("../models/user");
const ScoreModel = require("../models/score");

// Function for creating and accessing a user
const createUser = async (email) => {
  const userObject = {
    email: email || "test@test.com",
    password: "!password",
    firstName: "Testy",
    lastName: "Test",
    userType: "Student",
    createdAt: new Date(),
    modifiedAt: new Date(),
  };
  const userResponse = new UserModel(userObject);
  const user = await userResponse.save();
  return {
    user,
    userObject,
  };
};

// Function for creating and accessing a question
const createQuestion = async (title) => {
  const questionObject = {
    question: title || "Do you know the muffin man?",
    answers: [
      ["Who lives in Drury Lane?", 1],
      ["Nope", 0],
    ],
    topics: ["General"],
    type: "multiple-choice",
  };
  const questionResponse = new QuestionModel(questionObject);
  const question = await questionResponse.save();
  return {
    question,
    questionObject,
  };
};

// Function for creating and accessing a score using a user and question
const createScore = async (userId, questionId) => {
  const scoreObject = {
    userId,
    questionId,
    isCorrect: false,
  };

  const scoreResponse = new ScoreModel(scoreObject);
  const score = await scoreResponse.save();
  return {
    score,
    scoreObject,
  };
};

const seedQuestionsCollection = async () => {
  await createQuestion("Seed");
  await createQuestion("Seed");
  await createQuestion("Seed");
};

const seedUsersCollection = async () => {
  await createUser("chris@test.com");
  await createUser("lambeau@test.com");
  await createUser("loki@test.com");
};

module.exports = {
  createUser,
  createQuestion,
  createScore,
  seedQuestionsCollection,
  seedUsersCollection,
};
