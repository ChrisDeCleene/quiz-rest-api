const express = require("express");
const { isAuth } = require("../lib/authMiddleware");
const QuestionModel = require("../models/question");
const router = express.Router();

module.exports = (app) => {
  app.use("/api/topics", router);

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
   * /api/topics:
   *  get:
   *    tags:
   *      - Topics
   *    description: Returns all topics. *Registered users only*
   *    produces:
   *      - application/json
   *    responses:
   *      200:
   *        description: An array of all unique topic names
   *        schema:
   *          topic: object
   *          properties:
   *            topics:
   *              type: array
   *              items:
   *                type: string
   *              example:
   *                - javascript
   *                - html
   *                - sql
   *                - beginner
   */
  router.get("/", isAuth, async (req, res, next) => {
    QuestionModel.collection.distinct("topics", (error, topics) => {
      if (error) {
        throw new Error(error);
      } else {
        res.send({ topics });
      }
    });
  });

  /**
   * @swagger
   * /api/topics/{topicName}:
   *  get:
   *    tags:
   *      - Topics
   *    description: Returns all questions for the given topic. *Registered users only*
   *    produces:
   *      - application/json
   *    parameters:
   *      - name: topicName
   *        description: Topic's name
   *        in: path
   *        required: true
   *        type: string
   *    responses:
   *      200:
   *        description: An object with an array of questions for the topic
   *        schema:
   *            type: object
   *            properties:
   *              questions:
   *                type: array
   *                items:
   *                  $ref: "#/definitions/Question"
   */
  router.get("/:topicName", isAuth, async (req, res, next) => {
    const questions = await QuestionModel.find({
      topics: { $in: [req.params.topicName] },
    });
    if (!questions) {
      return res.sendStatus(404);
    } else {
      return res.send({ questions });
    }
  });
};
