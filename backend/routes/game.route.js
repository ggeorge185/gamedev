import express from "express";
<<<<<<< HEAD
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
=======
import { 
    getAllScenarios, 
    getScenarioById,
    createScenario, 
    updateScenario,
    getAllGameTypes, 
    createGameType,
    getScenarioConfigs,
    createScenarioConfig,
    updateScenarioConfig
} from "../controllers/game.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isGameUserAuthenticated from "../middlewares/isGameUserAuthenticated.js";

const router = express.Router();

// Public routes for game users
router.route('/scenarios').get(getAllScenarios);
router.route('/scenarios/:scenarioId').get(getScenarioById);
router.route('/game-types').get(getAllGameTypes);
router.route('/scenario-configs').get(getScenarioConfigs);

// Admin-only routes (use admin authentication)
router.route('/admin/scenarios').post(isAuthenticated, createScenario);
router.route('/admin/scenarios/:scenarioId').put(isAuthenticated, updateScenario);
router.route('/admin/game-types').post(isAuthenticated, createGameType);
router.route('/admin/scenario-configs').post(isAuthenticated, createScenarioConfig);
router.route('/admin/scenario-configs/:configId').put(isAuthenticated, updateScenarioConfig);
>>>>>>> cb49ee8418adf8ecf637648a7497a9d945b1cd7e

export default router;