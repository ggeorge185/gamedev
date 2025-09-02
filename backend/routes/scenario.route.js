import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
    createScenario,
    getAllScenarios,
    getActiveScenarios,
    getUserScenarios,
    getScenarioById,
    updateScenario,
    deleteScenario,
    reorderScenarios,
    getScenariosByTopic,
    toggleScenarioStatus
} from "../controllers/scenario.controller.js";

const router = express.Router();

// Protected routes (authentication required) - Put specific routes first
router.route("/create").post(isAuthenticated, createScenario);
router.route("/all").get(isAuthenticated, getAllScenarios);
router.route("/active").get(getActiveScenarios); // Public route for active scenarios
router.route("/user").get(isAuthenticated, getUserScenarios);
router.route("/reorder").put(isAuthenticated, reorderScenarios);

// Topic-based routes
router.route("/topic/:topic").get(getScenariosByTopic);

// Routes with parameters - Put these after specific routes to avoid conflicts
router.route("/:id").get(getScenarioById);
router.route("/:id").put(isAuthenticated, updateScenario);
router.route("/:id").delete(isAuthenticated, deleteScenario);
router.route("/:id/toggle-status").patch(isAuthenticated, toggleScenarioStatus);

export default router;