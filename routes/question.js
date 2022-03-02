const express = require("express");
const { isAuth, isAdmin } = require("../lib/authMiddleware");
const QuestionModel = require("../models/question");
const router = express.Router();

module.exports = (app) => {
  app.use("/api/questions", router);

  /**
   * @swagger
   * definitions:
   *  Question:
   *    type: object
   *    properties:
   *      question:
   *        type: string
   *        example: Which is the correct answer?
   *      answers:
   *        type: array
   *        items:
   *          type: array
   *          items:
   *            - type: string
   *            - type: integer
   *          example:
   *            - [this is an incorrect answer, 0]
   *            - [this is also an incorrect answer, 0]
   *            - [this is a correct answer, 1]
   *      topics:
   *        type: array
   *        items:
   *          type: string
   *        example:
   *          - random
   *          - temporary
   *          - beginner
   *      type:
   *        type: string
   *        example: multiple-choice
   */

  /**
   * @swagger
   * /api/questions:
   *  get:
   *    tags:
   *      - Questions
   *    description: Returns all questions
   *    produces:
   *      - application/json
   *    responses:
   *      200:
   *        description: An object with an array of all questions
   *        schema:
   *            type: object
   *            properties:
   *              questions:
   *                type: array
   *                items:
   *                  $ref: "#/definitions/Question"
   */
  router.get("/", isAuth, async (req, res, next) => {
    const questions = await QuestionModel.find();
    res.send({ questions });
  });

  /**
   * @swagger
   * /api/questions:
   *  post:
   *    tags:
   *      - Questions
   *    description: Creates a new question
   *    produces:
   *      - application/json
   *    parameters:
   *      - name: question
   *        description: Question object
   *        in: body
   *        required: true
   *        schema:
   *          $ref: '#/definitions/Question'
   *    responses:
   *      201:
   *        description: Successfully created
   *        schema:
   *          $ref: "#/definitions/Question"
   */

  /**
   * @swagger
   * /api/questions/{id}:
   *  get:
   *    tags:
   *      - Questions
   *    description: Returns a single question
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
   *        description: Returns an object with a question parameter containing a single question.
   *        schema:
   *          $ref: "#/definitions/Question"
   */
  router.get("/:id", isAuth, async (req, res, next) => {
    const question = await QuestionModel.findById(req.params.id);
    if (!question) {
      return res.sendStatus(404);
    } else {
      return res.send({ question });
    }
  });

  /**
   * @swagger
   * /api/questions:
   *  post:
   *    tags:
   *      - Questions
   *    description: Creates a new question
   *    produces:
   *      - application/json
   *    parameters:
   *      - name: question
   *        description: Question object
   *        in: body
   *        required: true
   *        schema:
   *          $ref: '#/definitions/Question'
   *    responses:
   *      201:
   *        description: Successfully created
   *        schema:
   *          $ref: "#/definitions/Question"
   */
  router.post("/", isAdmin, async (req, res, next) => {
    try {
      const questionResponse = new QuestionModel(req.body);
      console.log(questionResponse);
      const newQuestion = await questionResponse.save();
      res.status(201).send({ question: newQuestion });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  });

  /**
   * @swagger
   * /api/questions/{id}:
   *  put:
   *    tags:
   *      - Questions
   *    description: Updates an existing question
   *    produces:
   *      - application/json
   *    parameters:
   *      - name: id
   *        description: Question's id
   *        in: path
   *        required: true
   *        type: string
   *      - name: question
   *        description: Question object
   *        in: body
   *        required: true
   *        schema:
   *          $ref: '#/definitions/Question'
   *    responses:
   *      200:
   *        description: Returns the updated question object
   *        schema:
   *          $ref: "#/definitions/Question"
   */
  router.put("/:id", isAdmin, async (req, res, next) => {
    const { question, answers, topics, type } = req.body;
    try {
      const newQuestion = await QuestionModel.findByIdAndUpdate(
        req.params.id,
        {
          question,
          answers,
          topics,
          type,
        },
        {
          new: true,
        }
      );
      res.send(newQuestion);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  });

  /**
   * @swagger
   * /api/questions/{id}:
   *  delete:
   *    tags:
   *      - Questions
   *    description: Deletes an existing question
   *    produces:
   *      - application/json
   *    parameters:
   *      - name: id
   *        description: Question's id
   *        in: path
   *        required: true
   *        type: string
   *    responses:
   *      204:
   *        description: Successfully deleted
   */
  router.delete("/:id", isAdmin, async (req, res, next) => {
    try {
      const questionResponse = await QuestionModel.findByIdAndDelete(
        req.params.id
      );
      console.log(questionResponse);
      res.status(204).send({ question: questionResponse });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  });
};
