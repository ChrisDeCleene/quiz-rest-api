const mongoose = require("mongoose");
const supertest = require("supertest");
const createServer = require("../server");

const QuestionModel = require("../models/question");
const UserModel = require("../models/user");
const ScoreModel = require("../models/score");

const { MONGO_TEST_URL } = require("../config");
const {
  createUser,
  createQuestion,
  createScore,
  seedQuestionsCollection,
  seedUsersCollection,
} = require("./seed");

// Middleware for emptying out a collection of documents between tests
const removeAllCollections = async () => {
  const collections = Object.keys(mongoose.connection.collections);
  for (let collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    return collection.deleteMany();
  }
};

// Middleware for deleting collections after tests run
const dropAllCollections = async () => {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    try {
      const collection = mongoose.connection.collections[collectionName];
      await collection.drop();
    } catch (error) {
      // This error happens when you try to drop a collection that's already dropped. Happens infrequently.
      // Safe to ignore.
      if (error.message === "ns not found") return;

      // This error happens when you use it.todo.
      // Safe to ignore.
      if (error.message.includes("a background operation is currently running"))
        return;

      console.log(error.message);
    }
  }
};

// Set up mongodb connection before starting tests
beforeAll((done) => {
  mongoose.connect(
    MONGO_TEST_URL,
    {
      useNewUrlParser: true,
    },
    () => done()
  );
});

// Drop entire testing collection before disconnecting from MongoDB
afterAll(async () => {
  await dropAllCollections();
  await mongoose.connection.close();
});

describe("User Model", () => {
  test("should create a user with email, password, firstName, lastName, userType, createdAt and modifiedAt properties", async () => {
    const { user, userObject } = await createUser();
    expect(user.email).toEqual(userObject.email);
    expect(user.password).toEqual(userObject.password);
    expect(user.firstName).toEqual(userObject.firstName);
    expect(user.userType).toEqual(userObject.userType);
    expect(user).toHaveProperty("createdAt");
    expect(user).toHaveProperty("modifiedAt");
  });
});

describe("Question Model", () => {
  test("should create a question with question, answers, topics, and type", async () => {
    const { question, questionObject } = await createQuestion();
    expect(question._id).toBeTruthy();
    expect(question.question).toEqual(questionObject.question);
    expect(question.answers).toEqual(questionObject.answers);
    expect(question.topics).toEqual(questionObject.topics);
    expect(question.type).toEqual(questionObject.type);
  });
});

describe("Score Model", () => {
  test("should create a score using a user and question document", async () => {
    const { user } = await createUser("chris@test.com");

    const { question } = await createQuestion();

    const { score, scoreObject } = await createScore(user._id, question._id);

    expect(score._id).toBeTruthy();
    expect(score.userId).toEqual(user._id);
    expect(score.questionId).toEqual(question._id);
    expect(score.isCorrect).toEqual(scoreObject.isCorrect);
  });
});

describe("GET /api/questions", () => {
  beforeAll(async () => {
    await dropAllCollections();
    await seedQuestionsCollection();
  });
  test("should return an array of all questions", async () => {
    const app = await createServer();
    await supertest(app)
      .get("/questions")
      .expect(200)
      .then((response) => {
        const questions = response.body.questions;
        expect(questions.length).toEqual(3);
        expect(questions[0]).toHaveProperty("_id");
        expect(questions[0]).toHaveProperty("question");
        expect(questions[0]).toHaveProperty("answers");
        expect(questions[0]).toHaveProperty("topics");
        expect(questions[0]).toHaveProperty("type");
      });
  });
  test("should return a status code of 200", async () => {
    const app = await createServer();
    await supertest(app).get("/questions").expect(200);
  });
});

describe("GET /api/questions/:id", () => {
  beforeAll(async () => {
    await dropAllCollections();
    await seedQuestionsCollection();
  });
  test("should return the question object for the given ID", async () => {
    const { question } = await createQuestion(
      "What is the average weight of an elephant?"
    );

    const app = await createServer();

    await supertest(app)
      .get("/questions/" + question.id)
      .then((response) => {
        const newQuestion = response.body.question;
        expect(newQuestion._id).toBe(question.id);
        expect(newQuestion.question).toBe(question.question);
        expect(newQuestion.answers[0][0]).toBe(question.answers[0][0]);
        expect(newQuestion.answers[0][0] instanceof String).toBeTruthy;
        expect(newQuestion.answers[0][1] instanceof Number).toBeTruthy;
        expect(newQuestion.topics[0]).toBe(question.topics[0]);
        expect(newQuestion.type).toBe(question.type);
      });
  });
  test("should return a 200 status code for valid IDs", async () => {
    const { question } = await createQuestion(
      "What is the average weight of an elephant?"
    );

    const app = await createServer();

    await supertest(app)
      .get("/questions/" + question.id)
      .expect(200);
  });
  test("should return a 404 status code for invalid IDs", async () => {
    const questionId = "61fd574bf78fad302968ee70";

    const app = await createServer();

    await supertest(app)
      .get("/questions/" + questionId)
      .expect(404);
  });
});

describe("POST /api/questions", () => {
  beforeAll(async () => {
    await dropAllCollections();
  });
  test("should create a valid question", async () => {
    const newQuestion = {
      question: "Buddy the elf, what's your favorite color?",
      answers: [
        ["red", 0],
        ["blue", 0],
        ["brown, the color of the world's best cup of coffee", 1],
        ["white", 0],
      ],
      topics: ["General"],
      type: "multiple-choice",
    };
    const app = await createServer();
    await supertest(app)
      .post("/questions")
      .send({ question: newQuestion })
      .then(async (response) => {
        const question = await QuestionModel.findOne();
        expect(response.body.question._id).toEqual(question.id);
        expect(question).toHaveProperty("_id");
        expect(question).toHaveProperty("question");
        expect(question).toHaveProperty("answers");
        expect(question).toHaveProperty("topics");
        expect(question).toHaveProperty("type");
      });
  });
  test("should return a 201 status code after question creation", async () => {
    const newQuestion = {
      question: "Buddy the elf, what's your favorite color?",
      answers: [
        ["red", 0],
        ["blue", 0],
        ["brown, the color of the world's best cup of coffee", 1],
        ["white", 0],
      ],
      topics: ["General"],
      type: "multiple-choice",
    };

    const app = await createServer();

    await supertest(app)
      .post("/questions")
      .send({ question: newQuestion })
      .expect(201);
  });
  test("should return he newly-created question after employee creation", async () => {
    const questionObject = {
      question: "Buddy the elf, what's your favorite color?",
      answers: [
        ["red", 0],
        ["blue", 0],
        ["brown, the color of the world's best cup of coffee", 1],
        ["white", 0],
      ],
      topics: ["General"],
      type: "multiple-choice",
    };
    const app = await createServer();
    await supertest(app)
      .post("/questions")
      .send({ question: questionObject })
      .then((response) => {
        const question = response.body.question;
        expect(question).toHaveProperty("_id");
        expect(question).toHaveProperty("question");
        expect(question).toHaveProperty("answers");
        expect(question).toHaveProperty("topics");
        expect(question).toHaveProperty("type");
      });
  });
  test("should return a 400 status code for invalid question", async () => {
    const newQuestion = {
      question: "Buddy the elf, what's your favorite color?",
      answers: [
        ["red", 0],
        ["blue", 0],
        ["brown, the color of the world's best cup of coffee", 1],
        ["white", 0],
      ],
    };

    const app = await createServer();

    await supertest(app)
      .post("/questions")
      .send({ question: newQuestion })
      .expect(400);
  });
});
