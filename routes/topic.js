const express = require("express");
const { isAuth } = require("../lib/authMiddleware");
const QuestionModel = require("../models/question");
const router = express.Router();

module.exports = (app) => {
  app.use("/topics", router);

  /**
   * @swagger
   * definitions:
   *  Question:
   *    properties:
   *      question:
   *        type: string
   *      answers:
   *        type: array
   *        properties:
   *          answer:
   *            type: string
   *          isCorrect:
   *            type: boolean
   *      topics:
   *        type: array
   *        properties:
   *          topic:
   *            type: string
   */

  /**
   * @swagger
   * /topics:
   *  get:
   *    tags:
   *      - Questions
   *    description: Returns all topics
   *    produces:
   *      - application/json
   *    responses:
   *      200:
   *        description: An array of topic names
   *        schema:
   *          $ref: "#/definitions/Question"
   */
  router.get("/", async (req, res, next) => {
    await QuestionModel.collection.distinct(
      "topics",
      (error, topics) => {
        if (error) {
          throw new Error(error);
        } else {
          res.send({ topics });
        }
      }
    );
  });

  /**
   * @swagger
   * /topics/{topicName}:
   *  get:
   *    tags:
   *      - Questions
   *    description: Returns all questions for the given topic
   *    produces:
   *      - application/json
   *    parameters:
   *      - name: id
   *        description: Question's id
   *        in: path
   *        required: true
   *        type: string
   *    responses:
   *      200:
   *        description: An array of questions
   *        schema:
   *          $ref: "#/definitions/Question"
   */
  router.get("/:topicName", async (req, res, next) => {
    console.log(req.params.topicName)
    const topic = await QuestionModel.find({
      topics: { $in: [req.params.topicName] },
    });
    if (!topic) {
      return res.sendStatus(404);
    } else {
      return res.send({ topic });
    }
  });

};
