const express = require("express");
const { isAdmin, isAuth } = require("../lib/authMiddleware");
const router = express.Router({ mergeParams: true });
const ScoreModel = require("../models/score");

// Get all scores for a user
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

// Record a score
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

// Record a score
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
