import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
    startGame,
    getGameData,
    submitGameResult,
    getPlayerResults,
    getScenarioLeaderboard
} from "../controllers/gamePlay.controller.js";

const router = express.Router();

// Start a new game session
router.route("/start/:scenarioId").post(isAuthenticated, startGame);

// Get formatted game data
router.route("/data").get(isAuthenticated, getGameData);

// Submit game result
router.route("/result").post(isAuthenticated, submitGameResult);

// Get player's game results/history
router.route("/results").get(isAuthenticated, getPlayerResults);

// Get leaderboard for a scenario
router.route("/leaderboard/:scenarioId").get(isAuthenticated, getScenarioLeaderboard);

export default router;