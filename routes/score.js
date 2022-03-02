const express = require("express");
const { isAdmin, isAuth } = require("../lib/authMiddleware");
const router = express.Router({ mergeParams: true });
const ScoreModel = require("../models/score");

/**
 * @swagger
 * definitions:
 *  Score:
 *    type: object
 *    properties:
 *      userId:
 *        type: string
 *      questionId:
 *        type: string
 *      isCorrect:
 *        type: boolean
 */

/**
 * @swagger
 * /api/user/scores:
 *  get:
 *    tags:
 *      - User/Scores
 *    description: Returns all scores for the requesting user. *Registered users only*
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: An object with an array of all scores
 *        schema:
 *            type: object
 *            properties:
 *              scores:
 *                type: array
 *                items:
 *                  $ref: "#/definitions/Score"
 *              success:
 *                type: boolean
 *              status_code:
 *                type: integer
 *              status_message:
 *                type: string
 */
router.get("/", isAuth, async (req, res, next) => {
  const userId = req.user.id;
  const scores = await ScoreModel.find({ userId });
  res.json({
    success: true,
    scores,
    status_code: 200,
    status_message: "Found your scores",
  });
});

  /**
   * @swagger
   * /api/user/scores:
   *  post:
   *    tags:
   *      - User/Scores
   *    description: Creates a new score for the logged in user. *Registered users only*
   *    produces:
   *      - application/json
   *    parameters:
   *      - name: score
   *        description: Score object
   *        in: body
   *        required: true
   *        schema:
   *          $ref: '#/definitions/Score'
   *    responses:
   *      201:
   *        description: Successfully created
   *        schema:
   *          $ref: "#/definitions/Score"
   */
router.post("/", isAuth, async (req, res, next) => {
  const userId = req.user.id;
  const questionId = req.body.questionId;
  const isCorrect = req.body.isCorrect;
  const score = await ScoreModel({
    userId,
    questionId,
    isCorrect,
  });
  await score.save().then(() => {
    res.status(201).json({
      success: true,
      status_code: 201,
      status_message: "New score recorded!",
    });
  });
});

  /**
   * @swagger
   * /api/user/scores/{id}:
   *  delete:
   *    tags:
   *      - User/Scores
   *    description: Deletes an existing score. *ADMIN ONLY*
   *    produces:
   *      - application/json
   *    parameters:
   *      - name: id
   *        description: Score id
   *        in: path
   *        required: true
   *        type: string
   *    responses:
   *      204:
   *        description: Successfully deleted
   */
  router.delete("/:scoreId", isAdmin, async (req, res, next) => {
  const scoreId = req.params.scoreId;
  await ScoreModel.findByIdAndDelete(scoreId).then((score) => {
    res.status(204).json({
      success: true,
      score,
      status_code: 204,
      status_message: "Document removed.",
    });
  });
});

module.exports = router;
