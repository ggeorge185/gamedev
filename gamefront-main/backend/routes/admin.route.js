import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { 
    getGameDeployments,
    getAvailableGames,
    createGameDeployment,
    deleteGameDeployment
} from "../controllers/admin.controller.js";

const router = express.Router();

// Admin routes for game deployment management
router.get("/deployments", isAuthenticated, getGameDeployments);
router.get("/games/:scenario/:level", getAvailableGames); // Public route for frontend
router.post("/deployments", isAuthenticated, createGameDeployment);
router.delete("/deployments/:id", isAuthenticated, deleteGameDeployment);

export default router;