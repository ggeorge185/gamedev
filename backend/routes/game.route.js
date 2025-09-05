import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
    createGame,
    getAllGames,
    getActiveGames,
    getUserGames,
    getGameById,
    getGameByName,
    updateGame,
    deleteGame,
    searchGames,
    toggleGameStatus
} from "../controllers/game.controller.js";

const router = express.Router();

// Protected routes (authentication required) - Put specific routes first
router.route("/create").post(isAuthenticated, createGame);
router.route("/all").get(isAuthenticated, getAllGames);
router.route("/user").get(isAuthenticated, getUserGames);
router.route("/search").get(searchGames);
router.route("/active").get(getActiveGames);

// Routes with parameters - Put these after specific routes to avoid conflicts
router.route("/name/:name").get(getGameByName);
router.route("/:id").get(getGameById);
router.route("/:id").put(isAuthenticated, updateGame);
router.route("/:id").delete(isAuthenticated, deleteGame);
router.route("/:id/toggle-status").patch(isAuthenticated, toggleGameStatus);

export default router;