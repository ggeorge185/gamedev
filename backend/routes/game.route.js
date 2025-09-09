import express from "express";
import { 
    getAllScenarios, 
    getScenarioById,
    createScenario, 
    updateScenario,
    getAllGameTypes, 
    createGameType,
    updateGameType,
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
router.route('/admin/game-types/:gameTypeId').put(isAuthenticated, updateGameType);
router.route('/admin/scenario-configs').post(isAuthenticated, createScenarioConfig);
router.route('/admin/scenario-configs/:configId').put(isAuthenticated, updateScenarioConfig);

export default router;