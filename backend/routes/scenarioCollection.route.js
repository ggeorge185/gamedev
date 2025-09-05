import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
    getAllScenarioCollections,
    getCollectionsByLevel,
    getDefaultCollection,
    getUserScenarioCollections,
    getScenarioCollectionById,
    createScenarioCollection,
    updateScenarioCollection,
    deleteScenarioCollection,
    toggleCollectionStatus,
    setAsDefault
} from "../controllers/scenarioCollection.controller.js";

const router = express.Router();

// Get all scenario collections (with optional filters)
router.route("/all").get(isAuthenticated, getAllScenarioCollections);

// Get collections by language level
router.route("/level/:level").get(isAuthenticated, getCollectionsByLevel);

// Get default collection for a language level
router.route("/level/:level/default").get(isAuthenticated, getDefaultCollection);

// Get user's scenario collections
router.route("/user").get(isAuthenticated, getUserScenarioCollections);

// Create new scenario collection
router.route("/create").post(isAuthenticated, createScenarioCollection);

// Get, update, delete specific collection
router.route("/:id").get(isAuthenticated, getScenarioCollectionById);
router.route("/:id").put(isAuthenticated, updateScenarioCollection);
router.route("/:id").delete(isAuthenticated, deleteScenarioCollection);

// Toggle collection status (active/inactive)
router.route("/:id/toggle-status").patch(isAuthenticated, toggleCollectionStatus);

// Set collection as default for its language level
router.route("/:id/set-default").patch(isAuthenticated, setAsDefault);

export default router;